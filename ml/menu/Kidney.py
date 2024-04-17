import streamlit as st
from tensorflow.keras.models import load_model
import os
import joblib
import pandas as pd

scaler_path = os.path.join(os.getcwd(), "scalers")
kidney_scaler = joblib.load(os.path.join(scaler_path, "kidney_disease_scaler.pkl"))

disease_models_path = os.path.join(os.getcwd(), "disease_models")
kidney_model = load_model(os.path.join(disease_models_path, "kidney_model.h5"))

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
    
    
        # Combine all the features into a list and then scale them
    data = [[specific_gravity, albumin, serum_creatinine, hemoglobin, PCV, hypertension]]
    df_dummies = pd.DataFrame(data, columns=["sg", "al", "sc", "hemo", "pcv", "htn"])
    column_names = df_dummies.columns
    df_dummies[column_names] = kidney_scaler.transform(df_dummies[column_names])
    
    kidney_prediction = ""
    
    if st.button("Kidney Disease Predict"):
        kidney_prediction = kidney_model.predict(df_dummies[["sg", "al", "sc", "hemo", "pcv", "htn"]])
        if kidney_prediction[0] == 1:
            st.error("Person have Kidney Disease")
        else:
            st.success("Person don't have Kidney Disease")
