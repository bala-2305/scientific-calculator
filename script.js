const formulaDisplay = document.getElementById('formula');
const mainDisplay = document.getElementById('display');
const historyList = document.getElementById('history-list');

function clearDisplay() {
    formulaDisplay.value = '';
    mainDisplay.value = '0';
}

function deleteLast() {
    formulaDisplay.value = formulaDisplay.value.slice(0, -1);
    if (formulaDisplay.value === '') {
        mainDisplay.value = '0';
    }
}

function appendToDisplay(value) {
    // If the main display shows a previous result or error, and we type a number, clear it?
    // Actually, just appending to formula is fine for this simple version.
    formulaDisplay.value += value;
    formulaDisplay.scrollLeft = formulaDisplay.scrollWidth;
}

function calculate() {
    try {
        let expression = formulaDisplay.value;
        if (!expression) return;

        let result = eval(expression);
        
        if (result === undefined || result === null) {
            mainDisplay.value = '0';
        } else {
            if (typeof result === 'number' && !Number.isInteger(result)) {
                result = parseFloat(result.toFixed(8));
            }
            mainDisplay.value = result;
            addToHistory(expression, result);
        }
    } catch (e) {
        mainDisplay.value = 'Error';
    }
}

function addToHistory(expression, result) {
    const li = document.createElement('li');
    // Prettify expression for history
    let prettyExpr = expression.replace(/Math\./g, '').replace(/\*\*/g, '^');
    li.textContent = `${prettyExpr} = ${result}`;
    li.onclick = () => {
        formulaDisplay.value = expression;
    };
    historyList.prepend(li);
    
    // Keep only last 20 items
    while (historyList.children.length > 20) {
        historyList.removeChild(historyList.lastChild);
    }
}

function clearHistory() {
    historyList.innerHTML = '';
}

// Helper functions for the calculator
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function toDegrees(radians) {
    return radians * (180 / Math.PI);
}

function areaCircle(radius) {
    return Math.PI * Math.pow(radius, 2);
}

function areaRectangle(length, width) {
    return length * width;
}

// Keyboard Support
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase(); // Make it case insensitive
    const allowedKeys = '0123456789+-*/.()^';
    
    if (allowedKeys.includes(key)) {
        event.preventDefault();
        if (key === '^') appendToDisplay('**');
        else appendToDisplay(key);
    } else if (key === 'enter') {
        event.preventDefault();
        calculate();
    } else if (key === 'backspace') {
        event.preventDefault();
        deleteLast();
    } else if (key === 'escape') {
        event.preventDefault();
        clearDisplay();
    } else {
        // Scientific function keys
        const functionMappings = {
            's': 'Math.sin(',
            'c': 'Math.cos(',
            't': 'Math.tan(',
            'l': 'Math.log10(',
            'n': 'Math.log(',
            'r': 'Math.sqrt(',
            'p': 'Math.PI',
            'e': 'Math.E',
            'x': 'Math.exp(',
            'd': 'toDegrees(',
            'f': 'toRadians(',
            'a': 'areaCircle(',
            'b': 'areaRectangle('
        };
        
        if (functionMappings[key]) {
            event.preventDefault();
            appendToDisplay(functionMappings[key]);
        }
    }
});
