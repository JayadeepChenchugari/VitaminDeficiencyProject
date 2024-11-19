from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS

import torch
from torchvision import transforms
from PIL import Image
import io

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the PyTorch model
device = torch.device('cpu')  # Use CPU
model = torch.load('model/model(2).pth', map_location=device)  # Directly load the full model
model.to(device)
model.eval()

# Map predictions to vitamin labels
label_map = {
    0: "Vitamin A",
    1: "Vitamin B",
    2: "Vitamin C",
    3: "Vitamin D",
    4: "Vitamin E",
}

@app.route('/')
def home():
    return "Welcome to the Prediction API! Use the /predict endpoint to make predictions."

@app.route('/predict', methods=['POST'])
def predict():
    try:
        img_data = request.files['image'].read()
        image = Image.open(io.BytesIO(img_data)).convert('RGB')

        # Preprocess image
        preprocess = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
        image_tensor = preprocess(image).unsqueeze(0).to(device)

        # Perform prediction
        with torch.no_grad():
            output = model(image_tensor)
            prediction_idx = output.argmax().item()

        # Map prediction index to label
        prediction_label = label_map.get(prediction_idx, "Unknown")

        return jsonify({'prediction': prediction_label})
    except Exception as e:
        print(f"Error during prediction: {e}")  # Log the error to the console
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
