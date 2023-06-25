import pickle
import streamlit as st
from streamlit_option_menu import option_menu
import os

disease_models_path = os.path.join(os.getcwd(), "disease_models")

diabetes_model = pickle.load(open(os.path.join(disease_models_path, "diabetes_prediction.sav"), 'rb'))
heart_disease_model = pickle.load(open(os.path.join(disease_models_path, "heart_disease_model.sav"), 'rb'))
parkinson_model = pickle.load(open(os.path.join(disease_models_path, "parkinson_model.sav"), 'rb'))


with st.sidebar:
    st.title("Disease Prediction")
    st.write("Select the disease you want to predict")
    selected_disease = option_menu("Select Disease", ["Diabetes", "Heart Disease", "Parkinson"],
    icons=['droplet', 'heart', 'person'],
    default_index=0)

if selected_disease == "Diabetes":
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
    
        
elif selected_disease == "Heart Disease":
    st.title("Heart Disease Prediction using ML")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        age = st.number_input("Age")
    
    with col2:
        gender = st.number_input("Gender")
    
    with col3:
        chest_pain = st.number_input("Chest Pain")

    with col1:
        tresbps = st.number_input("Tresbps")
    
    with col2:
        cholesterol =  st.number_input("Cholesterol")
    
    with col3:
        fbs = st.number_input("FBS")
    
    with col1:
        restecg = st.number_input("Restecg")
    
    with col2:
        thalach = st.number_input("Thalach")
    
    with col3:
        exang = st.number_input("Exang")
    
    with col1:
        oldpeak = st.number_input("Oldpeak")
    
    with col2:
        slope = st.number_input("Slope")
    
    with col3:
        ca = st.number_input("Ca")
    
    with col1:
        thal = st.number_input("Thal")
        
    heart_disease_prediction = ""
    
    if st.button("Heart Disease Predict"):
        heart_disease_prediction = heart_disease_model.predict([[age, gender, chest_pain, tresbps, cholesterol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal]])
        
        if heart_disease_prediction[0] == 1:
            st.error("Person have Heart Disease")
        else:
            st.success("Person don't have Heart Disease")
        
    
elif selected_disease == "Parkinson":
    st.title("Parkinson Prediction using ML")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        MDVP_Fo = st.number_input("MDVP_Fo")
    
    with col2:
        MDVP_Fhi = st.number_input("MDVP_Fhi")
    
    with col3:
        MDVP_Flo = st.number_input("MDVP_Flo")
    
    with col4:
        MDVP_Jitter_percent = st.number_input("MDVP_Jitter(%)", step=0.000001)
    
    with col1:
        MDVP_Jitter_abs = st.number_input("MDVP_Jitter(Abs)", step=0.000001)
    
    with col2:
        MDVP_RAP = st.number_input("MDVP_RAP")
    
    with col3:
        MDVP_PPQ = st.number_input("MDVP_PPQ")
    
    with col4:
        Jitter_DDP = st.number_input("Jitter_DDP")
    
    with col1:
        MDVP_Shimmer = st.number_input("MDVP_Shimmer")
    
    with col2:
        MDVP_Shimmer_dB = st.number_input("MDVP_Shimmer(dB)")
        
    with col3:
        Shimmer_APQ3 = st.number_input("Shimmer_APQ3")
    
    with col4:
        Shimmer_APQ5 = st.number_input("Shimmer_APQ5")
    
    with col1:
        MDVP_APQ = st.number_input("MDVP_APQ")
    
    with col2:
        Shimmer_all = st.number_input("Shimmer_DDA")
    
    with col3:
        NHR = st.number_input("NHR")
    
    with col4:
        HNR = st.number_input("HNR")
    
    with col1:
        RPDE = st.number_input("RPDE")
    
    with col2:
        DFA = st.number_input("DFA")
    
    with col3:
        spread1 = st.number_input("Spread1")
    
    with col4:
        spread2 = st.number_input("Spread2")
    
    with col1:
        D2 = st.number_input("D2")
    
    with col2:
        PPE = st.number_input("PPE")
    
    parkinson_prediction = ""
    
    if st.button("Parkinson Predict"):
        parkinson_prediction = parkinson_model.predict([[MDVP_Fo, MDVP_Fhi, MDVP_Flo, MDVP_Jitter_percent, MDVP_Jitter_abs, MDVP_RAP, MDVP_PPQ, Jitter_DDP, MDVP_Shimmer, MDVP_Shimmer_dB, Shimmer_APQ3, Shimmer_APQ5, MDVP_APQ, Shimmer_all, NHR, HNR, RPDE, DFA, spread1, spread2, D2, PPE]])
        
        if parkinson_prediction[0] == 1:
            st.error("Person have Parkinson")
        else:
            st.success("Person don't have Parkinson")