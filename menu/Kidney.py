import streamlit as st
from tensorflow.keras.models import load_model
import os

disease_models_path = os.path.join(os.getcwd(), "disease_models")
diabetes_model = load_model(os.path.join(disease_models_path, "kidney_model.h5"))

def kidney_menu():
    st.title("Kidney Disease Prediction using ML")
    
    col1, col2 = st.columns(2)
    
    with col1:
        specific_gravity = st.number_input("Specific Gravity", min_value=0.000, value=0.000, step=0.0001, format="%.4f")
    
    with col2:
        albumin = st.number_input("Albumin", min_value=0, value=0, step=1)
    
    with col1:
        serum_creatinine = st.number_input("Serum Creatinine", min_value=0.000, value=0.000, step=0.0001, format="%.4f")
    
    with col2:
        hemoglobin = st.number_input("Hemoglobin", min_value=0.000, value=0.000, step=0.0001, format="%.4f")
    
    with col1:
        PCV = st.number_input("Packed Cell Volume", min_value=0, value=0, step=1)
    
    with col2:
        hypertension = st.number_input("Hypertension", min_value=0, value=0, step=1, max_value=1)
    
    kidney_prediction = ""
    
    if st.button("Kidney Disease Predict"):
        kidney_prediction = diabetes_model.predict([[specific_gravity, albumin, serum_creatinine, hemoglobin, PCV, hypertension]])
        if kidney_prediction[0] == 1:
            st.error("Person have Kidney Disease")
        else:
            st.success("Person don't have Kidney Disease")