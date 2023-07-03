import streamlit as st
from tensorflow.keras.models import load_model
import os
import numpy as np
import tensorflow as tf
import cv2
from matplotlib import pyplot as plt
from PIL import Image
import io


from keras.applications.vgg19 import preprocess_input
import keras.utils as image

disease_models_path = os.path.join(os.getcwd(), "disease_models")
pneumonia_model = load_model(os.path.join(disease_models_path, "pneumonia_model.h5"))

# Function to resize the image
def resize_image(image, size):
    resized_image = image.resize(size)
    return resized_image


def pneumonia_menu():
    st.title("Pneumonia Disease Prediction using ML")
    st.info('This is a example of using a trained ML model to make predictions for cancer segmentation on images.')
    
    
    uploaded_file = st.file_uploader("Choose a file", type=["jpg", "jpeg", "jfif","png"])
    
    # Choose the output format
    # output_format = st.selectbox("Choose Output Format", ("JPG, JFIF, JPEG", "PNG"))
    
    if uploaded_file is not None:
        
        # # Read the image file
        # image = Image.open(uploaded_file)
        
        # # Resize the image
        # resized_image = resize_image(image, (224, 224))
        
        # image_stream = io.BytesIO()
        # # if output_format.lower() == "jpg":
        # #     resized_image.save(image_stream, format="JPEG", quality=95)
        # # else:
        # resized_image.save(image_stream, format="PNG")
        
        # image_stream.seek(0)
        
        # # Convert image to bytes
        # bytes_data = image_stream.getvalue()
                
        # image = tf.io.decode_image(bytes_data) # Decode the image from bytes to tensors for prediction
        
        # yhat = pneumonia_model.predict(tf.expand_dims(bytes_data, axis=0)) # Predict the image
        
        img = image.load_img(uploaded_file, target_size=(224, 224))
        x = image.img_to_array(img)
        x = np.expand_dims(x, axis=0)
        img_data = preprocess_input(x)
        prediction = pneumonia_model.predict(img_data)
        
        st.title(f"Prediction: {prediction[0][1]}")