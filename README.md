# Dyslexia Detection from Handwriting
### Hybrid CNN + SVM Approach

A **working academic prototype** inspired by the research paper:

> N. D. Alqahtani, B. Alzahrani, and M. S. Ramzan, "Detection of Dyslexia Through Images of Handwriting using Hybrid AI Approach," *International Journal of Advanced Computer Science and Applications (IJACSA)*, Vol. 14, No. 10, 2023, pp. 942–951.

This project implements a hybrid Artificial Intelligence approach combining **Convolutional Neural Networks (CNN)** and **Support Vector Machine (SVM)** to classify handwriting images into three categories: **Normal, Reversal, and Corrected**.

The project also provides a web application where users can upload handwriting images and view the model's predictions.

> **Disclaimer:** This is an academic prototype developed for learning and research purposes. It is not a clinical diagnostic tool and does not independently diagnose dyslexia. A qualified professional should be consulted for dyslexia assessment.

---

## Base Research Paper

The research paper proposes a hybrid approach in which a CNN extracts important features from handwriting images, while traditional machine learning algorithms perform the final classification.

The paper explores two hybrid models:

- CNN + Support Vector Machine (SVM)
- CNN + Random Forest (RF)

### Results Reported in the Research Paper

| Model | Accuracy |
|---|---:|
| CNN | 98.59% |
| CNN + Random Forest | 98.44% |
| CNN + SVM | 99.33% |

The CNN-SVM model achieved the highest reported accuracy in the paper. Therefore, this project implements the CNN-SVM approach.

**Note:** These accuracy values belong to the original research paper, not our prototype.

---

## How Our Prototype Follows the Research Paper

| Research Paper | Our Prototype |
|---|---|
| Three handwriting categories: Normal, Reversal, Corrected | Same three categories |
| Handwriting image preprocessing | Grayscale conversion, background normalization, cropping, padding and resizing |
| CNN-based feature extraction | Trained CNN feature extractor |
| SVM-based classification | Trained SVM classifier |
| Handwriting image classification | Web-based handwriting image prediction |

### Additional Features in Our Prototype

- FastAPI backend for model integration.
- Web interface for uploading handwriting images.
- Prediction result page.
- Confidence score displayed for predictions.

---

## How the System Works

The system follows a hybrid CNN-SVM workflow.

```text
          Handwriting Image
                  |
                  v
          Image Preprocessing
                  |
                  v
          CNN Feature Extractor
                  |
                  v
       128-Dimensional Feature Vector
                  |
                  v
             SVM Classifier
                  |
                  v
           Predicted Category
                  |
          -------------------
          |         |       |
        Normal   Reversal  Corrected
                  |
                  v
           Confidence Score
```

### Workflow Explanation

1. **Image Input:** The user uploads a handwriting image through the web interface.
2. **Preprocessing:** The image is converted to grayscale, normalized, cropped, padded and resized to 32 × 32 pixels.
3. **Feature Extraction:** The CNN extracts important visual features and generates a 128-dimensional feature vector.
4. **Classification:** The extracted features are passed to the trained SVM classifier.
5. **Prediction:** The classifier predicts one of the three categories: Normal, Reversal or Corrected.
6. **Confidence Score:** The system displays a confidence score calculated from the SVM decision scores using softmax.

---

## Model Performance

### Current Prototype Details

| Component | Implementation |
|---|---|
| Feature Extraction | Convolutional Neural Network (CNN) |
| Feature Vector | 128 features |
| Classification Algorithm | Support Vector Machine (SVM) |
| CNN Test Accuracy | 94.91% |
| SVM Test Accuracy | 95.04% |
| Number of Classes | 3 |

The CNN extracts a 128-dimensional feature vector from each handwriting image. These features are passed to the SVM classifier for final classification.

**Note:** CNN and SVM accuracy values represent their respective evaluations. They should not be confused with the results reported in the original research paper.

### SVM Classification Report

| Class | Precision | Recall | F1-score |
|---|---:|---:|---:|
| Normal | 93.78% | 92.47% | 93.12% |
| Reversal | 95.69% | 96.25% | 95.97% |
| Corrected | 95.62% | 96.40% | 96.01% |
| Weighted Average | 95.04% | 95.04% | 95.04% |

### Confusion Matrix

The following confusion matrix represents the SVM classifier's predictions on the test dataset.

| Actual / Predicted | Normal | Reversal | Corrected |
|---|---:|---:|---:|
| Normal | 8070 | 339 | 318 |
| Reversal | 260 | 8400 | 67 |
| Corrected | 275 | 39 | 8413 |

- **Total test samples:** 26,181
- **Correct predictions:** 24,883
- **Incorrect predictions:** 1,298
- **Overall SVM accuracy:** 95.04%

### Sample Predictions

For each uploaded handwriting image, the application displays:

- Input handwriting image
- Predicted category
- Confidence score

The system predicts one of the following categories:

- Normal
- Reversal
- Corrected

---

## Project Structure

```text
Dyslexia-Detection/
│
├── main.py
├── preprocessing.py
├── test_prediction.py
│
├── cnn_feature_extractor.keras
├── cnn_model.keras
├── svm_model1.pkl
│
├── index.html
├── login.js
├── style.css
│
├── upload.html
├── upload.js
├── upload.css
│
├── result.html
├── result.js
├── result.css
│
├── loginp.png
├── uploadp.png
│
└── README.md
```

---

## Technologies Used

### Machine Learning

- Python
- TensorFlow / Keras
- Scikit-learn
- NumPy
- Pillow
- Joblib

### Backend

- FastAPI
- Uvicorn

### Frontend

- HTML
- CSS
- JavaScript

---

## Installation and Execution

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

### 2. Navigate to the Project Folder

```bash
cd YOUR-REPOSITORY
```

### 3. Install Required Libraries

```bash
pip install fastapi uvicorn tensorflow scikit-learn joblib pillow numpy python-multipart
```

Use a compatible scikit-learn version for loading the saved SVM model.

### 4. Start the FastAPI Backend

```bash
uvicorn main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

### 5. Open the Frontend

Open `index.html` using the VS Code Live Server extension or another local web server.

Log in, upload a handwriting image and click the **Analyze** button to view the prediction.

---

## API Usage

The backend provides a prediction endpoint:

```text
POST /predict
```

It accepts handwriting images in JPG, JPEG, PNG or WebP format, up to 5 MB.

### Example API Response

```json
{
  "success": true,
  "filename": "sample.png",
  "prediction": 0,
  "category": "Normal",
  "confidence": 92.5
}
```

*The values above are an illustrative example, not an actual model result.*

---

## Limitations

- This is an academic prototype, not a clinical diagnostic system.
- The model classifies handwriting into Normal, Reversal and Corrected categories; it does not directly classify individuals as Dyslexic or Non-Dyslexic.
- The original research paper uses handwriting images from NIST Special Database 19, Kaggle and samples collected from dyslexic students. Its reversal category was generated by horizontally flipping normal handwriting images, with additional transformations.
- The model's performance on real children's handwriting may differ from its performance on the available dataset.
- The login page is a frontend demonstration and does not provide real authentication.
- The confidence score is derived from SVM decision scores and should not be interpreted as a clinical probability.

---

## Team Members and Contributions

| Team Member | Contribution |
|---|---|
| Tanush | Data Collection |
| Saicharan | Data Collection |
| Karthik | Data Preprocessing |
| Santhosh | CNN Model Development and Feature Extraction |
| Srimukhi | SVM Classification |
| Srimukhi | Frontend Development and Backend Integration |

---

## Acknowledgements

We sincerely acknowledge the authors of the following research paper, which served as the foundation for our project:

Alqahtani, N. D., Alzahrani, B., and Ramzan, M. S. (2023). *Detection of Dyslexia Through Images of Handwriting using Hybrid AI Approach*. International Journal of Advanced Computer Science and Applications (IJACSA), 14(10), 942–951.

This project was developed as an academic implementation of the research paper's hybrid CNN-SVM approach.
