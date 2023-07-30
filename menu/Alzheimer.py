import streamlit as st
from tensorflow.keras.models import load_model
import os
import numpy as np
from matplotlib import pyplot as plt
from PIL import Image

import keras.utils as image

disease_models_path = os.path.join(os.getcwd(), "disease_models")
alzheimer_model = load_model(os.path.join(disease_models_path, "alzheimer_model.h5"))


def alzheimer_menu():
    st.title("Disease Prediction using ML")
    st.info('This is a example of using a trained ML model to make predictions for alzheimer classification on images.')
    
    uploaded_file = st.file_uploader("Choose a file", type=["jpg", "jpeg", "jfif","png"])
    CLASSES = ["MildDemented","Demented", 'NonDemented', "VeryMildDemented"]
    
    if uploaded_file is not None:
        img = image.load_img(uploaded_file, target_size=(176, 208))
        img_data = image.img_to_array(img)
        img_data = np.expand_dims(img_data, axis=0)
        
        prediction = alzheimer_model.predict(img_data)
        print(f"Prediction: {prediction}")
        max_index = None
        max_value = 0
        for i in range(len(CLASSES)):
            if prediction[0][i] > max_value:
                max_value = prediction[0][i]
                max_index = i
        
        if max_value > 0.40:
            if max_index == 0:
                st.error("Person is MildDemented!")
            
            elif max_index == 1:
                st.error("Person is Demented!")
            
            elif max_index == 2:
                st.success("Person is NonDemented!")
            
            elif max_index == 3:
                st.error("Person is VeryMildDemented!")
            
        else:
            st.warning("Prediction is not confident enough!")
            
        image_plot = Image.open(uploaded_file)
        st.image(image_plot, caption='Uploaded Image', use_column_width=True)