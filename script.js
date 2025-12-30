const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

let drawing = false;
let tool = "pen";
let color = "#000";
let size = 3;
let pages = [];
let currentPage = 0;
let redoStack = [];

function savePage() {
    pages[currentPage] = canvas.toDataURL();
}

function loadPage(index) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (pages[index]) {
        let img = new Image();
        img.src = pages[index];
        img.onload = () => ctx.drawImage(img, 0, 0);
    }
}

canvas.onmousedown = e => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
};

canvas.onmouseup = () => {
    drawing = false;
    savePage();
};

canvas.onmousemove = e => {
    if (!drawing) return;

    ctx.lineWidth = size;
    ctx.lineCap = "round";

    if (tool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillRect(e.offsetX - 10, e.offsetY - 10, 20, 20);
    } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = color;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
};

// TOOLS
function setPen() { tool = "pen"; }
function setEraser() { tool = "eraser"; }

document.getElementById("colorPicker").onchange = e => color = e.target.value;
document.getElementById("penSize").oninput = e => size = e.target.value;

// TEXT
function addText() {
    let text = prompt("Enter Text");
    let sizeText = document.getElementById("textSize").value;

    if (text) {
        ctx.font = sizeText + "px Arial";
        ctx.fillStyle = color;
        ctx.fillText(text, 100, 100);
        savePage();
    }
}

// UNDO / REDO
function undo() {
    if (pages.length > 1) {
        redoStack.push(pages.pop());
        loadPage(pages.length - 1);
    }
}

function redo() {
    if (redoStack.length > 0) {
        let img = redoStack.pop();
        pages.push(img);
        loadPage(pages.length - 1);
    }
}

// MULTI PAGE
function nextPage() {
    savePage();
    currentPage++;
    loadPage(currentPage);
}

function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        loadPage(currentPage);
    }
}

// BOARD ACTIONS
function clearBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    savePage();
}

function saveBoard() {
    let a = document.createElement("a");
    a.download = "whiteboard.png";
    a.href = canvas.toDataURL();
    a.click();
}
