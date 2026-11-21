// Saved cheque layouts per bank. All measurements are in millimetres.
// w/h = cheque size. Each field's x = from left edge, y = from top edge to the text baseline.
// date.x = centre of the first date box, date.pitch = distance between date boxes.
// A bank that is not listed here uses the SBP standard default (178 x 80 mm).
//
// mode "excel": layout copied from the office Excel cheque templates (Sheet3).
//   page = paper the PDF is printed on (landscape), origin = top-left of the print area on that page
//   (the Excel left/top margins), boxes = the merged cells, already multiplied by the Excel print scale.
//   Fonts: Constantia in Excel is printed with Times.
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
 "Meezan Bank": {
  "mode": "excel",
  "page": {
   "w": 279.4,
   "h": 215.9,
   "paper": "Letter"
  },
  "origin": {
   "x": 128.52,
   "y": 78.49
  },
  "scale": 0.96,
  "area": {
   "w": 137.67,
   "h": 33.43
  },
  "boxes": {
   "date": {
    "x": 103.63,
    "y": 0.0,
    "w": 34.04,
    "h": 10.57,
    "font": "helvetica",
    "srcFont": "Arial",
    "size": 11.52,
    "bold": true,
    "h_align": "right",
    "v_align": "center",
    "wrap": false,
    "shrink": false
   },
   "payee": {
    "x": 0.0,
    "y": 10.57,
    "w": 116.84,
    "h": 10.16,
    "font": "helvetica",
    "srcFont": "Arial",
    "size": 10.56,
    "bold": true,
    "h_align": "left",
    "v_align": "bottom",
    "wrap": false,
    "shrink": true
   },
   "words": {
    "x": 0.0,
    "y": 20.98,
    "w": 85.85,
    "h": 12.45,
    "font": "helvetica",
    "srcFont": "Arial",
    "size": 10.56,
    "bold": true,
    "h_align": "center",
    "v_align": "center",
    "wrap": true,
    "shrink": false
   },
   "figures": {
    "x": 103.63,
    "y": 22.0,
    "w": 34.04,
    "h": 7.87,
    "font": "helvetica",
    "srcFont": "Arial",
    "size": 11.52,
    "bold": true,
    "h_align": "right",
    "v_align": "bottom",
    "wrap": false,
    "shrink": false
   }
  },
  "payeePrefix": "    ",
  "wordsPrefix": "= ",
  "dateFormat": "DD-MM-YYYY",
  "wordsStyle": "excel-lakh",
  "figStyle": "eq-lakh",
  "source": "From Excel template MZ_CHQ_PRINT.xlsx (Sheet3), 2026-11-21"
 },
 "United Bank (UBL)": {
  "mode": "excel",
  "page": {
   "w": 279.4,
   "h": 215.9,
   "paper": "Letter"
  },
  "origin": {
   "x": 139.45,
   "y": 76.45
  },
  "scale": 0.96,
  "area": {
   "w": 126.49,
   "h": 36.07
  },
  "boxes": {
   "date": {
    "x": 92.2,
    "y": 0.0,
    "w": 34.29,
    "h": 18.03,
    "font": "helvetica",
    "srcFont": "Arial",
    "size": 11.52,
    "bold": false,
    "h_align": "right",
    "v_align": "bottom",
    "wrap": false,
    "shrink": false
   },
   "payee": {
    "x": 0.0,
    "y": 18.03,
    "w": 105.41,
    "h": 7.37,
    "font": "helvetica",
    "srcFont": "Arial",
    "size": 10.56,
    "bold": false,
    "h_align": "left",
    "v_align": "bottom",
    "wrap": false,
    "shrink": true
   },
   "words": {
    "x": 0.0,
    "y": 25.65,
    "w": 85.85,
    "h": 10.41,
    "font": "helvetica",
    "srcFont": "Arial",
    "size": 10.56,
    "bold": false,
    "h_align": "left",
    "v_align": "center",
    "wrap": true,
    "shrink": false
   },
   "figures": {
    "x": 92.2,
    "y": 27.43,
    "w": 34.29,
    "h": 6.86,
    "font": "helvetica",
    "srcFont": "Arial",
    "size": 11.52,
    "bold": false,
    "h_align": "right",
    "v_align": "center",
    "wrap": false,
    "shrink": false
   }
  },
  "payeePrefix": "    ",
  "wordsPrefix": "= ",
  "dateFormat": "DD-MM-YYYY",
  "wordsStyle": "excel-lakh",
  "figStyle": "eq-lakh",
  "source": "From Excel template UBL_CHQ_PRINT.xlsx (Sheet3), 2026-11-21"
 },
 "MCB Bank": {
  "mode": "excel",
  "page": {
   "w": 279.4,
   "h": 215.9,
   "paper": "Letter"
  },
  "origin": {
   "x": 139.45,
   "y": 75.95
  },
  "scale": 0.94,
  "area": {
   "w": 126.1,
   "h": 38.4
  },
  "boxes": {
   "date": {
    "x": 90.28,
    "y": 0.0,
    "w": 35.81,
    "h": 14.18,
    "font": "helvetica",
    "srcFont": "Arial",
    "size": 11.28,
    "bold": false,
    "h_align": "right",
    "v_align": "bottom",
    "wrap": false,
    "shrink": false
   },
   "payee": {
    "x": 0.0,
    "y": 14.18,
    "w": 103.21,
    "h": 8.66,
    "font": "times",
    "srcFont": "Constantia",
    "size": 10.34,
    "bold": false,
    "h_align": "left",
    "v_align": "bottom",
    "wrap": false,
    "shrink": true
   },
   "words": {
    "x": 0.0,
    "y": 23.08,
    "w": 84.06,
    "h": 15.32,
    "font": "times",
    "srcFont": "Constantia",
    "size": 10.34,
    "bold": false,
    "h_align": "left",
    "v_align": "center",
    "wrap": true,
    "shrink": false
   },
   "figures": {
    "x": 90.28,
    "y": 26.76,
    "w": 35.81,
    "h": 6.96,
    "font": "helvetica",
    "srcFont": "Arial",
    "size": 11.28,
    "bold": false,
    "h_align": "right",
    "v_align": "center",
    "wrap": false,
    "shrink": false
   }
  },
  "payeePrefix": "    ",
  "wordsPrefix": "= ",
  "dateFormat": "DD-MM-YYYY",
  "wordsStyle": "excel-lakh",
  "figStyle": "eq-lakh",
  "source": "From Excel template MCB__HBL_CHQ_PRINT.xlsx (Sheet3), 2026-11-21"
 },
 "Habib Bank (HBL)": {
  "mode": "excel",
  "page": {
   "w": 279.4,
   "h": 215.9,
   "paper": "Letter"
  },
  "origin": {
   "x": 139.45,
   "y": 75.95
  },
  "scale": 0.94,
  "area": {
   "w": 126.1,
   "h": 38.4
  },
  "boxes": {
   "date": {
    "x": 90.28,
    "y": 0.0,
    "w": 35.81,
    "h": 14.18,
    "font": "helvetica",
    "srcFont": "Arial",
    "size": 11.28,
    "bold": false,
    "h_align": "right",
    "v_align": "bottom",
    "wrap": false,
    "shrink": false
   },
   "payee": {
    "x": 0.0,
    "y": 14.18,
    "w": 103.21,
    "h": 8.66,
    "font": "times",
    "srcFont": "Constantia",
    "size": 10.34,
    "bold": false,
    "h_align": "left",
    "v_align": "bottom",
    "wrap": false,
    "shrink": true
   },
   "words": {
    "x": 0.0,
    "y": 23.08,
    "w": 84.06,
    "h": 15.32,
    "font": "times",
    "srcFont": "Constantia",
    "size": 10.34,
    "bold": false,
    "h_align": "left",
    "v_align": "center",
    "wrap": true,
    "shrink": false
   },
   "figures": {
    "x": 90.28,
    "y": 26.76,
    "w": 35.81,
    "h": 6.96,
    "font": "helvetica",
    "srcFont": "Arial",
    "size": 11.28,
    "bold": false,
    "h_align": "right",
    "v_align": "center",
    "wrap": false,
    "shrink": false
   }
  },
  "payeePrefix": "    ",
  "wordsPrefix": "= ",
  "dateFormat": "DD-MM-YYYY",
  "wordsStyle": "excel-lakh",
  "figStyle": "eq-lakh",
  "source": "From Excel template MCB__HBL_CHQ_PRINT.xlsx (Sheet3), 2026-11-21"
 }
};
