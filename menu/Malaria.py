import streamlit as st
from tensorflow.keras.models import load_model
import os
import numpy as np
from matplotlib import pyplot as plt
from PIL import Image

import keras.utils as image

disease_models_path = os.path.join(os.getcwd(), "disease_models")
malaria_model = load_model(os.path.join(disease_models_path, "malaria_model_cnn.h5"))

def malaria_menu():
    st.title("Malaria Disease Prediction using ML")
    st.info('This is a example of using a trained ML model to make predictions for malaria classification on images.')
    
    
    uploaded_file = st.file_uploader("Choose a file", type=["jpg", "jpeg", "jfif","png"])
    
    if uploaded_file is not None:
                            
        img = image.load_img(uploaded_file, target_size=(128, 128))
        x = image.img_to_array(img)
        x = np.expand_dims(x, axis=0)
        prediction = malaria_model.predict(x)
        
        print(f"Prediction: {prediction}")
        
        if prediction[0] > 0.5:
            st.success("Person DON'T have Malaria!")
        
        else:
            st.error("Person have Malaria!")
            
        image_plot = Image.open(uploaded_file)
        st.image(image_plot, caption='Uploaded Image', use_column_width=True)