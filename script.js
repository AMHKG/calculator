// Global variables
let currentExpression = '';
let resetDisplay = false;

// DOM elements
const Btns = document.querySelectorAll('[data-value]');
const equalsBtn = document.getElementById('equalsBtn');
const clearBtn = document.getElementById('clearBtn');
const backspaceBtn = document.getElementById('backspaceBtn');
const displayHistory = document.getElementById('displayHistory');
const displayExpression = document.getElementById('displayExpression');

// Event listeners
Btns.forEach((btn) => btn.addEventListener('click', () => append(btn.dataset.value)));
equalsBtn.addEventListener('click', evaluate);
clearBtn.addEventListener('click', clear);
backspaceBtn.addEventListener('click', deleteLast);

// Logic
function clear() {
    currentExpression = '';
    displayExpression.textContent = '0';
    displayHistory.innerHTML = '';
}

function deleteLast() {
    if (resetDisplay) return;
    currentExpression = currentExpression.toString().slice(0, -1);
    updateDisplay();
}

function append(value) {
    const operators = ['+', '-', '*', '/'];
    const lastChar = currentExpression.slice(-1);

    if (resetDisplay && !operators.includes(value)) {
        currentExpression = '';
    }
    resetDisplay = false;

    if (operators.includes(value) && operators.includes(lastChar)) {
        currentExpression = currentExpression.slice(0, -1); 
    }

    if (currentExpression === '' && ['*', '/', '+'].includes(value)) return;

    if (value === '.') {
        const parts = currentExpression.split(/[\+\-\*\/]/);
        if (parts[parts.length - 1].includes('.')) return;
    }

    currentExpression += value;
    updateDisplay();
}

function updateDisplay() {
    let visualExpression = currentExpression
        .replace(/\*/g, '×')
        .replace(/\//g, '÷');
    displayExpression.textContent = visualExpression || '0';
}

function evaluate() {
    if (currentExpression === '') return;

    let result;
    try {
        if (currentExpression.includes('/0')) {
            throw new Error("DivisionByZero");
        }
        
        result = eval(currentExpression);
        console.log(result);

        if (!Number.isInteger(result)) {
            result = parseFloat(result.toFixed(8));
            console.log(result);
        }
    } catch (error) {
        result = error.message === "DivisionByZero" ? "Cannot divide by 0" : "Error";
    }

    addToHistory(currentExpression, result);
    displayExpression.textContent = result;
    currentExpression = result.toString();
    resetDisplay = true;
}

function addToHistory(expression, result) {
    let entry = document.createElement('div');
    entry.classList.add('history-entry');

    let visualExpression = expression.replace(/\*/g, '×').replace(/\//g, '÷');

    entry.innerHTML = `
        <span>${visualExpression}</span>
        <span>=</span>
        <span>${result}</span>
    `;
    
    displayHistory.appendChild(entry);
    displayHistory.scrollTop = displayHistory.scrollHeight;
}