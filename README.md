# Rafiq-Builders

Tools dashboard: https://devlopersoftware9-dev.github.io/Rafiq-Builders/

| Tool | Folder | Link |
|---|---|---|
| Cheque Printer | `cheque-printer/` | https://devlopersoftware9-dev.github.io/Rafiq-Builders/cheque-printer/ |

### Adding a new tool
1. Create a folder for it (e.g. `bank-reconciliation/`) with its own `index.html`.
2. Add one entry to the `TOOLS` list in the root `index.html`.
3. Link back to the dashboard from the tool with `<a href="../">`.

## Cheque Printer

Browser-based tool to fill and print bank cheques on a printer. No server or installation needed: open `cheque-printer/index.html` in Chrome or Edge.

### Features
- Date printed as `DDMMYYYY` in the 8 date boxes (SBP standard, PSD Circular No. 1 of 2014)
- Pay to name, amount in figures, and amount in words, generated automatically in English
  - Million (international) or Lakh / Crore system
  - Long amounts wrap onto the second words line automatically
- Optional "A/C Payee Only" crossing and "or bearer" strike-through
- Preset list of Pakistani banks, plus custom banks or cheque books
- Per-bank layout calibration: drag fields in the preview or set positions in mm
- Direct print, or a PDF at exact cheque size
- Cheque register with CSV export for Excel
- Layout export and import (JSON) to copy the calibration to another computer

### How to print
1. Fill in Bank, Date, Pay to and Amount.
2. Click **Seedha print karein** (direct print) or **Print PDF banayein** (PDF download).
3. In the print dialog set scale to **Actual size / 100%**. Turn off "Fit to page".

### First-time calibration (once per bank / cheque book)
1. Click **Test print (plain paper)** and print it on plain A4 at 100%.
2. Hold the printout behind a blank cheque against the light and check where the text falls.
3. Fix positions under **Layout & printer settings** (mm), or drag fields in the preview.
4. Use **Printer offset X/Y** if every field is shifted by the same amount.
5. Choose the paper mode that matches how the cheque sits in your printer: cheque-size page, A4 top-left, or A4 top-center.

Layouts and the register are saved in the browser (localStorage). Use **Layout file save karein** to back up the layouts or move them to another PC.

