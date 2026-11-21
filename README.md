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

### Bank layouts
Saved layouts for each bank live in `cheque-printer/banks.js` (size and field positions in mm).
When a bank is selected its saved layout loads automatically; no adjustment is needed before printing.
To add a bank, measure its cheque (or a straight scan of it) and add an entry to `banks.js`.
Banks without an entry use the SBP standard default and show "Layout not set up yet".

### Setting up a new bank (simple)
Under the preview there are three options:
1. **Set up from a cheque photo**: drop a scan or a photo (taken from straight above) of a blank cheque.
   The tool finds the cheque corners, straightens it, and reads the 8 date boxes, the Pay line,
   the amount-in-words lines and the amount box (`cheque-reader.js`, plain JavaScript, runs in the browser).
   Enter the cheque size from a ruler, check what was found, then click *Use this layout*.
   The result is an Excel-style layout (boxes you can edit under *Advanced*) printed on Letter landscape,
   with the cheque at the same place on the page as the office Excel templates (`FEED_DEFAULT` in
   `index.html`, worked out from the Meezan template and a Meezan cheque photo), so cheques go into the
   printer the same way as before.
2. **Same layout as another bank**: copy a bank's saved layout in one click.
3. **Whole print a little off?**: after a test print, move everything together in 1 mm steps.
Then click **Save layout**. Field-by-field editing is under *Advanced*.

When you change `banks.js` or `cheque-reader.js`, bump the `?v=` number on their `<script>` tags in
`cheque-printer/index.html`, so browsers load the new file instead of a cached copy.

### First-time calibration (once per bank / cheque book)
1. Click **Test print (plain paper)** and print it on plain A4 at 100%.
2. Hold the printout behind a blank cheque against the light and check where the text falls.
3. Fix positions under **Layout & printer settings** (mm), or drag fields in the preview.
4. Use **Printer offset X/Y** if every field is shifted by the same amount.
5. Choose the paper mode that matches how the cheque sits in your printer: cheque-size page, A4 top-left, or A4 top-center.

Layouts and the register are saved in the browser (localStorage). Use **Layout file save karein** to back up the layouts or move them to another PC.

