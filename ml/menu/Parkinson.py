import streamlit as st
import pickle
import os
from streamlit_option_menu import option_menu
import pandas as pd
import joblib  

scaler_path = os.path.join(os.getcwd(), "scalers")
scaler = joblib.load(os.path.join(scaler_path, "parkinson_scaler.pkl"))

disease_models_path = os.path.join(os.getcwd(), "disease_models")
parkinson_model = pickle.load(open(os.path.join(disease_models_path, "parkinson_model.sav"), 'rb'))

def parkinson_menu():
    st.title("Parkinson Prediction using ML")
    
    col1, col2, col3, col4 = st.columns(4)
        
    with col1:
        MDVP_Jitter_percent = st.number_input("MDVP_Jitter(%)", min_value=0.000000, step=0.000001, format="%.6f")
    
    with col2:
        MDVP_Jitter_abs = st.number_input("MDVP_Jitter(Abs)", min_value=0.000000, step=0.000001, format="%.6f")
    
    with col3:
        MDVP_RAP = st.number_input("MDVP_RAP", min_value=0.000000, step=0.000001, format="%.6f")
    
    with col4:
        MDVP_PPQ = st.number_input("MDVP_PPQ", min_value=0.000000, step=0.000001, format="%.6f")
    
    with col1:
        Jitter_DDP = st.number_input("Jitter_DDP", min_value=0.000000, step=0.000001, format="%.6f")
    
    with col2:
        MDVP_Shimmer = st.number_input("MDVP_Shimmer", min_value=0.000000, step=0.000001, format="%.6f")
    
    with col3:
        MDVP_Shimmer_dB = st.number_input("MDVP_Shimmer(dB)", min_value=0.000000, step=0.000001, format="%.6f")
        
    with col4:
        Shimmer_APQ3 = st.number_input("Shimmer_APQ3", min_value=0.000000, step=0.000001, format="%.6f")
    
    with col1:
        Shimmer_APQ5 = st.number_input("Shimmer_APQ5", min_value=0.000000, step=0.000001, format="%.6f")
    
    with col2:
        MDVP_APQ = st.number_input("MDVP_APQ", min_value=0.000000, step=0.000001, format="%.6f")
    
    with col3:
        Shimmer_dda = st.number_input("Shimmer_DDA", min_value=0.000000, step=0.000001, format="%.6f")
    
    with col4:
        NHR = st.number_input("NHR", min_value=0.000000, step=0.000001, format="%.6f")
    
    with col1:
        HNR = st.number_input("HNR", min_value=0.000000, step=0.000001, format="%.6f")
    
    with col2:
        RPDE = st.number_input("RPDE", min_value=0.000000, step=0.000001, format="%.6f")
    
    with col3:
        DFA = st.number_input("DFA", min_value=0.000000, step=0.000001, format="%.6f")
    
    with col4:
        PPE = st.number_input("PPE", min_value=0.000000, step=0.000001, format="%.6f")
    
    # Combine all the features into a list and then scale them
    data = [[MDVP_Jitter_percent, MDVP_Jitter_abs, MDVP_RAP, MDVP_PPQ, Jitter_DDP, MDVP_Shimmer, MDVP_Shimmer_dB, Shimmer_APQ3, Shimmer_APQ5, MDVP_APQ, Shimmer_dda, NHR, HNR, RPDE, DFA, PPE]]
    df_dummies = pd.DataFrame(data, columns=["MDVP:Jitter(%)", "MDVP:Jitter(Abs)", "MDVP:RAP", "MDVP:PPQ", "Jitter:DDP", "MDVP:Shimmer", "MDVP:Shimmer(dB)", "Shimmer:APQ3", "Shimmer:APQ5", "MDVP:APQ", "Shimmer:DDA", "NHR", "HNR", "RPDE", "DFA", "PPE"])
    column_names = df_dummies.columns
    df_dummies[column_names] = scaler.transform(df_dummies[column_names])
    
    parkinson_prediction = ""
    
    if st.button("Parkinson Predict"):
        parkinson_prediction = parkinson_model.predict(df_dummies[["MDVP:Jitter(%)", "MDVP:Jitter(Abs)", "MDVP:RAP", "MDVP:PPQ", "Jitter:DDP", "MDVP:Shimmer", "MDVP:Shimmer(dB)", "Shimmer:APQ3", "Shimmer:APQ5", "MDVP:APQ", "Shimmer:DDA", "NHR", "HNR", "RPDE", "DFA", "PPE"]])
        
        if parkinson_prediction[0] == 1:
            st.error("Person have Parkinson")
        else:
            st.success("Person don't have Parkinson")
