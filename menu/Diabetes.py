import streamlit as st
from streamlit_option_menu import option_menu
import pickle
import os

disease_models_path = os.path.join(os.getcwd(), "disease_models")

diabetes_model = pickle.load(open(os.path.join(disease_models_path, "diabetes_prediction.sav"), 'rb'))

def diabetes_menu():
    st.title("Diabetes Prediction using ML")
    
    # Making the input fields
    col1, col2, col3 = st.columns(3)
    with col1:
        pregnancies = st.number_input("Pregnancies")

    with col2:
        glucose = st.number_input("Glucose")
    
    with col3:
        blood_pressure = st.number_input("Blood Pressure")
    
    with col1:
        skin_thickness = st.number_input("Skin Thickness")
    
    with col2:
        insulin = st.number_input("Insulin")
    
    with col3:
        bmi = st.number_input("BMI")
    
    with col1:
        diabetes_pedigree_function = st.number_input("Diabetes Pedigree Function")
    
    with col2:
        age = st.number_input("Age")
    
    diabetes_prediction = ""
    
    if st.button("Diabetes Predict"):
        diabetes_prediction = diabetes_model.predict([[pregnancies, glucose, blood_pressure, skin_thickness, insulin, bmi, diabetes_pedigree_function, age]])
        if diabetes_prediction[0] == 1:
            st.error("Person have Diabetes")
        else:
            st.success("Person don't have Diabetes")