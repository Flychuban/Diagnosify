# # Import necessary models
# from Pneumonia import pneumonia_model
# from Parkinson import parkinson_model
# from Malaria import malaria_model
# from LiverDisease import liver_disease_model
# from Kidney import kidney_model
# from HeartDisease import heart_disease_model
from Diabetes import diabetes_model
# from CancerSegmentation import model as cancer_segmentation_model
# from BreastCancer import breast_cancer_model
# from BodyFatPercentage import diabetes_model as db

# Define models dictionary
models = {
    # 'pneumonia': pneumonia_model.predict,
    # 'parkinson': parkinson_model.predict,
    # 'malaria': malaria_model.predict,
    # 'liver_disease': liver_disease_model.predict,
    # 'kidney': kidney_model.predict,
    # 'heart_disease': heart_disease_model.predict,
    'diabetes': diabetes_model.predict,
    # 'cancer_segmentation': cancer_segmentation_model.predict,
    # 'breast_cancer': breast_cancer_model.predict
}


(models['diabetes']([[3,20,120,5,50,80,2,20]]))

{
  "data": {
    "pregnancies":2, "glucose":12, "blood_pressure":12, "skin_thickness":12, "insulin":12, "bmi":12, "diabetes_pedigree_function":12, "age":12
  }
}
