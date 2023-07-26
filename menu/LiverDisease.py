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
        option = st.selectbox(
        'How would you like to be contacted?',
        ('Female', 'Male'))