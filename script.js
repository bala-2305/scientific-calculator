function clearDisplay() {
    document.getElementById('display').value = '';
}

function deleteLast() {
    let display = document.getElementById('display');
    display.value = display.value.slice(0, -1);
}

function appendToDisplay(value) {
    let display = document.getElementById('display');
    display.value += value;
}

function calculate() {
    try {
        let display = document.getElementById('display');
        display.value = eval(display.value);
    } catch (e) {
        alert('Invalid Expression');
    }
}

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
