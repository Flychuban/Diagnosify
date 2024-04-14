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


app = FastAPI()

# Configure CORS to allow requests from all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from all origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
     print(file)
     file_stream = await file.read()
     file_in_bytes = BytesIO(file_stream)
     img = image.load_img(file_in_bytes,target_size=(224,224))
     x = image.img_to_array(img)
     x = np.expand_dims(x,axis=0)
     data_ready_for_predcition = preprocess_input(x)   
     predict = models["pneumonia"](data_ready_for_predcition)
     print(predict)
     return {"prediction": str(predct)}


@app.get("/display/{filename}")
async def display_image(filename: str):
    return FileResponse(filename)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
