import streamlit as st
from streamlit_option_menu import option_menu
import pickle
import os

disease_models_path = os.path.join(os.getcwd(), "disease_models")
heart_disease_model = pickle.load(open(os.path.join(disease_models_path, "heart_disease_model.sav"), 'rb'))

def heart_disease_menu():
    st.title("Heart Disease Prediction using ML")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        age = st.number_input("Age", min_value=0, value=0, step=1)
    
    with col2:   
        gender = st.selectbox(
        'Gender',
        ('Female', 'Male'))
        
        if gender == "Female":
            gender = 0
        else:
            gender = 1
    
    with col3:
        chest_pain = st.number_input("Chest Pain", min_value=0, value=0, step=1, max_value=3)

    with col1:
        tresbps = st.number_input("Resting Blood Pressure", min_value=0, value=0, step=1)
    
    with col2:
        cholesterol =  st.number_input("Cholesterol", min_value=0, value=0, step=1)
    
    with col3:
        fbs = st.number_input("Fasting Blood Sugar", min_value=0, value=0, step=1)
    
    with col1:
        restecg = st.number_input("Resting Electrocardiographic", min_value=0, value=0, step=1)
    
    with col2:
        thalach = st.number_input("Maximum Heart Rate Achieved", min_value=0, value=0, step=1)
    
    with col3:
        exang = st.number_input("Exercise-Induced Angina", min_value=0, value=0, step=1)
    
    with col1:
        oldpeak = st.number_input("Oldpeak", min_value=0.00, value=0.00, step=0.01, format="%.2f")
    
    with col2:
        slope = st.number_input("Slope", min_value=0, value=0, step=1)
    
    with col3:
        ca = st.number_input("Ca", min_value=0, value=0, step=1)
    
    with col1:
        thal = st.number_input("Thalassemia", min_value=0, value=0, step=1)
        
    heart_disease_prediction = ""
    
    if st.button("Heart Disease Predict"):
        heart_disease_prediction = heart_disease_model.predict([[age, gender, chest_pain, tresbps, cholesterol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal]])
        
        if heart_disease_prediction[0] == 1:
            st.error("Person have Heart Disease")
        else:
            st.success("Person don't have Heart Disease")