from fastapi import FastAPI, UploadFile, File, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from matplotlib import pyplot as plt
import io
from models_export_rerouter import models
from keras.applications.vgg19 import preprocess_input
import keras.utils as image
import pandas as pd
import tensorflow as tf
import cv2
from fastapi.responses import FileResponse


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from all origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

def get_body_fat_percentage_label(req):
    data = [[req["age"], req["weight"], req["height"], req["neck"], req["chest"], req["abdomen"], req["hip"], req["thigh"], req["knee"], req["ankle"], req["biceps"], req["forearm"], req["wrist"]]]
    
    df_dummies = pd.DataFrame(data, columns=["Age", "Weight", "Height", "Neck", "Chest", "Abdomen", "Hip", "Thigh", "Knee", "Ankle", "Biceps", "Forearm", "Wrist"])
    column_names = df_dummies.columns
    df_dummies[column_names] = models["body_fat_percentage_scaler"](df_dummies[column_names])
    body_fat_prediction = models["body_fat_percentage"](df_dummies[["Age", "Weight", "Height", "Neck", "Chest", "Abdomen", "Hip", "Thigh", "Knee", "Ankle", "Biceps", "Forearm", "Wrist"]])
    result = body_fat_prediction[0]
    return {"body": str(result)}

def get_diabetes_label(req):
    data = [[req["pregnancies"], req["glucose"], req["blood_pressure"], req["skin_thickness"], req["insulin"], req["bmi"], req["diabetes_pedigree_function"], req["age"]]]
    df_dummies = pd.DataFrame(data, columns=["Pregnancies", "Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"])
    column_names = df_dummies.columns
    df_dummies[column_names] = models["diabetes_scaler"](df_dummies[column_names])
    diabetes_prediction = models["diabetes"](df_dummies[["Pregnancies", "Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"]])
    result = diabetes_prediction[0]
    if result == 1:
        result = True
    else:
        result = False
    return {"body": str(result)}

def get_breast_cancer_label(req):
    data = [[req["radius_mean"], req["perimeter_mean"], req["area_mean"], req["compactness_mean"], req["concavity_mean"], req["concave_points_mean"], req["radius_se"], req["perimeter_se"], req["area_se"], req["radius_worst"], req["perimeter_worst"], req["area_worst"], req["compactness_worst"], req["concavity_worst"], req["concave_points_worst"]]]
    df_dummies = pd.DataFrame(data, columns=["radius_mean", "perimeter_mean", "area_mean", "compactness_mean", "concavity_mean", "concave points_mean", "radius_se", "perimeter_se", "area_se", "radius_worst", "perimeter_worst", "area_worst", "compactness_worst", "concavity_worst", "concave points_worst"])
    column_names = df_dummies.columns
    df_dummies[column_names] = models["breast_cancer_scaler"](df_dummies[column_names])
    breast_cancer_prediction = models["breast_cancer"](df_dummies[["radius_mean", "perimeter_mean", "area_mean", "compactness_mean", "concavity_mean", "concave points_mean", "radius_se", "perimeter_se", "area_se", "radius_worst", "perimeter_worst", "area_worst", "compactness_worst", "concavity_worst", "concave points_worst"]])
    result = breast_cancer_prediction[0]
    if result == 1:
        result = True
    else:
        result = False
    return {"body": str(result)}

def get_liver_disease_label(req):
    liver_disease_prediction = models["liver_disease"]([[req["age"], req["gender"], req["total_bilirubin"], req["direct_bilirubin"], req["alkaline_phosphotase"], req["alamine_aminotransferase"], req["aspartate_aminotransferase"], req["total_proteins"], req["albumin"], req["albumin_and_globulin_ratio"]]])
    
    result = liver_disease_prediction[0]
    if result == 0:
        result = True
    else:
        result = False
    return {"body": str(result)}

def get_heart_disease_label(req):
    heart_disease_prediction = models["heart_disease"]([[req["age"], req["gender"], req["chest_pain"], req["resting_blood_pressure"], req["cholesterol"], req["fasting_blood_sugar"], req["resting_electrocardiographic"], req["maximum_heart_rate_achieved"], req["exercise_induced_angina"], req["oldpeak"], req["slope"], req["ca"], req["thal"]]])
    result = heart_disease_prediction[0]
    if result == 1:
        result = True
    else:
        result = False
    return {"body": str(result)}

def get_kidney_disease_label(req):
    data = [[req["specific_gravity"], req["albumin"], req["serum_creatinine"], req["hemoglobin"], req["pcv"], req["hypertension"]]]
    df_dummies = pd.DataFrame(data, columns=["sg", "al", "sc", "hemo", "pcv", "htn"])
    column_names = df_dummies.columns
    df_dummies[column_names] = models["kidney_scaler"](df_dummies[column_names])
    kidney_prediction = models["kidney"](df_dummies[["sg", "al", "sc", "hemo", "pcv", "htn"]])
    result = kidney_prediction[0]
    if result == 1:
        result = True
    else:
        result = False
    return {"body": str(result)}

def get_parkinson_label(req):
    data = [[req["mdvp_jitter_percent"], req["mdvp_jitter_abs"], req["mdvp_rap"], req["mdvp_ppq"], req["jitter_ddp"], req["mdvp_shimmer"], req["mdvp_shimmer_db"], req["shimmer_apq3"], req["shimmer_apq5"], req["mdvp_apq"], req["shimmer_dda"], req["nhr"], req["hnr"], req["rpde"], req["dfa"], req["ppe"]]]
    df_dummies = pd.DataFrame(data, columns=["MDVP:Jitter(%)", "MDVP:Jitter(Abs)", "MDVP:RAP", "MDVP:PPQ", "Jitter:DDP", "MDVP:Shimmer", "MDVP:Shimmer(dB)", "Shimmer:APQ3", "Shimmer:APQ5", "MDVP:APQ", "Shimmer:DDA", "NHR", "HNR", "RPDE", "DFA", "PPE"])
    column_names = df_dummies.columns
    df_dummies[column_names] = models["parkinson_scaler"](df_dummies[column_names])
    parkinson_prediction = models["parkinson"](df_dummies[["MDVP:Jitter(%)", "MDVP:Jitter(Abs)", "MDVP:RAP", "MDVP:PPQ", "Jitter:DDP", "MDVP:Shimmer", "MDVP:Shimmer(dB)", "Shimmer:APQ3", "Shimmer:APQ5", "MDVP:APQ", "Shimmer:DDA", "NHR", "HNR", "RPDE", "DFA", "PPE"]])
    result = parkinson_prediction[0]
    if result == 1:
        result = True
    else:
        result = False
    return {"body": str(result)}

def get_pneumonia_label(file_in_bytes):
    img = image.load_img(file_in_bytes,target_size=(224,224))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    img_data = preprocess_input(x)
    pneumonia_prediction = models["pneumonia"](img_data)
    result = pneumonia_prediction[0][1]
    if result < 0.5:
        result = False
    else:
        result = True
    return {"body": str(result)}

def get_malaria_label(file_in_bytes):
    img = image.load_img(file_in_bytes, target_size=(128, 128))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    img_data = preprocess_input(x)
    malaria_prediction = models["malaria"](img_data)
    result = malaria_prediction[0]
    if result < 0.5:
        result = True
    else:
        result = False
    return {"body": str(result)}

def get_cancer_segmentation_image(file_in_bytes):
    def read_image(content: bytes) -> np.ndarray:
        """
        Image bytes to OpenCV image

        :param content: Image bytes
        :returns OpenCV image
        :raises TypeError: If content is not bytes
        :raises ValueError: If content does not represent an image
        """
        if not isinstance(content, bytes):
            raise TypeError(f"Expected 'content' to be bytes, received: {type(content)}")
        image = cv2.imdecode(np.frombuffer(content, dtype=np.uint8), cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError(f"Expected 'content' to be image bytes")
        return image
    

    # Convert image to bytes
    bytes_data = file_in_bytes.read()
    tensor = tf.convert_to_tensor(bytes_data, dtype=tf.string)
    image = tf.io.decode_image(tensor, channels=3)
            
    yhat = models["cancer_segmentation"](tf.expand_dims(image, axis=0)) # Predict the image
    yhat = np.squeeze(np.where(yhat > 0.5, 1.0, 0.0)) # Threshold the prediction
    result_image = read_image(bytes_data) # Read the image again to show the result
    
    # Plot the result image and the prediction
    fig, ax = plt.subplots(1, 7, figsize=(20, 10))
    ax[0].imshow(result_image) 
    for i in range(6):
        ax[i+1].imshow(yhat[:,:,i])
        
    plot_image_stream = io.BytesIO()
    fig.savefig(plot_image_stream, format='PNG')  # Save the figure to the BytesIO object
    plot_image_stream.seek(0)  # Seek to the start of the stream

    plt.close(fig)
    
    # Save the BytesIO stream to a file
    file_path = "./menu/temp_image.png"  # Define the path where you want to save the file
    with open(file_path, "wb") as f:
        plot_image_stream.seek(0)  # Go to the start of the BytesIO stream
        f.write(plot_image_stream.getvalue())  # Write the BytesIO content to a file

    # Return the file directly
    return FileResponse(file_path, media_type='image/png', filename="temp_image.png")
    
    # # img = Image.open("./menu/test_img.jpeg")
    # # plot_image_stream = io.BytesIO()
    # # img.save(plot_image_stream, format="PNG")
    
    # return {"body": plot_image_stream.getvalue(), "type": "picture"} # Type is a flag to indicate that the response is an image
    #  Encode the binary data to Base64
    # base64_encoded_data = base64.b64encode(plot_image_stream.getvalue())
    # base64_message = base64_encoded_data.decode('utf-8')  # Decode to UTF-8 string for JSON compatibility

    # # Return as JSON
    # return JSONResponse(content={"image": base64_message}, media_type="application/json")
        
routes_data = [
    {
        "route": "/diabetes",
        "post_handler": lambda req: get_diabetes_label(req)
    },
    {
        "route": "/body_fat_percentage", 
        "post_handler": lambda req: get_body_fat_percentage_label(req)
    },
    {
        "route": "/liver_disease",
        "post_handler": lambda req: get_liver_disease_label(req)
    },
    {
        "route": "/breast_cancer",
        "post_handler": lambda req: get_breast_cancer_label(req) 
    },
    {
        "route": "/heart_disease",
        "post_handler": lambda req: get_heart_disease_label(req)
    },
    {
        "route": "/kidney_disease",
        "post_handler": lambda req: get_kidney_disease_label(req)
    },
    {
        "route": "/parkinson",
        "post_handler": lambda req: get_parkinson_label(req)
    },
    {
        "route":"/pneumonia",
        "is_file": True, # the vslue does not really matter since its just a flag,
        "post_handler": lambda img: get_pneumonia_label(img)
    },
    {
        "route": "/malaria",
        "is_file": True,
        "post_handler": lambda img: get_malaria_label(img)
    },
    {
        "route": "/cancer_segmentation",
        "is_file": True,
        "post_handler": lambda img: get_cancer_segmentation_image(img)
    }
] 

for route_data in routes_data:
    route = route_data["route"]
    handler = route_data["post_handler"]
    if ("is_file" in route_data):
        async def post_handler(file: UploadFile=File(...)):
            print(file)
            file_stream = await file.read()
            file_in_bytes = io.BytesIO(file_stream)
            return handler(file_in_bytes)
        app.post(f"/ml{route}")(post_handler)
        


    else:
        async def post_handler(request: Request, handler=handler):
            print(await request.json())
            request_object = await request.json()
            predcition = handler(request_object)
            print(predcition)
            return predcition

        app.post(f"/ml{route}")(post_handler)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)

