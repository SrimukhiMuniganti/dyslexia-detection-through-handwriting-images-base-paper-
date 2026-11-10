
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
 
import tensorflow as tf
import joblib
import numpy as np
import os
import io
 
from preprocessing import preprocess_image
 
 
# -------------------------------
# CONFIGURATION
# -------------------------------
 
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = BASE_DIR
 
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB
 
 
# -------------------------------
# FASTAPI APPLICATION
# -------------------------------
 
app = FastAPI(title="Dyslexia Detection API")
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)
 
print("Model directory:", MODEL_DIR)
 
 
# -------------------------------
# LOAD TRAINED MODELS
# -------------------------------
 
feature_extractor = tf.keras.models.load_model(
    os.path.join(MODEL_DIR, "cnn_feature_extractor.keras")
)
 
svm_model = joblib.load(
    os.path.join(MODEL_DIR, "svm_model1.pkl")
)
 
print("Models loaded successfully.")
 
 
# -------------------------------
# CLASS NAMES
# -------------------------------
 
CLASS_NAMES = {
    0: "Normal",
    1: "Reversal",
    2: "Corrected"
}
 
 
# -------------------------------
# HOME ENDPOINT
# -------------------------------
 
@app.get("/")
def home():
    return {"message": "Dyslexia Detection API is running"}
 
 
# -------------------------------
# IMAGE PREDICTION
# -------------------------------
 
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
 
    allowed_extensions = [".jpg", ".jpeg", ".png", ".webp"]
 
    extension = os.path.splitext(file.filename or "")[1].lower()
 
    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, JPEG, PNG and WebP images are allowed."
        )
 
    try:
        contents = await file.read()
 
        if not contents:
            raise HTTPException(
                status_code=400,
                detail="Uploaded image is empty."
            )
 
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail="Image must be below 5 MB."
            )
 
        # Process the image IN MEMORY (nothing is saved to disk,
        # so Live Server has no file change to react to)
        image = preprocess_image(io.BytesIO(contents))
 
        # CNN feature extraction
        features = feature_extractor.predict(image, verbose=0)
 
        # SVM prediction
        prediction = svm_model.predict(features)
        predicted_class = int(prediction[0])
 
        # SVM decision scores -> softmax -> confidence
        decision_scores = np.asarray(svm_model.decision_function(features))
 
        if decision_scores.ndim == 1:
            # binary case safety
            scores = np.array([-decision_scores[0], decision_scores[0]], dtype=float)
        else:
            scores = decision_scores[0].astype(float)
 
        exp_scores = np.exp(scores - np.max(scores))
        probabilities = exp_scores / exp_scores.sum()
 
        model_classes = svm_model.classes_
        class_index = int(np.where(model_classes == predicted_class)[0][0])
 
        confidence = float(probabilities[class_index] * 100)
 
        category = CLASS_NAMES.get(predicted_class, "Unknown")
 
        return {
            "success": True,
            "filename": file.filename,
            "prediction": predicted_class,
            "category": category,
            "confidence": round(confidence, 2)
        }
 
    except HTTPException:
        raise
 
    except ValueError as e:
        # e.g. "No handwriting detected"
        raise HTTPException(status_code=400, detail=str(e))
 
    except Exception as e:
        print("Prediction error:", e)
        raise HTTPException(status_code=500, detail=str(e))
 