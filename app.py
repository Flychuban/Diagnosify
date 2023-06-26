import pickle
import streamlit as st
from streamlit_option_menu import option_menu
from menu.Diabetes import diabetes_menu
from menu.HeartDisease import heart_disease_menu
from menu.Parkinson import parkinson_menu
from menu.Kidney import kidney_menu
import os


with st.sidebar:
    st.title("Disease Prediction")
    st.write("Select the disease you want to predict")
    selected_disease = option_menu("Select Disease", ["Diabetes", "Heart Disease", "Parkinson", "Kidney Disease"],
    icons=['droplet', 'heart', 'person', 'clipboard2-heart'],
    default_index=0)

if selected_disease == "Diabetes":
    diabetes_menu()
            
elif selected_disease == "Heart Disease":
    heart_disease_menu()
        
    
elif selected_disease == "Parkinson":
    parkinson_menu()

elif selected_disease == "Kidney Disease":
    kidney_menu()