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
        pregnancies = st.number_input("Pregnancies", min_value=0, max_value=100, value=0, step=1)

    with col2:
        glucose = st.number_input("Glucose", min_value=0, value=0, step=1)
    
    with col3:
        blood_pressure = st.number_input("Blood Pressure", min_value=0, value=0, step=1)
    
    with col1:
        skin_thickness = st.number_input("Skin Thickness", min_value=0, value=0, step=1)
    
    with col2:
        insulin = st.number_input("Insulin", min_value=0, value=0, step=1)
    
    with col3:
        bmi = st.number_input("BMI", min_value=0, value=0)
    
    with col1:
        diabetes_pedigree_function = st.number_input("Diabetes Pedigree Function", min_value=0.0000, value=0.0000, step=0.0001, format="%.4f")
    
    with col2:
        age = st.number_input("Age", min_value=0, value=0, step=1)
    
    diabetes_prediction = ""
    
    if st.button("Diabetes Predict"):
        diabetes_prediction = diabetes_model.predict([[pregnancies, glucose, blood_pressure, skin_thickness, insulin, bmi, diabetes_pedigree_function, age]])
        print(diabetes_prediction)
        if diabetes_prediction[0] == 1:
            st.error("Person have Diabetes")
        else:
            st.success("Person don't have Diabetes")