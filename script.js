let elemToDraw = "";
// Coordonate pentru pozitia initiala si cea finala a mouse-ului
let x1, y1, x2, y2;
// Contor
let isDrawing = false;
// Array pentru stocarea tuturor elementelor adaugate in svg
let elements = [];

function setLine() {
    elemToDraw = "line";
}

function setEllipse() {
    elemToDraw = "ellipse";
}

function setRectangle() {
    elemToDraw = "rectangle";
}

function startDrawing(event) {
    if (elemToDraw && !isDrawing) {
        isDrawing = true;

        const svg = document.getElementById("svg-editor");

        // Get initial mouse position
        x1 = event.clientX - svg.getBoundingClientRect().left;
        y1 = event.clientY - svg.getBoundingClientRect().top;
    }
}


function stopDrawing(event) {
    const svg = document.getElementById("svg-editor");
    const color = document.getElementById("color").value;
    const thickness = document.getElementById("thickness").value;

    // Get final mouse position
    x2 = event.clientX - svg.getBoundingClientRect().left;
    y2 = event.clientY - svg.getBoundingClientRect().top;

    if(isDrawing){
        if (elemToDraw === "line") {
            const line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('x2', x2);
            line.setAttribute('y1', y1);
            line.setAttribute('y2', y2);
            line.setAttribute('stroke', color);
            line.setAttribute('stroke-width', thickness);
            elements.push(line);
            svg.appendChild(line);
        }
        
        if(elemToDraw ==="rectangle"){
            const rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            rect.setAttribute('x',x1);
            rect.setAttribute('y',y1);
            rect.setAttribute('height',y2-y1);
            rect.setAttribute('width',x2-x1);
            rect.setAttribute('stroke', color);
            rect.setAttribute('fill', color);
            elements.push(rect);
            svg.appendChild(rect);
        }

        if(elemToDraw ==="ellipse"){
            const ellipse = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse');
            ellipse.setAttribute('cx', (x1 + x2) / 2); 
            ellipse.setAttribute('cy', (y1 + y2) / 2); 
            ellipse.setAttribute('rx', Math.abs(x2 - x1) / 2); 
            ellipse.setAttribute('ry', Math.abs(y2 - y1) / 2);
            ellipse.setAttribute('stroke', color);
            ellipse.setAttribute('fill', color);
            elements.push(ellipse);
            svg.appendChild(ellipse);
        }
    }
    
    isDrawing = false;
}

function undo(){
    if(elements.length > 0){
        let lastElem = elements.pop();
        lastElem.remove();
    }
}

function exportAsImage() {
    const svg = document.getElementById("svg-editor");

    // Set a white background color for the SVG
    svg.style.backgroundColor = "#ffffff";

    // Create an SVG string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    // Create a Blob from the SVG data
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });

    // Create an Image element
    const img = new Image();

    img.onload = function () {
        // Create a Canvas and draw the SVG image on it
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Create an Image element for the rasterized image
        const rasterImage = new Image();

        rasterImage.onload = function () {
            // Create a Canvas for the final image with a white background
            const finalCanvas = document.createElement("canvas");
            const finalCtx = finalCanvas.getContext("2d");

            finalCanvas.width = rasterImage.width;
            finalCanvas.height = rasterImage.height;

            // Set the background color to white
            finalCtx.fillStyle = "#ffffff";
            finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

            // Draw the rasterized image on the white background
            finalCtx.drawImage(rasterImage, 0, 0);

            // Save the image as PNG
            const dataURL = finalCanvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = "drawing.png";
            link.click();
        };

        // Set the source of the rasterized image
        rasterImage.src = canvas.toDataURL("image/png");
    };

    // Set the source of the SVG image
    img.src = URL.createObjectURL(blob);
}

function exportAsSVG(){
    const svg = document.getElementById("svg-editor");

    // Set a white background color for the SVG
    svg.style.backgroundColor = "#ffffff";

    // Create an SVG string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    // Create a Blob from  the SVG data
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });

    // Create a link element for downloading the SVG file
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "poza.svg";
    link.click();
}