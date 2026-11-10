
from PIL import Image
import numpy as np
import os
 
# Image dimensions expected by your CNN
IMG_SIZE = (32, 32)
 
 
def preprocess_image(image_source):
    """
    Preprocess a handwriting image for the CNN + SVM pipeline.
 
    image_source can be:
      - a file path (string), or
      - an in-memory file (io.BytesIO)
 
    Steps:
    1. Open image
    2. Convert to grayscale
    3. Normalize background
    4. Detect handwriting region
    5. Crop handwriting
    6. Pad image into a square
    7. Resize to 32x32
    8. Normalize pixel values
    9. Reshape for CNN input
    """
 
    # 1. If a path was given, check that it exists
    if isinstance(image_source, str) and not os.path.exists(image_source):
        raise FileNotFoundError("Image file not found.")
 
    # 2. Open image and convert to grayscale
    image = Image.open(image_source).convert("L")
 
    # 3. Convert image into NumPy array
    image_array = np.array(image)
 
    # 4. Check whether image is empty
    if image_array.size == 0:
        raise ValueError("Uploaded image is empty.")
 
    # 5. Normalize background based on border pixels
    border_pixels = np.concatenate([
        image_array[0, :],
        image_array[-1, :],
        image_array[:, 0],
        image_array[:, -1]
    ])
 
    # Make background black and handwriting bright
    if border_pixels.mean() > 127:
        image_array = 255 - image_array
 
    # 6. Detect handwriting/foreground pixels
    ys, xs = np.where(image_array > 10)
 
    if len(xs) == 0:
        raise ValueError("No handwriting detected. Please upload a clear image.")
 
    # 7. Crop the handwriting region
    x_min, x_max = xs.min(), xs.max()
    y_min, y_max = ys.min(), ys.max()
 
    cropped_image = image_array[y_min:y_max + 1, x_min:x_max + 1]
 
    # 8. Add padding to make the image square
    height, width = cropped_image.shape
    square_size = max(height, width)
 
    square_image = np.zeros((square_size, square_size), dtype=np.uint8)
 
    y_offset = (square_size - height) // 2
    x_offset = (square_size - width) // 2
 
    square_image[
        y_offset:y_offset + height,
        x_offset:x_offset + width
    ] = cropped_image
 
    # 9. Resize image to CNN input dimensions
    resized_image = Image.fromarray(square_image).resize(
        IMG_SIZE,
        Image.Resampling.LANCZOS
    )
 
    # 10. Convert to float32 and normalize pixel values
    processed_image = np.array(resized_image, dtype=np.float32) / 255.0
 
    # 11. Add batch and channel dimensions
    processed_image = processed_image.reshape(1, 32, 32, 1)
 
    return processed_image
 
 
# Test preprocessing independently
if __name__ == "__main__":
 
    test_image_path = "uploads/test.jpeg"
 
    try:
        processed = preprocess_image(test_image_path)
 
        print("Preprocessing successful!")
        print("Image shape:", processed.shape)
        print("Data type:", processed.dtype)
        print("Minimum pixel value:", processed.min())
        print("Maximum pixel value:", processed.max())
 
    except Exception as error:
        print("Preprocessing failed:", error)
 