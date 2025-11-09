# Calculator

Small browser-based calculator.

## What I changed
- Added keyboard support so you can use the physical keyboard to drive the calculator.
  - Digits 0-9 and `.` insert numbers
  - `+`, `-`, `*`, `/` enter the operators
  - `Enter` or `=` evaluates the expression
  - `Backspace` removes the last typed digit
  - `Escape` or `C` clears the calculator
  - When a button has focus, `Enter` or `Space` activates the button

These keyboard mappings are implemented in `cal.js` via a global `keydown` listener.

## How to use
1. Open `cal.html` in a browser (double-click the file or open via Live Server).
2. Use the on-screen buttons with mouse or click buttons with keyboard.

## Push this folder to GitHub (PowerShell)
If you already have an empty remote repo on GitHub, run the following from the project folder (PowerShell):

```powershell
git init ;
git add . ;
git commit -m "Add keyboard support and README" ;
# replace <REMOTE_URL> with the URL of your GitHub repo, e.g. https://github.com/you/Calculator.git
git remote add origin <REMOTE_URL> ;
git branch -M main ;
git push -u origin main
```

If you already have a remote set up, just do:

```powershell
git add . ;
git commit -m "Add keyboard support and README" ;
git push
```

## Notes
- There are `C` and `BACK` actions implemented in `cal.js`; Escape and Backspace are mapped to them.
- This is a small static page—no build steps are required.
