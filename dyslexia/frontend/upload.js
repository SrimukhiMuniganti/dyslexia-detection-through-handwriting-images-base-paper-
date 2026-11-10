
// 1. GET HTML ELEMENTS
 
const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const fileName = document.getElementById("fileName");
const analyzeBtn = document.getElementById("analyzeBtn");
const statusMessage = document.getElementById("status");
const dropArea = document.getElementById("dropArea");
const welcome = document.getElementById("welcome");
 
// const API_URL = "http://127.0.0.1:8000/predict";
const API_URL = "https://dyslexia-detection-through-handwriting.onrender.com/predict";
 
let selectedFile = null;
 
// 2. DISPLAY USERNAME
 
const username = sessionStorage.getItem("username");
 
if (username && welcome) {
    welcome.innerText = "Welcome, " + username;
}
 
// 3. HANDLE IMAGE SELECTION
 
function handleFile(file) {
 
    if (!file) return;
 
    const allowedTypes = ["image/jpeg", "image/png"];
 
    if (!allowedTypes.includes(file.type)) {
        statusMessage.innerText = "Please select JPG or PNG.";
        selectedFile = null;
        analyzeBtn.disabled = true;
        return;
    }
 
    if (file.size > 5 * 1024 * 1024) {
        statusMessage.innerText = "Image must be below 5 MB.";
        selectedFile = null;
        analyzeBtn.disabled = true;
        return;
    }
 
    selectedFile = file;
 
    preview.src = URL.createObjectURL(file);
    preview.hidden = false;
 
    fileName.innerText = file.name;
 
    analyzeBtn.disabled = false;
 
    statusMessage.innerText = "Image selected successfully!";
}
 
// 4. FILE INPUT
 
fileInput.addEventListener("change", function (event) {
    handleFile(event.target.files[0]);
});
 
// 5. DRAG AND DROP
 
dropArea.addEventListener("dragover", function (event) {
    event.preventDefault();
    dropArea.classList.add("drag-over");
});
 
dropArea.addEventListener("dragleave", function () {
    dropArea.classList.remove("drag-over");
});
 
dropArea.addEventListener("drop", function (event) {
    event.preventDefault();
    dropArea.classList.remove("drag-over");
    handleFile(event.dataTransfer.files[0]);
});
 
// 6. CREATE A SMALL PREVIEW (so sessionStorage does not overflow)
 
function createThumbnail(file, maxSize) {
 
    return new Promise(function (resolve, reject) {
 
        const url = URL.createObjectURL(file);
        const img = new Image();
 
        img.onload = function () {
 
            const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
            const canvas = document.createElement("canvas");
 
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
 
            const ctx = canvas.getContext("2d");
 
            // White background (PNGs can be transparent)
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
 
            URL.revokeObjectURL(url);
            resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
 
        img.onerror = function () {
            URL.revokeObjectURL(url);
            reject(new Error("Unable to read image."));
        };
 
        img.src = url;
    });
}
 
// 7. ANALYZE BUTTON
 
analyzeBtn.addEventListener("click", async function (event) {
 
    event.preventDefault();
 
    if (!selectedFile) {
        statusMessage.innerText = "Please select an image first.";
        return;
    }
 
    try {
 
        analyzeBtn.disabled = true;
        statusMessage.innerText = "Analyzing image... please wait.";
 
        // Send image to backend
        const formData = new FormData();
        formData.append("file", selectedFile);
 
        const response = await fetch(API_URL, {
            method: "POST",
            body: formData
        });
 
        const result = await response.json();
 
        if (!response.ok || !result.success) {
            throw new Error(
                result.detail || result.error || "Prediction failed."
            );
        }
 
        if (result.category === undefined || result.confidence === undefined) {
            throw new Error("Prediction information is missing.");
        }
 
        // Small preview image for the result page
        const imageData = await createThumbnail(selectedFile, 600);
 
        // Save everything for result.html
        sessionStorage.setItem("predictionResult", JSON.stringify(result));
        sessionStorage.setItem("uploadedImage", imageData);
        sessionStorage.setItem("imageName", selectedFile.name);
 
        statusMessage.innerText = "Analysis completed!";
 
        window.location.href = "result.html";
 
    } catch (error) {
 
        console.error("Analyze error:", error);
 
        if (error.message === "Failed to fetch") {
            statusMessage.innerText =
                "Cannot reach the server. Is the FastAPI backend running on port 8000?";
        } else {
            statusMessage.innerText = "Error: " + error.message;
        }
 
        analyzeBtn.disabled = false;
    }
});
 
// 8. INITIAL BUTTON STATE
 
analyzeBtn.disabled = true;
 
