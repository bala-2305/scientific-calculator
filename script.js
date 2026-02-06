// Tab switching
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to the button for this tab
    const button = Array.from(document.querySelectorAll('.tab-button')).find(btn => btn.onclick.toString().includes(tabName));
    if (button) button.classList.add('active');
}

// Currency conversion rates (static for demo)
const exchangeRates = {
    'USD': { 'EUR': 0.85, 'GBP': 0.73, 'INR': 74.5, 'JPY': 110.0 },
    'EUR': { 'USD': 1.18, 'GBP': 0.86, 'INR': 87.5, 'JPY': 129.0 },
    'GBP': { 'USD': 1.37, 'EUR': 1.16, 'INR': 101.5, 'JPY': 150.0 },
    'INR': { 'USD': 0.013, 'EUR': 0.011, 'GBP': 0.0099, 'JPY': 1.48 },
    'JPY': { 'USD': 0.0091, 'EUR': 0.0078, 'GBP': 0.0067, 'INR': 0.68 }
};

function convertCurrency() {
    const amount = parseFloat(document.getElementById('amount').value);
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const resultDisplay = document.getElementById('currencyResult');
    
    if (isNaN(amount)) {
        resultDisplay.textContent = 'Please enter a valid amount';
        return;
    }
    
    if (fromCurrency === toCurrency) {
        resultDisplay.textContent = `${amount} ${fromCurrency}`;
        return;
    }
    
    const rate = exchangeRates[fromCurrency][toCurrency];
    const result = (amount * rate).toFixed(2);
    resultDisplay.textContent = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
    addToHistory(`${amount} ${fromCurrency} to ${toCurrency}`, `${result} ${toCurrency}`, 'currency');
}

// Unit conversion factors (to base unit: meters for length, square meters for area, cubic meters for volume)
const unitConversions = {
    length: {
        'm': 1,
        'cm': 0.01,
        'mm': 0.001,
        'km': 1000,
        'in': 0.0254,
        'ft': 0.3048,
        'yd': 0.9144,
        'mi': 1609.34
    },
    area: {
        'm': 1, // m²
        'cm': 0.0001, // cm²
        'mm': 0.000001, // mm²
        'km': 1000000, // km²
        'in': 0.00064516, // in²
        'ft': 0.092903, // ft²
        'yd': 0.836127, // yd²
        'mi': 2589988.11 // mi²
    },
    volume: {
        'm': 1, // m³
        'cm': 0.000001, // cm³
        'mm': 0.000000001, // mm³
        'km': 1000000000, // km³
        'in': 0.000016387, // in³
        'ft': 0.0283168, // ft³
        'yd': 0.764555, // yd³
        'mi': 4168181825.44 // mi³
    }
};

const unitLabels = {
    length: {
        'm': 'Meters',
        'cm': 'Centimeters',
        'mm': 'Millimeters',
        'km': 'Kilometers',
        'in': 'Inches',
        'ft': 'Feet',
        'yd': 'Yards',
        'mi': 'Miles'
    },
    area: {
        'm': 'Square Meters',
        'cm': 'Square Centimeters',
        'mm': 'Square Millimeters',
        'km': 'Square Kilometers',
        'in': 'Square Inches',
        'ft': 'Square Feet',
        'yd': 'Square Yards',
        'mi': 'Square Miles'
    },
    volume: {
        'm': 'Cubic Meters',
        'cm': 'Cubic Centimeters',
        'mm': 'Cubic Millimeters',
        'km': 'Cubic Kilometers',
        'in': 'Cubic Inches',
        'ft': 'Cubic Feet',
        'yd': 'Cubic Yards',
        'mi': 'Cubic Miles'
    }
};

function convertSize() {
    const conversionType = document.getElementById('conversionType').value;
    const value = parseFloat(document.getElementById('value').value);
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    const resultDisplay = document.getElementById('sizeResult');
    
    if (isNaN(value)) {
        resultDisplay.textContent = 'Please enter a valid value';
        return;
    }
    
    if (fromUnit === toUnit) {
        resultDisplay.textContent = `${value} ${unitLabels[conversionType][fromUnit]}`;
        return;
    }
    
    const conversions = unitConversions[conversionType];
    if (!conversions) {
        resultDisplay.textContent = 'Conversion type not supported';
        return;
    }
    
    // Convert to base unit first, then to target unit
    const baseValue = value * conversions[fromUnit];
    const result = baseValue / conversions[toUnit];
    
    const resultText = `${value} ${unitLabels[conversionType][fromUnit]} = ${result.toFixed(6)} ${unitLabels[conversionType][toUnit]}`;
    resultDisplay.textContent = resultText;
    addToHistory(`${value} ${fromUnit} to ${toUnit}`, resultText, 'size');
}

// Update unit options based on conversion type
document.getElementById('conversionType').addEventListener('change', function() {
    const type = this.value;
    const fromSelect = document.getElementById('fromUnit');
    const toSelect = document.getElementById('toUnit');
    
    // Clear existing options
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';
    
    // Add new options based on type
    const units = Object.keys(unitConversions[type]);
    units.forEach(unit => {
        const label = unitLabels[type][unit];
        const option1 = new Option(label, unit);
        const option2 = new Option(label, unit);
        fromSelect.add(option1);
        toSelect.add(option2);
    });
});

// Initialize size tab with length units
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('conversionType').dispatchEvent(new Event('change'));
});

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
            addToHistory(expression, result, 'scientific');
        }
    } catch (e) {
        mainDisplay.value = 'Error';
    }
}

function addToHistory(expression, result, type = 'scientific') {
    const li = document.createElement('li');
    let displayExpr = expression;
    if (type === 'scientific') {
        // Prettify expression for history
        displayExpr = expression.replace(/Math\./g, '').replace(/\*\*/g, '^');
    }
    li.textContent = `${displayExpr} = ${result}`;
    li.onclick = () => {
        // For scientific, load into formula
        if (type === 'scientific') {
            formulaDisplay.value = expression; // Keep original for reloading
        }
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

// Basic calculator functions
function clearDisplay() {
    const formulaDisplay = document.getElementById('formula');
    const mainDisplay = document.getElementById('display');
    if (formulaDisplay) formulaDisplay.value = '';
    if (mainDisplay) mainDisplay.value = '0';
}

function deleteLast() {
    const formulaDisplay = document.getElementById('formula');
    const mainDisplay = document.getElementById('display');
    if (formulaDisplay) {
        formulaDisplay.value = formulaDisplay.value.slice(0, -1);
        if (formulaDisplay.value === '' && mainDisplay) {
            mainDisplay.value = '0';
        }
    }
}

function appendToDisplay(value) {
    const formulaDisplay = document.getElementById('formula');
    if (formulaDisplay) {
        formulaDisplay.value += value;
        formulaDisplay.scrollLeft = formulaDisplay.scrollWidth;
    }
}

function calculate() {
    const formulaDisplay = document.getElementById('formula');
    const mainDisplay = document.getElementById('display');
    if (!formulaDisplay || !mainDisplay) return;
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
            addToHistory(expression, result, 'scientific');
        }
    } catch (e) {
        mainDisplay.value = 'Error';
    }
}

function addToHistory(expression, result, type = 'scientific') {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;
    const li = document.createElement('li');
    let displayExpr = expression;
    if (type === 'scientific') {
        // Prettify expression for history
        displayExpr = expression.replace(/Math\./g, '').replace(/\*\*/g, '^');
    }
    li.textContent = `${displayExpr} = ${result}`;
    li.onclick = () => {
        // For scientific, load into formula
        if (type === 'scientific') {
            const formulaDisplay = document.getElementById('formula');
            if (formulaDisplay) formulaDisplay.value = expression; // Keep original for reloading
        }
    };
    historyList.prepend(li);
    
    // Keep only last 20 items
    while (historyList.children.length > 20) {
        historyList.removeChild(historyList.lastChild);
    }
}

function clearHistory() {
    const historyList = document.getElementById('history-list');
    if (historyList) historyList.innerHTML = '';
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
    // Only work if scientific tab is active
    if (!document.getElementById('scientific').classList.contains('active')) return;
    
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
