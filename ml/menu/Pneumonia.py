import streamlit as st
from tensorflow.keras.models import load_model
import os
import numpy as np
from matplotlib import pyplot as plt
from PIL import Image


from keras.applications.vgg19 import preprocess_input
import keras.utils as image

disease_models_path = os.path.join(os.getcwd(), "disease_models")
pneumonia_model = load_model(os.path.join(disease_models_path, "pneumonia_model.h5"))


def pneumonia_menu():
    st.title("Pneumonia Disease Prediction using ML")
    st.info('This is a example of using a trained ML model to make predictions for cancer segmentation on images.')
    
    
    uploaded_file = st.file_uploader("Choose a file", type=["jpg", "jpeg", "jfif","png"])
    
    # Choose the output format
    # output_format = st.selectbox("Choose Output Format", ("JPG, JFIF, JPEG", "PNG"))
    
    if uploaded_file is not None:
                            
        print(uploaded_file)
        img = image.load_img(uploaded_file, target_size=(224, 224))
        x = image.img_to_array(img)
        x = np.expand_dims(x, axis=0)
        img_data = preprocess_input(x)
        prediction = pneumonia_model.predict(img_data)
        
        print(f"Prediction: {prediction}")
        
        if prediction[0][1] < 0.5:
            st.success("Person DON'T have Pneumonia! Percentage of having Pneumonia: " + str(prediction[0][1]*100) + "%")
        
        else:
            st.error("Person have Pneumonia! Percentage of having Pneumonia: " + str(prediction[0][1]*100) + "%")
            
        image_plot = Image.open(uploaded_file)
        st.image(image_plot, caption='Uploaded Image', use_column_width=True)
