import streamlit as st
import pickle
import os
from streamlit_option_menu import option_menu  


disease_models_path = os.path.join(os.getcwd(), "disease_models")
parkinson_model = pickle.load(open(os.path.join(disease_models_path, "parkinson_model.sav"), 'rb'))

def parkinson_menu():
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