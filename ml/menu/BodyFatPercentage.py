import streamlit as st
import pickle
import os
import joblib
import pandas as pd


scaler_path = os.path.join(os.getcwd(), "scalers")
body_fat_percentage_scaler = joblib.load(os.path.join(scaler_path, "body_fat_scaler.pkl"))


disease_models_path = os.path.join(os.getcwd(), "disease_models")
body_fat_percentage_model = pickle.load(open(os.path.join(disease_models_path, "body_fat_linreg.sav"), 'rb'))


def body_fat_menu():
    st.title("Body Fat Percentage Prediction using ML")
    col1, col2, col3, col4 = st.columns(4)

    with col1:
        age = st.number_input("Age", min_value=0, value=0, max_value=120, step=1)

    with col2:
        weight = st.number_input("Weight (kg)", min_value=0.00, value=0.00, max_value=300.00, step=0.01, format="%.2f")
    
    with col3:
        height = st.number_input("Height (cm)", min_value=0.00, value=0.00, max_value=250.00, step=0.01, format="%.2f")
    
    with col4:
        neck = st.number_input("Neck (cm)", min_value=0.00, value=0.00, max_value=70.00, step=0.01, format="%.2f")
    
    with col1:
        chest = st.number_input("Chest (cm)", min_value=0.00, value=0.00, max_value=200.00, step=0.01, format="%.2f")
    
    with col2:
        abdomen = st.number_input("Abdomen (cm)", min_value=0.00, value=0.00, max_value=200.00, step=0.01, format="%.2f")
    
    with col3:
        hip = st.number_input("Hip (cm)", min_value=0.00, value=0.00, max_value=200.00, step=0.01, format="%.2f")
    
    with col4:
        thigh = st.number_input("Thigh (cm)", min_value=0.00, value=0.00, max_value=150.00, step=0.01, format="%.2f")
    
    with col1:
        knee = st.number_input("Knee (cm)", min_value=0.00, value=0.00, max_value=100.00, step=0.01, format="%.2f")
    
    with col2:
        ankle = st.number_input("Ankle (cm)", min_value=0.00, value=0.00, max_value=100.00, step=0.01, format="%.2f")
    
    with col3:
        biceps = st.number_input("Biceps (cm)", min_value=0.00, value=0.00, max_value=100.00, step=0.01, format="%.2f")
    
    with col4:
        forearm = st.number_input("Forearm (cm)", min_value=0.00, value=0.00, max_value=100.00, step=0.01, format="%.2f")

    with col1:
        wrist = st.number_input("Wrist (cm)", min_value=0.00, value=0.00, max_value=100.00, step=0.01, format="%.2f")
    
    
    # Combine all the features into a list and then scale them
    data = [[age, weight, height, neck, chest, abdomen, hip, thigh, knee, ankle, biceps, forearm, wrist]]
    df_dummies = pd.DataFrame(data, columns=["Age", "Weight", "Height", "Neck", "Chest", "Abdomen", "Hip", "Thigh", "Knee", "Ankle", "Biceps", "Forearm", "Wrist"])
    column_names = df_dummies.columns
    df_dummies[column_names] = body_fat_percentage_scaler.transform(df_dummies[column_names])

    body_fat_prediction = ""

    if st.button("Body Fat Predict"):
        body_fat_prediction = body_fat_percentage_model.predict(df_dummies[['Age', 'Weight', 'Height', 'Neck', 'Chest', 'Abdomen', 'Hip', 'Thigh', 'Knee', 'Ankle', 'Biceps', 'Forearm', 'Wrist']])
        if body_fat_prediction[0]:
            st.success(f"Body Fat Percentage: {body_fat_prediction[0]}")
        else:
            st.error("Body Fat Percentage: 0.0")