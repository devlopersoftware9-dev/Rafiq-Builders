// Cheque photo reader: finds the cheque in a photo, straightens it, and reads the
// date boxes, the Pay line, the amount-in-words lines and the amount box.
// Plain JavaScript, no libraries. All results are in millimetres from the cheque's top-left corner.
(function (root) {
  "use strict";
  const PPM = 8; // pixels per mm in the straightened image

  function toGray(data, w, h) {
    const g = new Uint8ClampedArray(w * h);
    for (let i = 0, j = 0; j < g.length; i += 4, j++) g[j] = (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000;
    return g;
  }

  function otsu(g) {
    const hist = new Array(256).fill(0); g.forEach(v => hist[v]++);
    let sum = 0; for (let i = 0; i < 256; i++) sum += i * hist[i];
    let sumB = 0, wB = 0, best = 0, thr = 128; const total = g.length;
    for (let t = 0; t < 256; t++) {
      wB += hist[t]; if (!wB) continue; const wF = total - wB; if (!wF) break;
      sumB += t * hist[t]; const mB = sumB / wB, mF = (sum - sumB) / wF, between = wB * wF * (mB - mF) * (mB - mF);
      if (between > best) { best = between; thr = t; }
    }
    return thr;
  }

  // Connected components (4-neighbour) of pixels where mask[i] === val. Returns labels and stats.
  function components(mask, w, h, val) {
    const lab = new Int32Array(w * h).fill(-1), stats = [], stack = new Int32Array(w * h);
    for (let s = 0; s < w * h; s++) {
      if (mask[s] !== val || lab[s] !== -1) continue;
      const id = stats.length; let sp = 0; stack[sp++] = s; lab[s] = id;
      let x0 = w, y0 = h, x1 = 0, y1 = 0, area = 0;
      while (sp) {
        const p = stack[--sp], x = p % w, y = (p - x) / w; area++;
        if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
        if (x > 0 && mask[p - 1] === val && lab[p - 1] === -1) { lab[p - 1] = id; stack[sp++] = p - 1; }
        if (x < w - 1 && mask[p + 1] === val && lab[p + 1] === -1) { lab[p + 1] = id; stack[sp++] = p + 1; }
        if (y > 0 && mask[p - w] === val && lab[p - w] === -1) { lab[p - w] = id; stack[sp++] = p - w; }
        if (y < h - 1 && mask[p + w] === val && lab[p + w] === -1) { lab[p + w] = id; stack[sp++] = p + w; }
      }
      stats.push({ x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1, area });
    }
    return { lab, stats };
  }

  // Find the 4 corners of the cheque (tl, tr, br, bl) in image pixels.
  function findCorners(data, w, h) {
    const sc = Math.min(1, 1400 / Math.max(w, h)), sw = Math.max(2, Math.round(w * sc)), sh = Math.max(2, Math.round(h * sc));
    const g = new Uint8ClampedArray(sw * sh);
    for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
      const i = (Math.min(h - 1, Math.floor(y / sc)) * w + Math.min(w - 1, Math.floor(x / sc))) * 4;
      g[y * sw + x] = (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000;
    }
    const t = otsu(g), m = new Uint8Array(sw * sh); for (let i = 0; i < g.length; i++) m[i] = g[i] > t ? 1 : 0;
    const { lab, stats } = components(m, sw, sh, 1);
    const full = { corners: [[0, 0], [w, 0], [w, h], [0, h]], found: false };
    if (!stats.length) return full;
    let big = 0; stats.forEach((s, i) => { if (s.area > stats[big].area) big = i; });
    const B = stats[big];
    if (B.area < 0.03 * sw * sh) return full;
    if (B.w > 0.97 * sw && B.h > 0.97 * sh) return full; // a scan: the cheque fills the picture
    let tl = null, tr = null, br = null, bl = null, a = 1e9, b = -1e9, c = -1e9, d = 1e9;
    for (let y = B.y; y < B.y + B.h; y++) for (let x = B.x; x < B.x + B.w; x++) {
      if (lab[y * sw + x] !== big) continue;
      if (x + y < a) { a = x + y; tl = [x, y]; } if (x + y > b) { b = x + y; br = [x, y]; }
      if (x - y > c) { c = x - y; tr = [x, y]; } if (x - y < d) { d = x - y; bl = [x, y]; }
    }
    let corners = [tl, tr, br, bl].map(p => [(p[0] + 0.5) / sc, (p[1] + 0.5) / sc]);
    const ww = (dist(corners[0], corners[1]) + dist(corners[3], corners[2])) / 2, hh = (dist(corners[0], corners[3]) + dist(corners[1], corners[2])) / 2;
    const r = ww / hh;
    if (r >= 1.3 && r <= 3.8) return { corners, found: true, portrait: false };
    // Cheque photographed standing up: turn the corner order so the long side is the top.
    if (1 / r >= 1.3 && 1 / r <= 3.8) { corners = [corners[3], corners[0], corners[1], corners[2]]; return { corners, found: true, portrait: true }; }
    return full;
  }
  function dist(p, q) { return Math.hypot(p[0] - q[0], p[1] - q[1]); }
  function estimateAspect(c) { return ((dist(c[0], c[1]) + dist(c[3], c[2])) / 2) / ((dist(c[0], c[3]) + dist(c[1], c[2])) / 2); }

  // Homography mapping dst (unit cheque rectangle in px) -> src (photo), solved from 4 point pairs.
  function homography(from, to) {
    const A = [], bb = [];
    for (let i = 0; i < 4; i++) {
      const [x, y] = from[i], [u, v] = to[i];
      A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); bb.push(u);
      A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); bb.push(v);
    }
    const n = 8;
    for (let i = 0; i < n; i++) {
      let p = i; for (let r = i + 1; r < n; r++) if (Math.abs(A[r][i]) > Math.abs(A[p][i])) p = r;
      [A[i], A[p]] = [A[p], A[i]]; [bb[i], bb[p]] = [bb[p], bb[i]];
      for (let r = 0; r < n; r++) { if (r === i) continue; const f = A[r][i] / A[i][i]; for (let k = i; k < n; k++) A[r][k] -= f * A[i][k]; bb[r] -= f * bb[i]; }
    }
    const hv = bb.map((v, i) => v / A[i][i]); hv.push(1); return hv;
  }

  function warp(data, w, h, corners, Wmm, Hmm) {
    const W = Math.round(Wmm * PPM), H = Math.round(Hmm * PPM);
    const Hm = homography([[0, 0], [W, 0], [W, H], [0, H]], corners);
    const out = new Uint8ClampedArray(W * H * 4);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const z = Hm[6] * x + Hm[7] * y + 1, sx = (Hm[0] * x + Hm[1] * y + Hm[2]) / z, sy = (Hm[3] * x + Hm[4] * y + Hm[5]) / z;
      const x0 = Math.floor(sx), y0 = Math.floor(sy), fx = sx - x0, fy = sy - y0, o = (y * W + x) * 4;
      if (x0 < 0 || y0 < 0 || x0 >= w - 1 || y0 >= h - 1) { out[o] = out[o + 1] = out[o + 2] = 255; out[o + 3] = 255; continue; }
      const i00 = (y0 * w + x0) * 4, i10 = i00 + 4, i01 = i00 + w * 4, i11 = i01 + 4;
      for (let k = 0; k < 3; k++) out[o + k] = (data[i00 + k] * (1 - fx) + data[i10 + k] * fx) * (1 - fy) + (data[i01 + k] * (1 - fx) + data[i11 + k] * fx) * fy;
      out[o + 3] = 255;
    }
    return { data: out, w: W, h: H };
  }

  function adaptiveInv(g, w, h, block, C) {
    const I = new Float64Array((w + 1) * (h + 1));
    for (let y = 0; y < h; y++) { let row = 0; for (let x = 0; x < w; x++) { row += g[y * w + x]; I[(y + 1) * (w + 1) + x + 1] = I[y * (w + 1) + x + 1] + row; } }
    const r = block >> 1, out = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const xa = Math.max(0, x - r), xb = Math.min(w, x + r + 1), ya = Math.max(0, y - r), yb = Math.min(h, y + r + 1);
      const mean = (I[yb * (w + 1) + xb] - I[ya * (w + 1) + xb] - I[yb * (w + 1) + xa] + I[ya * (w + 1) + xa]) / ((xb - xa) * (yb - ya));
      out[y * w + x] = g[y * w + x] < mean - C ? 1 : 0;
    }
    return out;
  }
  // Morphological opening with a 1-D line: keep only runs at least `len` long.
  function keepRuns(b, w, h, len, horizontal) {
    const out = new Uint8Array(w * h), A = horizontal ? h : w, Bn = horizontal ? w : h;
    for (let a = 0; a < A; a++) {
      let start = -1;
      for (let k = 0; k <= Bn; k++) {
        const idx = horizontal ? a * w + k : k * w + a, on = k < Bn && b[idx];
        if (on && start < 0) start = k;
        if (!on && start >= 0) { if (k - start >= len) for (let q = start; q < k; q++) out[horizontal ? a * w + q : q * w + a] = 1; start = -1; }
      }
    }
    return out;
  }
  function dilate3(b, w, h) {
    const out = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (!b[y * w + x]) continue;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < w && Y < h) out[Y * w + X] = 1; }
    }
    return out;
  }

  function detect(img, Wmm, Hmm) {
    const { data, w: W, h: H } = img, mm = v => v / PPM;
    const g = toGray(data, W, H), b = adaptiveInv(g, W, H, 31, 12);
    const hm = keepRuns(b, W, H, 4 * PPM, true), vm = keepRuns(b, W, H, 3 * PPM, false);
    const grid = new Uint8Array(W * H); for (let i = 0; i < grid.length; i++) grid[i] = hm[i] | vm[i];
    const gd = dilate3(grid, W, H);
    const cc = components(gd, W, H, 0).stats;
    const cells = cc.filter(s => s.x > 1 && s.y > 1 && s.x + s.w < W - 1 && s.y + s.h < H - 1 && s.area >= 0.7 * s.w * s.h)
      .map(s => ({ x: mm(s.x), y: mm(s.y), w: mm(s.w), h: mm(s.h) }));
    // Date boxes: small cells in the upper right, in one row.
    const small = cells.filter(c => c.w >= 3 && c.w <= 11 && c.h >= 4 && c.h <= 12 && c.y < Hmm * 0.45 && c.x > Wmm * 0.35).sort((a, b) => a.y - b.y);
    const rows = [];
    small.forEach(c => { const r = rows.find(r => Math.abs(r[0].y - c.y) < 3 && Math.abs(r[0].h - c.h) < 2.5); if (r) r.push(c); else rows.push([c]); });
    let date = null;
    const good = rows.filter(r => r.length >= 5).map(r => r.sort((a, b) => a.x - b.x));
    if (good.length) {
      good.sort((a, b) => Math.abs(a.length - 8) - Math.abs(b.length - 8) || b[0].x - a[0].x);
      date = good[0].length > 8 ? good[0].slice(-8) : good[0];
    }
    // Amount box.
    const amts = cells.filter(c => c.w >= 18 && c.w <= 75 && c.h >= 5 && c.h <= 18 && c.x > Wmm * 0.45 && c.y > Hmm * 0.25 && c.y < Hmm * 0.8);
    const amount = amts.length ? amts.reduce((a, c) => (c.w * c.h > a.w * a.h ? c : a)) : null;
    // Long horizontal lines.
    let lines = components(hm, W, H, 1).stats.filter(s => s.w > 0.25 * W && s.h < 2.5 * PPM).map(s => ({ x1: mm(s.x), y: mm(s.y + s.h / 2), x2: mm(s.x + s.w) }));
    const inside = (l, bx) => bx && bx.x - 1 <= l.x1 && l.x2 <= bx.x + bx.w + 1 && bx.y - 1 <= l.y && l.y <= bx.y + bx.h + 1;
    lines = lines.filter(l => !inside(l, amount) && l.y > 6 && l.y < Hmm * 0.72);
    // The Pay line and the amount-in-words lines start on the left part of the cheque.
    // Lines that start on the right are box edges (date boxes, cheque number, amount box) or the signature line.
    lines = lines.filter(l => l.x1 < Wmm * 0.45);
    if (date) { const bottom = Math.max(...date.map(b => b.y + b.h)); lines = lines.filter(l => l.y > bottom + 2 || l.x2 < date[0].x); }
    lines.sort((a, b) => a.y - b.y);
    const merged = [];
    lines.forEach(l => { const m = merged[merged.length - 1]; if (m && Math.abs(m.y - l.y) < 1.2) { m.x1 = Math.min(m.x1, l.x1); m.x2 = Math.max(m.x2, l.x2); m.y = (m.y + l.y) / 2; } else merged.push(Object.assign({}, l)); });
    return { date, amount, lines: merged };
  }

  // Full read: photo pixels + corners + cheque size -> fields and the straightened image.
  function read(data, w, h, corners, Wmm, Hmm) {
    const img = warp(data, w, h, corners, Wmm, Hmm);
    return { fields: detect(img, Wmm, Hmm), image: img };
  }

  // Turning the corner order by k steps turns the straightened cheque by k x 90 degrees.
  function turn(c, k) { k = ((k % 4) + 4) % 4; return c.slice(k).concat(c.slice(0, k)); }
  function score(F) { return Math.min(8, F.date ? F.date.length : 0) * 3 + (F.amount ? 4 : 0) + Math.min(3, F.lines.length) * 2; }
  // Read the cheque the right way up: try it as given and upside down, keep the better result.
  function readBest(data, w, h, corners, Wmm, Hmm) {
    let best = null;
    [0, 2].forEach(k => {
      const c = turn(corners, k), r = read(data, w, h, c, Wmm, Hmm), sc = score(r.fields);
      if (!best || sc > best.score) best = { score: sc, corners: c, fields: r.fields, image: r.image, turned: k };
    });
    return best;
  }

  const api = { PPM, findCorners, estimateAspect, read, readBest, turn, score, warp, detect };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.ChequeReader = api;
})(typeof window !== "undefined" ? window : globalThis);
