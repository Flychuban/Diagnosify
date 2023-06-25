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
    selected_disease = option_menu("Select Disease", ["Diabetes", "Heart Disease", "Parkinson"], default_index=0)

if selected_disease == "Diabetes":
    st.title("Diabetes Prediction using ML")

elif selected_disease == "Heart Disease":
    st.title("Heart Disease Prediction using ML")

elif selected_disease == "Parkinson":
    st.title("Parkinson Prediction using ML")