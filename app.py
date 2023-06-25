import pickle
import streamlit as st
from streamlit_option_menu import option_menu
import os

disease_models_path = os.path.join(os.getcwd(), "disease_models")

all_files = os.listdir(disease_models_path)

diabetes_model = pickle.load(open(os.path.join(disease_models_path, all_files[0]), 'rb'))


print(diabetes_model.predict([[8,183,64,0,0,23.3,0.672,32]]))
