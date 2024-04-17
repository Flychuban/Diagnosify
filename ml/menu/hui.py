from models_export_rerouter import models

req = {
    'pregnancies': 6, # Number of times pregnant
    'glucose': 148, # Plasma glucose concentration in an oral glucose tolerance test
    'blood_pressure': 72, # Diastolic blood pressure (mm Hg)
    'skin_thickness': 35, # Triceps skin fold thickness (mm)
    'insulin': 0, # 2-Hour serum insulin (mu U/ml)
    'bmi': 33.6, # Body mass index (weight in kg/(height in m)^2)
    'diabetes_pedigree_function': 0.627, # Diabetes pedigree function
    'age': 50 # Age (years)
}

predict = ((models["diabetes"](  [ [req['pregnancies'],req['glucose'], req['blood_pressure'], req['skin_thickness'], req['insulin'], req['bmi'], req['diabetes_pedigree_function'], req['age']    ]]) == [1]))[0]

print(predict)
