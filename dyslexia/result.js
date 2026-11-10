

const resultData = sessionStorage.getItem("predictionResult");
const uploadedImage = sessionStorage.getItem("uploadedImage");
const imageName = sessionStorage.getItem("imageName");
 
// Check whether result exists
if (!resultData) {
 
    document.getElementById("prediction").innerText = "No result available";
 
    document.getElementById("analysisMessage").innerText =
        "Please upload an image and try again.";
 
} else {
 
    const result = JSON.parse(resultData);
 
    // Display prediction
    document.getElementById("prediction").innerText = result.category;
 
    // Display confidence score
    const confidence = Number(result.confidence);
 
    document.getElementById("confidence").innerText =
        confidence.toFixed(2) + "%";
 
    // Fill the circular indicator according to the real confidence
    const circle = document.querySelector(".confidence-circle");
    const filled = Math.max(0, Math.min(100, confidence));
 
    circle.style.background =
        "conic-gradient(#2677d5 0% " + filled + "%, #d7e5f5 " + filled + "% 100%)";
 
    // Display prediction message
    let message = "";
 
    if (result.category === "Normal") {
 
        message = "The model classified this handwriting sample as Normal.";
 
    } else if (result.category === "Reversal") {
 
        message = "The model identified handwriting reversal patterns in this sample.";
 
    } else if (result.category === "Corrected") {
 
        message = "The model classified this handwriting sample as Corrected.";
 
    } else {
 
        message = "The model returned an unrecognized classification.";
    }
 
    document.getElementById("predictionMessage").innerText = message;
    document.getElementById("analysisMessage").innerText = message;
}
 
// Display uploaded image
if (uploadedImage) {
 
    document.getElementById("resultImage").src = uploadedImage;
    document.getElementById("imageName").innerText = imageName;
}
 
// Analyze another image
document.getElementById("anotherImage").onclick = function () {
    window.location.href = "upload.html";
};
 
// Back to home (login page)
document.getElementById("backHome").onclick = function () {
    window.location.href = "index.html";
};
 