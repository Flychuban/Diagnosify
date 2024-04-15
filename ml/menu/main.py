from fastapi import FastAPI, UploadFile, File, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from matplotlib import pyplot as plt
from PIL import Image
from io import BytesIO
from models_export_rerouter import models
from keras.applications.vgg19 import preprocess_input
import keras.utils as image
import pandas as pd
print(models['diabetes']([[3,20,120,5,50,80,2,20]]))
app = FastAPI()
# def routes_data_builder(models): # since i dont wanna change the existing code i will just make an adapter, might decrease performance but it will be neglegible
#     def build_route(key, post_handler):
#         return {
#             "route":f"/{key}",
#             "post_handler":post_handler
#                 }
#     routes = [] 
#     for key in models.keys():
#         print(key)
#         routes.push(build_route(key, models[key]))

# routes_data =  routes_data_builder(models)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from all origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

def get_body_fat_percentage_label(req):
    data = [[req['age'], req['weight'], req['height'], req['neck'], req['chest'], req['abdomen'], req['hip'], req['thigh'], req['knee'], req['ankle'], req['biceps'], req['forearm'], req['wrist']]]
    
    df_dummies = pd.DataFrame(data, columns=["Age", "Weight", "Height", "Neck", "Chest", "Abdomen", "Hip", "Thigh", "Knee", "Ankle", "Biceps", "Forearm", "Wrist"])
    column_names = df_dummies.columns
    df_dummies[column_names] = models['body_fat_percentage_scaler'](df_dummies[column_names])
    body_fat_prediction = models['body_fat_percentage'](df_dummies[['Age', 'Weight', 'Height', 'Neck', 'Chest', 'Abdomen', 'Hip', 'Thigh', 'Knee', 'Ankle', 'Biceps', 'Forearm', 'Wrist']])
    result = body_fat_prediction[0]
    return {"body": str(result)}

def get_diabetes_label(req):
    data = [[req['pregnancies'], req['glucose'], req['blood_pressure'], req['skin_thickness'], req['insulin'], req['bmi'], req['diabetes_pedigree_function'], req['age']]]
    df_dummies = pd.DataFrame(data, columns=["Pregnancies", "Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"])
    column_names = df_dummies.columns
    df_dummies[column_names] = models['diabetes_scaler'](df_dummies[column_names])
    diabetes_prediction = models['diabetes'](df_dummies[["Pregnancies", "Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"]])
    result = diabetes_prediction[0]
    if result == 1:
        result = True
    else:
        result = False
    return {"body": str(result)}

def get_liver_disease_label(req):
    liver_disease_prediction = models['liver_disease']([[req['age'], req['gender'], req['total_bilirubin'], req['direct_bilirubin'], req['alkaline_phosphotase'], req['alamine_aminotransferase'], req['aspartate_aminotransferase'], req['total_proteins'], req['albumin'], req['albumin_and_globulin_ratio']]])
    
    result = liver_disease_prediction[0]
    if result == 0:
        result = True
    else:
        result = False
    return {"body": str(result)}

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
        "route":"/liver_disease",
        "post_handler": lambda req: get_liver_disease_label(req)
    },
    {
        "route":"/pneumonia",
        "is_file": True, # the vslue does not really matter since its just a flag,
        "post_handler": lambda file: {"body": str(models["pneumonia"](file))}
    }
] 
print("Before result-----------------")
result = routes_data[0]['post_handler']({"pregnancies":2, "glucose":12, "blood_pressure":12, "skin_thickness":12, "insulin":12, "bmi":12, "diabetes_pedigree_function":12, "age":12})
print(result)
print("-----------------")

# for route_data in routes_data:
#     route = route_data["route"]
#     handler = route_data["post_handler"]
#     if ("is_file" in route_data):
#         print("kur")
#         async def post_handler(file: UploadFile=File(...)):
#             print(file)
#             file_stream = await file.read()
#             file_in_bytes = BytesIO(file_stream)
#             img = image.load_img(file_in_bytes,target_size=(224,224))
#             x = image.img_to_array(img)
#             x = np.expand_dims(x,axis=0)
#             data_ready_for_predcition = preprocess_input(x)   
            
#             predict = models["pneumonia"](data_ready_for_predcition)
#             print(predict)
#             return {"prediction": str(predict)}
#         app.post(f"/ml{route}")(post_handler)
        


#     else:
#         async def post_handler(request: Request, handler=handler):
#             print(await request.json())
#             request_object = await request.json()
#             predcition = handler(request_object)
#             print(predcition)
#             return predcition

#         app.post(f"/ml{route}")(post_handler)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)

