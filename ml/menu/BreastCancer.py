import streamlit as st
import pickle
import os
import joblib
import pandas as pd

scaler_path = os.path.join(os.getcwd(), "scalers")
scaler = joblib.load(os.path.join(scaler_path, "breast_cancer_scaler.pkl"))


disease_models_path = os.path.join(os.getcwd(), "disease_models")
breast_cancer_model = pickle.load(open(os.path.join(disease_models_path, "breast_cancer_model.sav"), 'rb'))

def breast_cancer_menu():

    st.title("Breast Cancer Prediction using ML")
    col1, col2, col3, col4 = st.columns(4)

    with col1:
        radius_mean = st.number_input("Radius Mean", min_value=0.00, value=0.00, step=0.01, format="%.2f")

    with col2:
        perimeter_mean = st.number_input("Perimeter Mean", min_value=0.00, value=0.00, step=0.01, format="%.2f")

    with col3:
        area_mean = st.number_input("Area Mean", min_value=0.00, value=0.00, step=0.01, format="%.2f")

    with col4:
        compactness_mean = st.number_input("Compactness Mean", min_value=0.000000, value=0.00000, step=0.00001, format="%.5f")

    with col1:
        concavity_mean = st.number_input("Concavity Mean", min_value=0.00000, value=0.00000, step=0.00001, format="%.5f")

    with col2:
        concave_points = st.number_input("Concave Points", min_value=0.00000, value=0.00000, step=0.00001, format="%.5f")

    with col3:
        radius_se = st.number_input("Radius SE", min_value=0.00000, value=0.00000, step=0.00001, format="%.5f")

    with col4:
        perimeter_se = st.number_input("Perimeter SE", min_value=0.00000, value=0.00000, step=0.00001, format="%.5f")

    with col1:
        area_se = st.number_input("Area SE", min_value=0.00, value=0.00, step=0.01, format="%.2f")

    with col2:
        radius_worst = st.number_input("Radius Worst", min_value=0.00, value=0.00, step=0.01, format="%.2f")

    with col3:
        perimeter_worst = st.number_input("Perimeter Worst", min_value=0.00, value=0.00, step=0.01, format="%.2f")

    with col4:
        area_worst = st.number_input("Area Worst", min_value=0.00, value=0.00, step=0.01, format="%.2f")

    with col1:
        compactness_worst = st.number_input("Compactness Worst", min_value=0.00000, value=0.00000, step=0.00001, format="%.5f")

    with col2:
        concavity_worst = st.number_input("Concavity Worst", min_value=0.00000, value=0.00000, step=0.00001, format="%.5f")

    with col3:
        concave_points_worst = st.number_input("Concave Points Worst", min_value=0.00000, value=0.00000, step=0.00001, format="%.5f")


    # Combine all the features into a list and then scale them
    data = [[radius_mean, perimeter_mean, area_mean, compactness_mean, concavity_mean, concave_points, radius_se, perimeter_se, area_se, radius_worst, perimeter_worst, area_worst, compactness_worst, concavity_worst, concave_points_worst]]
    df_dummies = pd.DataFrame(data, columns=["radius_mean", "perimeter_mean", "area_mean", "compactness_mean", "concavity_mean", "concave points_mean", "radius_se", "perimeter_se", "area_se", "radius_worst", "perimeter_worst", "area_worst", "compactness_worst", "concavity_worst", "concave points_worst"])
    column_names = df_dummies.columns
    df_dummies[column_names] = scaler.transform(df_dummies[column_names])

    breast_cancer_prediction = ""

    if st.button("Breast Cancer Predict"):
        breast_cancer_prediction = breast_cancer_model.predict(df_dummies[["radius_mean", "perimeter_mean", "area_mean", "compactness_mean", "concavity_mean", "concave points_mean", "radius_se", "perimeter_se", "area_se", "radius_worst", "perimeter_worst", "area_worst", "compactness_worst", "concavity_worst", "concave points_worst"]])
        if breast_cancer_prediction[0] == 1:
            st.error("Person have Breast Cancer")
        else:
            st.success("Person don't have Breast Cancer")