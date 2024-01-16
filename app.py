import streamlit as st
from streamlit_option_menu import option_menu
from menu.Diabetes import diabetes_menu
from menu.HeartDisease import heart_disease_menu
from menu.Parkinson import parkinson_menu
from menu.Kidney import kidney_menu
from menu.BreastCancer import breast_cancer_menu
from menu.CancerSegmentation import cancer_segmentation_menu
from menu.Pneumonia import pneumonia_menu
from menu.Malaria import malaria_menu
from menu.Alzheimer import alzheimer_menu
from menu.LiverDisease import liver_disease_menu
import os


with st.sidebar:
    st.title("Disease Prediction")
    st.write("Select the disease you want to predict")
    selected_disease = option_menu("Select Disease", ["Diabetes", "Heart Disease", "Parkinson", "Kidney Disease", "Breast Cancer", "Cancer Segmentation", "Pneumonia", "Malaria", 'Liver Disease'],
    icons=['droplet', 'heart', 'person', 'clipboard2-heart', 'award', 'zoom-in', 'lungs', 'globe-europe-africa', 'moisture'],
    default_index=0)

if selected_disease == "Diabetes":
    diabetes_menu()
            
elif selected_disease == "Heart Disease":
    heart_disease_menu()
        
    
elif selected_disease == "Parkinson":
    parkinson_menu()

elif selected_disease == "Kidney Disease":
    kidney_menu()

elif selected_disease == "Breast Cancer":
    breast_cancer_menu()

elif selected_disease == "Cancer Segmentation":
    cancer_segmentation_menu()

elif selected_disease == "Pneumonia":
    pneumonia_menu()

elif selected_disease == "Malaria":
    malaria_menu()

# elif selected_disease == "Alzheimer":
#     alzheimer_menu()

elif selected_disease == "Liver Disease":
    liver_disease_menu()