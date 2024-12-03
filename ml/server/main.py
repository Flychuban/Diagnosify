from flask import Flask, request, jsonify
import pandas as pd
import joblib
import pickle
import os
from keras.applications.vgg19 import preprocess_input
from keras.models import load_model, Model
from PIL import Image
import numpy as np
from flask_cors import CORS
import keras.utils as image
import cv2
from keras.layers import Input, Conv2D, Conv2DTranspose, MaxPooling2D, Concatenate, Cropping2D, Dropout
from flask import Flask, request, jsonify, send_file
import tensorflow as tf
import io
import requests

def create_response_object(data):
    return jsonify({"prediction" : data}), 200

app = Flask(__name__)
CORS(app)



scaler_path = os.path.join(os.getcwd(), "scalers")
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  * 1024
# Load the scaler and model
diabetes_scaler = joblib.load(os.path.join(scaler_path, "diabetes_scaler.pkl"))
disease_models_path = os.path.join(os.getcwd(), "disease_models")
diabetes_model = pickle.load(open(os.path.join(disease_models_path, "diabetes_prediction.sav"), 'rb'))

@app.route('/diabetes', methods=['POST'])
def predict_diabetes():

    data = request.get_json()
    required_features = [
        "Pregnancies", "Glucose", "BloodPressure", 
        "SkinThickness", "Insulin", "BMI", 
        "DiabetesPedigreeFunction", "Age"
    ]
    
    # Validate input
    if not all(feature in data for feature in required_features):
        return jsonify({"error": f"Missing one or more required features: {required_features}"}), 400
    
    # Create a DataFrame from the input
    input_data = pd.DataFrame([data], columns=required_features)
    
    # Scale the input data
    input_data[required_features] = diabetes_scaler.transform(input_data[required_features])
    
    # Make a prediction
    prediction = diabetes_model.predict(input_data[required_features])
    
    # Interpret the result
    result = "Person has Diabetes" if prediction[0] == 1 else "Person does not have Diabetes"
    
    return jsonify({"prediction": result}), 200  # Use `result` directly


pneumonia_model = load_model(os.path.join(disease_models_path, "pneumonia_model.h5"))

@app.route('/predict_pneumonia', methods=['POST'])
def predict_pneumonia():
    try:
        # Check if the request has the file part
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded. Please upload a PNG image."}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        img = Image.open(file)

# Convert image to RGB to ensure it has 3 channels
        img = img.convert("RGB")  

# Resize image to model's expected input size
        img = img.resize((224, 224))

# Convert image to numpy array
        img_array = np.array(img)
       
        # Ensure image has 3 channels (RGB)
        if img_array.shape[-1] != 3:
            return jsonify({"error": "Image must have 3 channels (RGB)"}), 400

        # Expand dimensions and preprocess
        img_array = np.expand_dims(img_array, axis=0)
        img_data = preprocess_input(img_array)
        # Predict
        prediction = pneumonia_model.predict(img_data)

        # Interpret prediction
        prediction_percentage = prediction[0][1] * 100
        if prediction[0][1] < 0.5:
            result = {
                "message": "Person does NOT have Pneumonia",
                "confidence": f"{100 - prediction_percentage:.2f}%"
            }
        else:
            result = {
                "message": "Person has Pneumonia",
                "confidence": f"{prediction_percentage:.2f}%"
            }

        return create_response_object(result) 

    except Exception as e:
        return jsonify({"error": str(e)}), 500



body_fat_percentage_scaler = joblib.load(os.path.join(scaler_path, "body_fat_scaler.pkl"))
body_fat_percentage_model = pickle.load(open(os.path.join(disease_models_path, "body_fat_linreg.sav"), 'rb'))



@app.route('/body-fat-predict', methods=['POST'])
def body_fat_predict():
    try:
        # Ensure request content type is JSON
        if not request.is_json:
            return jsonify({"error": "Request body must be JSON"}), 400

        # Parse JSON payload
        data = request.get_json()

        # Extract required fields
        required_fields = ["Age", "Weight", "Height", "Neck", "Chest", "Abdomen", "Hip", "Thigh", "Knee", "Ankle", "Biceps", "Forearm", "Wrist"]
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return jsonify({"error": f"Missing fields in the request: {', '.join(missing_fields)}"}), 400

        # Prepare input data
        input_data = [[
            data.get("Age"),
            data.get("Weight"),
            data.get("Height"),
            data.get("Neck"),
            data.get("Chest"),
            data.get("Abdomen"),
            data.get("Hip"),
            data.get("Thigh"),
            data.get("Knee"),
            data.get("Ankle"),
            data.get("Biceps"),
            data.get("Forearm"),
            data.get("Wrist")
        ]]

        # Create DataFrame and scale input data
        df = pd.DataFrame(input_data, columns=required_fields)
        df[required_fields] = body_fat_percentage_scaler.transform(df[required_fields])

        # Predict body fat percentage
        body_fat_prediction = body_fat_percentage_model.predict(df)

        # Return prediction
        return jsonify({
            "prediction": str(round(float(body_fat_prediction[0]), 2))
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Define the SegmentationModel class
class SegmentationModel(): 
    def __init__(self): 
        inputData = Input(shape=(256,256,3))
        c1 = Conv2D(64, 3, activation='relu', padding='same')(inputData)
        c2 = Conv2D(64, 3, activation='relu', padding='same')(c1)

        c3 = MaxPooling2D()(c2)
        c4 = Conv2D(128, 3, activation='relu', padding='same')(c3)
        c5 = Conv2D(128, 3, activation='relu', padding='same')(c4)
        c5 = Dropout(0.5)(c5)

        c6 = MaxPooling2D()(c5)
        c7 = Conv2D(256, 3, activation='relu', padding='same')(c6)
        c8 = Conv2D(256, 3, activation='relu', padding='same')(c7)
        c8 = Dropout(0.5)(c8)

        c9 = MaxPooling2D()(c8)
        c10 = Conv2D(512, 3, activation='relu', padding='same')(c9)
        c11 = Conv2D(512, 3, activation='relu', padding='same')(c10)
        c11 = Dropout(0.5)(c11)

        c12 = Conv2D(1024, 3, activation='relu', padding='same')(c11)
        c12 = Dropout(0.5)(c12)

        c12 = Concatenate()([c12, Cropping2D(cropping=((16, 16), (16, 16)))(c8)])
        u1 = Conv2DTranspose(1024, 2, (2,2))(c12)
        u2 = Conv2D(512, 3, activation='relu', padding='same')(u1)
        u3 = Conv2D(512, 3, activation='relu', padding='same')(u2)
        u3 = Dropout(0.5)(u3)

        u3 = Concatenate()([u3, Cropping2D(cropping=((32, 32), (32, 32)))(c5)])
        u4 = Conv2DTranspose(512, 2, (2,2))(u3)
        u5 = Conv2D(256, 3, activation='relu', padding='same')(u4)
        u6 = Conv2D(256, 3, activation='relu', padding='same')(u5)
        u6 = Dropout(0.5)(u6)

        u6 = Concatenate()([u6, Cropping2D(cropping=((64, 64), (64, 64)))(c2)])
        u7 = Conv2DTranspose(256, 2, (2,2))(u6)
        u8 = Conv2D(128, 3, activation='relu', padding='same')(u7)
        u9 = Conv2D(6, 1, activation='softmax', padding='same')(u8)

        self.model = Model(inputs=inputData, outputs=u9)

# Path to weights
disease_models_path = os.path.join(os.getcwd(), "disease_models")
cancer_segmentation_model = SegmentationModel().model
cancer_segmentation_model.load_weights(os.path.join(disease_models_path, "cancer_weights.h5"))

# Utility function to resize image
def resize_image(image, size):
    if image.mode != "RGB":
        image = image.convert("RGB")
    return image.resize(size)

@app.route('/cancer-segmentation', methods=['POST'])
def cancer_segmentation():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        # Get the file from request
        file = request.files['file']
        
        # Process the image
        image = Image.open(file.stream)
        resized_image = resize_image(image, (256, 256))
        
        # Convert to tensor and make prediction
        image_stream = io.BytesIO()
        resized_image.save(image_stream, format="PNG")
        image_stream.seek(0)
        bytes_data = image_stream.getvalue()
        
        image_tensor = tf.io.decode_image(bytes_data, channels=3)
        image_tensor = tf.image.resize(image_tensor, (256, 256))
        image_tensor = tf.expand_dims(image_tensor, axis=0)
        
        prediction = cancer_segmentation_model.predict(image_tensor)
        yhat = np.squeeze(np.where(prediction > 0.5, 1.0, 0.0))
        segmented_image = (yhat[:, :, 0] * 255).astype(np.uint8)
        
        # Convert segmented image to bytes
        _, buffer = cv2.imencode('.png', segmented_image)
        
        # Create a file-like object that mimics a file upload
        files = {
            'data': (
                'segmented.png',  # filename
                buffer.tobytes(),  # file content
                'image/png'       # mimetype
            )
        }
        
        # Send to remote server
        response = requests.post('http://localhost:4001/canc', files=files)
        
        # Return the s3 location from the response
        return jsonify(response.json())
        
    except Exception as e:
        print(f"Error in cancer_segmentation: {e}")
        return jsonify({"error": str(e)}), 500




kidney_scaler = joblib.load(os.path.join(scaler_path, "kidney_disease_scaler.pkl"))

disease_models_path = os.path.join(os.getcwd(), "disease_models")
kidney_model = load_model(os.path.join(disease_models_path, "kidney_model.h5"))

@app.route('/kidney-disease-predict', methods=['POST'])
def kidney_disease_predict():
    try:
        # Parse the incoming JSON request
        data = request.json

        # Ensure all required fields are provided
        required_fields = ["specific_gravity", "albumin", "serum_creatinine", "hemoglobin", "PCV", "hypertension"]
        
        # Check if any required field is missing
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

        # Extract input data
        input_data = [[
            data["specific_gravity"], data["albumin"], data["serum_creatinine"], 
            data["hemoglobin"], data["PCV"], data["hypertension"]
        ]]

        # Convert input data to DataFrame for scaling
        df_input = pd.DataFrame(input_data, columns=["sg", "al", "sc", "hemo", "pcv", "htn"])
        
        # Apply scaling
        df_input_scaled = kidney_scaler.transform(df_input)

        # Predict kidney disease using the model
        prediction = kidney_model.predict(df_input_scaled)

        # Interpret the result (assuming 1 is disease and 0 is no disease)
        result = "Person has Kidney Disease" if prediction[0] == 1 else "Person does not have Kidney Disease"

        return jsonify({"prediction": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


liver_disease_model = pickle.load(open(os.path.join(disease_models_path, "liver_disease_model.sav"), 'rb'))

@app.route('/liver-disease-predict', methods=['POST'])
def liver_disease_predict():
    try:
        # Get the JSON data from the request
        data = request.json

        # Ensure that all required fields are in the request
        required_fields = [
            "age", "gender", "total_bilirubin", "direct_bilirubin", "alkaline_phosphotase", 
            "alamine_aminotransferase", "aspartate_aminotransferase", "total_protiens", "albumin", "ag_ratio"
        ]

        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

        # Extract the input data
        input_data = [
            data["age"], data["gender"], data["total_bilirubin"], data["direct_bilirubin"],
            data["alkaline_phosphotase"], data["alamine_aminotransferase"], data["aspartate_aminotransferase"],
            data["total_protiens"], data["albumin"], data["ag_ratio"]
        ]

        # Predict liver disease using the loaded model
        prediction = liver_disease_model.predict([input_data])

        # Return the result
        result = "Person has Liver Disease" if prediction[0] == 0 else "Person does not have Liver Disease"
        return jsonify({"prediction": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500




malaria_model = load_model(os.path.join(disease_models_path, "malaria_model_cnn.h5"))

# Define the malaria detection endpoint
@app.route('/predict-malaria', methods=['POST'])
def predict_malaria():
    try:
        # Check if a file is provided in the request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        # Ensure the file is not empty
        if file.filename == '':
            return jsonify({'error': 'Empty file provided'}), 400

        # Load and preprocess the image
        img = Image.open(file).convert("RGB")
        img = img.resize((128, 128))
        img_array = np.array(img)
        img_array = np.expand_dims(img_array, axis=0)

        # Make prediction
        prediction = malaria_model.predict(img_array)
        
        # Parse the result
        if prediction[0] > 0.5:
            result = {
                "message": "Person does NOT have Malaria.",
                "malaria_probability": f"{(1 - prediction[0][0]) * 100:.2f}%"
            }
        else:
            result = {
                "message": "Person has Malaria.",
                "malaria_probability": f"{(1 - prediction[0][0]) * 100:.2f}%"
            }

        return jsonify({"prediction": result}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ask kala how to fix model loading

scaler_path = os.path.join(os.getcwd(), "scalers")
breast_cancer_scaler = joblib.load(os.path.join(scaler_path, "breast_cancer_scaler.pkl"))


disease_models_path = os.path.join(os.getcwd(), "disease_models")
breast_cancer_model = pickle.load(open(os.path.join(disease_models_path, "breast_cancer_model.sav"), 'rb'))

@app.route('/breast-cancer-predict', methods=['POST'])
def breast_cancer_predict():
    try:
        # Parse the JSON request
        data = request.json
        
        # Ensure all required fields are provided
        required_fields = [
            "radius_mean", "perimeter_mean", "area_mean", "compactness_mean",
            "concavity_mean", "concave_points", "radius_se", "perimeter_se",
            "area_se", "radius_worst", "perimeter_worst", "area_worst",
            "compactness_worst", "concavity_worst", "concave_points_worst"
        ]
        
        # Check if any required field is missing
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

        # Extract features from the request
        input_data = [[
            data["radius_mean"], data["perimeter_mean"], data["area_mean"], data["compactness_mean"],
            data["concavity_mean"], data["concave_points"], data["radius_se"], data["perimeter_se"],
            data["area_se"], data["radius_worst"], data["perimeter_worst"], data["area_worst"],
            data["compactness_worst"], data["concavity_worst"], data["concave_points_worst"] # in the streamlit it is concave points_worst so ask kala
        ]]

        # Create a DataFrame
        df = pd.DataFrame(input_data, columns=required_fields)
        
        # Scale the input data
        scaled_data = breast_cancer_scaler.transform(df)

        # Make a prediction
        prediction = breast_cancer_model.predict(scaled_data)

        # Interpret the result
        result = "Person has Breast Cancer" if prediction[0] == 1 else "Person does not have Breast Cancer"

        return jsonify({"prediction": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500




heart_disease_model = pickle.load(open(os.path.join(disease_models_path, "heart_disease_model.sav"), 'rb'))

@app.route('/heart-disease-predict', methods=['POST'])
def heart_disease_predict():
    try:
        # Parse the JSON request
        data = request.json
        
        # Ensure all required fields are provided
        required_fields = [
            "age", "gender", "chest_pain", "tresbps", "cholesterol", "fbs",
            "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal"
        ]
        
        # Check if any required field is missing
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

        # Convert gender to numerical value
        gender = 0 if data["gender"] == "Female" else 1
        
        # Extract features from the request
        input_data = [[
            data["age"], gender, data["chest_pain"], data["tresbps"], data["cholesterol"],
            data["fbs"], data["restecg"], data["thalach"], data["exang"], data["oldpeak"],
            data["slope"], data["ca"], data["thal"]
        ]]

        # we do this since the fields are in string format
        for i in range(0,len(input_data[0]),1):
            input_data[0][i] = int(input_data[0][i])

        # Make a prediction
        print(input_data)
        prediction = heart_disease_model.predict(input_data)

        # Interpret the result
        result = "Person has Heart Disease" if prediction[0] == 1 else "Person does not have Heart Disease"

        return jsonify({"prediction": result})

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500







parkinson_scaler = joblib.load(os.path.join(scaler_path, "parkinson_scaler.pkl"))

parkinson_model = pickle.load(open(os.path.join(disease_models_path, "parkinson_model.sav"), 'rb'))

@app.route('/predict_parkinson', methods=['POST'])
def predict_parkinson():
    try:
        # Get JSON data from request
        data = request.get_json()

        # Extract features
        features = [
            data["MDVP_Jitter_percent"],
            data["MDVP_Jitter_abs"],
            data["MDVP_RAP"],
            data["MDVP_PPQ"],
            data["Jitter_DDP"],
            data["MDVP_Shimmer"],
            data["MDVP_Shimmer_dB"],
            data["Shimmer_APQ3"],
            data["Shimmer_APQ5"],
            data["MDVP_APQ"],
            data["Shimmer_dda"],
            data["NHR"],
            data["HNR"],
            data["RPDE"],
            data["DFA"],
            data["PPE"]
        ]

        # Convert to DataFrame
        df = pd.DataFrame([features], columns=[
            "MDVP:Jitter(%)", "MDVP:Jitter(Abs)", "MDVP:RAP", "MDVP:PPQ", 
            "Jitter:DDP", "MDVP:Shimmer", "MDVP:Shimmer(dB)", "Shimmer:APQ3", 
            "Shimmer:APQ5", "MDVP:APQ", "Shimmer:DDA", "NHR", "HNR", "RPDE", 
            "DFA", "PPE"
        ])

        # Scale the data
        df_scaled = pd.DataFrame(parkinson_scaler.transform(df), columns=df.columns)

        # Make prediction
        prediction = parkinson_model.predict(df_scaled)
        result = "Person has Parkinson" if prediction[0] == 1 else "Person doesn't have Parkinson"

        return jsonify({"prediction": result})

    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == '__main__':
    app.run(debug=True)
