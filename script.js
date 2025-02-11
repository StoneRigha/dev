document.getElementById("imageUpload").addEventListener("change", function(event) {
    let file = event.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function(e) {
            processImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

function processImage(imageData) {
    let img = new Image();
    img.src = imageData;
    img.onload = function() {
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        Tesseract.recognize(
            canvas,
            'eng',
            {
                logger: m => console.log(m)
            }
        ).then(({ data: { text } }) => {
            document.getElementById("outputText").value = text;
        });
    };
}

// Download PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();
    let text = document.getElementById("outputText").value;
    doc.text(text, 10, 10);
    doc.save("digitized_notes.pdf");
}

// Download Image
function downloadImage() {
    let text = document.getElementById("outputText").value;
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = 500;
    canvas.height = 200;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(text, 10, 30);
    let link = document.createElement("a");
    link.download = "digitized_notes.png";
    link.href = canvas.toDataURL();
    link.click();
}

// Download EPUB
function downloadEPUB() {
    let text = document.getElementById("outputText").value;
    let blob = new Blob([text], { type: "application/epub+zip" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "digitized_notes.epub";
    link.click();
}
