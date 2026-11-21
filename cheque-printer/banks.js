// Saved cheque layouts per bank. All measurements are in millimetres.
// w/h = cheque size. Each field's x = from left edge, y = from top edge to the text baseline.
// date.x = centre of the first date box, date.pitch = distance between date boxes.
// A bank that is not listed here uses the SBP standard default (178 x 80 mm).
//
// Example entry:
// "Meezan Bank": {
//   w: 175, h: 76,
//   date:     { x: 131, y: 13,   pitch: 5.5, size: 11 },
//   payee:    { x: 20,  y: 26,   maxw: 120,  size: 11 },
//   words1:   { x: 32,  y: 35,   maxw: 130 },
//   words2:   { x: 10,  y: 43,   maxw: 110 },
//   wordsSize: 10.5,
//   figures:  { x: 138, y: 44,   size: 12 },
//   payeeOnly:{ x: 70,  y: 17,   angle: 12, size: 8 },
//   bearer:   { x1: 145, x2: 166, y: 24.5 },
//   source: "Measured from cheque scan, 2026-11-21"
// },
window.BANK_PRESETS = {
};
