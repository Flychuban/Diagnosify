# # Import necessary models
from Pneumonia import pneumonia_model
from Parkinson import parkinson_model, parkinson_scaler
from Malaria import malaria_model
from LiverDisease import liver_disease_model
from Kidney import kidney_model, kidney_scaler
from HeartDisease import heart_disease_model
from Diabetes import diabetes_model, diabetes_scaler
from CancerSegmentation import cancer_segmentation_model
from BreastCancer import breast_cancer_model, breast_cancer_scaler
from BodyFatPercentage import body_fat_percentage_model, body_fat_percentage_scaler

# Define models dictionary
models = {
  'body_fat_percentage': body_fat_percentage_model.predict,
  'body_fat_percentage_scaler': body_fat_percentage_scaler.transform,
  'pneumonia': pneumonia_model.predict,
  'parkinson': parkinson_model.predict,
  'parkinson_scaler': parkinson_scaler.transform,
  'malaria': malaria_model.predict,
  'liver_disease': liver_disease_model.predict,
  'kidney': kidney_model.predict,
  'kidney_scaler': kidney_scaler.transform,
  'heart_disease': heart_disease_model.predict,
  'diabetes': diabetes_model.predict,
  'diabetes_scaler': diabetes_scaler.transform, 
  'cancer_segmentation': cancer_segmentation_model.predict,
  'breast_cancer': breast_cancer_model.predict,
  'breast_cancer_scaler': breast_cancer_scaler.transform
}
