// cal.js - externalized, easy-to-read calculator logic
// State variables
let finalAnswer = null;      // number: accumulated result or first operand
let currentOperand = null;   // string: digits being typed (e.g. "12.3") or null when empty
let currentOperator = null;  // string: '+', '-', '*', '/' or null
let expressionTokens = [];   // array of string tokens for expression display, e.g. ['1', '+', '2']
let lastActionWasEqual = false; // flag to change behavior after '=' press

// Helper: update the small display in cal.html
function updateDisplay() {
    const d = document.getElementById('display');
    if (!d) return;
    if (currentOperand !== null && currentOperand !== '') d.textContent = currentOperand;
    else if (finalAnswer !== null) d.textContent = String(finalAnswer);
    else d.textContent = '0';
}

// Update the expression box (shows expression while typing, result after '=')
function updateExpressionDisplay() {
    const e = document.getElementById('expression');
    if (!e) return;
    if (lastActionWasEqual) {
        e.textContent = String(finalAnswer !== null ? finalAnswer : '');
        return;
    }
    // build expression string from tokens and currentOperand
    const parts = [];
    for (const t of expressionTokens) parts.push(t);
    if (currentOperand !== null && currentOperand !== '') parts.push(currentOperand);
    e.textContent = parts.join(' ');
}

// Helper: perform a binary operation
function performOperation(a, operator, b) {
    a = Number(a);
    b = Number(b);
    switch (operator) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b === 0 ? NaN : a / b;
        default: return b;
    }
}

// Main API: called from the buttons in the HTML (cal(x))
function cal(input) {
    // digits are passed as numbers from the HTML; convert to string-digit when needed
    // 1) Decimal point
    if (input === '.') {
        if (currentOperand === null || currentOperand === undefined) currentOperand = '0.'; // start decimal
        else if (!String(currentOperand).includes('.')) currentOperand = String(currentOperand) + '.'; // append '.' if none
        lastActionWasEqual = false;
        updateDisplay();
        updateExpressionDisplay();
        return;
    }

    // 2) Operators
    if (input === '+' || input === '-' || input === '*' || input === '/') {
        // There must be a number to operate on
        if ((currentOperand === null || currentOperand === '') && finalAnswer === null) {
            alert('Enter a number first');
            return;
        }

        // Prevent entering two operators in a row
        if ((currentOperand === null || currentOperand === '') && currentOperator !== null) {
            alert("Don't enter two operators consecutively");
            return;
        }

        // Append the currentOperand (or finalAnswer if starting from previous result) to expression tokens
        if (currentOperand !== null && currentOperand !== '') {
            expressionTokens.push(String(currentOperand));
        } else if (lastActionWasEqual && finalAnswer !== null && expressionTokens.length === 0) {
            expressionTokens.push(String(finalAnswer));
        }

        // If we already have a pending operator and a new operand, optionally fold the calculation
        if (currentOperand !== null && currentOperand !== '') {
            if (finalAnswer === null) finalAnswer = parseFloat(currentOperand);
            else if (currentOperator !== null) finalAnswer = performOperation(finalAnswer, currentOperator, parseFloat(currentOperand));
        }

        // push the operator token for display
        expressionTokens.push(input);
        currentOperator = input;
        currentOperand = null; // ready for next number
        lastActionWasEqual = false;
        updateDisplay();
        updateExpressionDisplay();
        return;
    }

    // 3) Equals
    if (input === '=') {
        // If there is no operator, commit the currentOperand as the answer
        if (currentOperator === null) {
            if (currentOperand !== null && currentOperand !== '') finalAnswer = parseFloat(currentOperand);
            currentOperand = null;
            // update expression tokens to reflect the committed value
            expressionTokens = [];
            lastActionWasEqual = true;
            updateDisplay();
            updateExpressionDisplay();
            return;
        }

        // Need a second operand to compute
        if (currentOperand === null || currentOperand === '') {
            alert('Enter a number to complete the operation');
            return;
        }

        // complete the expression tokens and evaluate left-to-right
        expressionTokens.push(String(currentOperand));

        // evaluate tokens sequentially (left-to-right)
        let result = parseFloat(expressionTokens[0]);
        for (let i = 1; i < expressionTokens.length; i += 2) {
            const op = expressionTokens[i];
            const next = parseFloat(expressionTokens[i + 1]);
            result = performOperation(result, op, next);
        }

        finalAnswer = result;
        currentOperator = null;
        currentOperand = null;
        // show result in expression box
        expressionTokens = [String(finalAnswer)];
        lastActionWasEqual = true;
        updateDisplay();
        updateExpressionDisplay();
        return;
    }

    // 4) Clear (optional, not wired in original HTML but useful if added later)
    if (input === 'C') {
        finalAnswer = null;
        currentOperand = null;
        currentOperator = null;
        expressionTokens = [];
        lastActionWasEqual = false;
        updateDisplay();
        return;
    }

    // 5) Backspace (optional)
    if (input === 'BACK') {
        if (currentOperand && currentOperand.length > 0) {
            currentOperand = currentOperand.slice(0, -1);
            if (currentOperand === '') currentOperand = null;
            updateDisplay();
            updateExpressionDisplay();
        }
        return;
    }

    // 6) Digit (0-9). HTML may pass numbers like 0,1,2... so handle both number and string digits
    const digit = String(input);
    if (/^[0-9]$/.test(digit)) {
        // If last action was '=', start a new expression on digit entry
        if (lastActionWasEqual) {
            finalAnswer = null;
            expressionTokens = [];
            lastActionWasEqual = false;
            currentOperand = digit;
        } else {
            if (currentOperand === null || currentOperand === undefined) currentOperand = digit;
            else currentOperand = String(currentOperand) + digit;
        }
        updateDisplay();
        updateExpressionDisplay();
        return;
    }

    // Unexpected input
    console.warn('Unhandled cal() input:', input);
}

// initialize simple display when the script loads
updateDisplay();
