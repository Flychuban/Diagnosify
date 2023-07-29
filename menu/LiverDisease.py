import streamlit as st
import os
import pickle

disease_models_path = os.path.join(os.getcwd(), "disease_models")
liver_disease_model = pickle.load(open(os.path.join(disease_models_path, "liver_disease_model.sav"), 'rb'))


def liver_disease_menu():
    st.title("Liver Disease Prediction using ML")
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
        total_bilirubin = st.number_input("Total Bilirubin", min_value=0.00, value=0.00, step=0.01)
        
    with col1:    
        direct_bilirubin = st.number_input("Direct Bilirubin", min_value=0.00, value=0.00, step=0.01)
        
    with col2:
        alkaline_phosphotase = st.number_input("Alkaline Phosphotase", min_value=0, value=0, step=1)
    
    with col3:
        alamine_aminotransferase = st.number_input("Alamine Aminotransferase", min_value=0, value=0, step=1)
        
    with col1:
        aspartate_aminotransferase = st.number_input("Aspartate Aminotransferase", min_value=0, value=0, step=1)
        
    with col2:
        total_protiens = st.number_input("Total Protiens", min_value=0.00, value=0.00, step=0.01)
    
    with col3:
        albumin = st.number_input("Albumin", min_value=0.00, value=0.00, step=0.01)
        
    with col1:
        ag_ratio = st.number_input("A/G Ratio", min_value=0.00, value=0.00, step=0.01)
    
    liver_disease_prediction = ""
    
    if st.button("Liver Disease Predict"):
    
        liver_disease_prediction = liver_disease_model.predict([[age, gender, total_bilirubin, direct_bilirubin, alkaline_phosphotase, alamine_aminotransferase, aspartate_aminotransferase, total_protiens, albumin, ag_ratio]])
        
        print(liver_disease_prediction)
        
        if liver_disease_prediction[0] == 0:
            st.error("Person have Liver Disease")
        else:
            st.success("Person don't have Liver Disease")