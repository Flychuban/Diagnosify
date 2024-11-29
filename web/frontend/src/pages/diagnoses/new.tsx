import React, { useState, useEffect, useContext, ReactNode } from "react";
import { AuthToken, cookies } from "~/utils/cookies";
import { AuthContext } from "~/utils/context";
import { api } from "~/utils/api/api";
import { parseMlResult } from "~/utils/mlResultParser";
import { Reading } from "~/components/reading";
import { BaseError } from "~/components/error";
import { ResponseCodes } from "~/utils/statis_codes";
import { PopUpWrapper, SuccesfulPopUp } from "~/components/popup";
import FileInput from "~/components/FileInput";
import { type Disease } from "~/utils/types";
import { Sidebar } from "~/components/sidebar";
import { Cloud, Upload } from 'lucide-react';
import { InputField } from "~/components/inputField";
import axios from "axios";
import { SimplePredictionForm } from "~/components/newDiagnosisPAgeComponents/baseComponents/SimplePrediction";
import { useGetAuthToken } from "~/hooks/cookieGetter";
import { PredictionForm } from "~/components/universal_components/PredictionForm";


const RatePrediction = <T,>({ predictionData, diagnosisId }: { predictionData: T, diagnosisId: number }) => { 
  const [reequestRespones, setRequestResponse] = useState<{ wasVotingSuccessful: boolean }>() 
 
 
  const vote = async (vote: boolean) => {
      const res = await api.diagnoses.votings.vote(diagnosisId,cookies.token.get()!.userId,vote)
  }

  return <div>
  <p>What do you think about this prediction</p>
    <p>Its</p>
    <div className="flex flex-auto"><button onClick={async () => {await vote(false)}}>True</button><button onClick={async() => {await vote(false)}}>False</button></div>

</div>
}


const CancerPredictionForm: React.FC = () => {
  return (
    <PredictionForm<{},{}>
      title="Cancer Prediction"
      endpoint="http://127.0.0.1:5000/cancer-segmentation"
      componentToDisplayPrediction={(data) => <div>{data}</div>}
      anotherComponentToDisplayPrediction={(data) => { return <div>{data}</div> }}

    />
  );
}

const PneumoniaPredictionForm = () => {
  return (
    <PredictionForm<{}, {prediction: { message: string, confidence: string}}>
      title="Pneumonia Prediction"
      endpoint="http://127.0.0.1:5000/predict_pneumonia"
      componentToDisplayPrediction={(data) => <div>{data}</div>}
      anotherComponentToDisplayPrediction={(data) => { console.log("dat",data); return <div>{ data.prediction.message}</div>}}
    />
  );
};

const MAlari = () => {
  return (
    <PredictionForm<{prediction: {message: string, malaria_probability: string}},{prediction: {message: string, malaria_probability: string}}>
      title="Malaria Prediction"
      endpoint="http://127.0.0.1:5000/predict-malaria"
      componentToDisplayPrediction={(data: { message: string }) => <div>{data.message}</div>}
      anotherComponentToDisplayPrediction={(data) => { return <div>{ data.prediction.message}</div>}}
    />
  )
}

enum requestCompletionStatus{
  OK,
  ERRORED
}

async function saveTextDataTextPrediction(data: object, disease: Disease): Promise<{ status: requestCompletionStatus, err: string | null }>
{
  const res = await axios.post<{ status: requestCompletionStatus, err: string | null }>(`http://localhost:4001/data/${disease}`,data)
  return res.data
}


const bodyFatFields = [
     { key: "Weight" , label: "Weight" },
   { key: "Height"  , label: "Height" },
      {key: "Neck" , label: "Neck" },
    {key: "Chest"  ,label: "Chest" },
   {key: "Abdomen" , label: "Abdomen" },
     {key: "Hip" , label: "Hip" },
    {key: "Thigh" , label: "Thigh" },
   {key: "Knee" , label: "Knee" },
    {key: "Ankle" , label: "Ankle" },
  { key: "Biceps" , label: "Biceps" },
  { key: "Forearm" , label: "Forearm" },
   {key: "Wrist" , label: "Wrist" },
];

const kidneyDiseaseFields = [
  {key:"specific_gravity" , label: "Specific Gravity" },
  { key: "albumin" , label: "Albumin" },
  { key:"serum_creatinine" , label: "Serum Creatinine" },
  { key:  "hemoglobin" , label: "Hemoglobin" },
  { key: "PCV" , label: "PCV" },
  {key: " hypertension" , label: "Hypertension" },
];

const heartDiseaseFields = [
    { key: "age" , label: "Age" },
   { key: "gender" , label: "Gender", type: "text" },
  {key:  "chest_pain" , label: "Chest Pain" },
  { key: "tresbps" , label: "Resting Blood Pressure" },
  { key:  "cholesterol" , label: "Cholesterol" },
    { key: "fbs" , label: "Fasting Blood Sugar" },
  { key: "restecg" , label: "Rest ECG" },
  { key: "thalach" , label: "Maximum Heart Rate" },
   {  key: "exang" , label: "Exercise Induced Angina" },
  { key: "oldpeak" , label: "Oldpeak" },
   {  key: "slope" , label: "Slope" },
    { key: "ca" , label: "Number of Major Vessels" },
   {  key: "thal" , label: "Thal" },
];

const breastCancerFields = [
  { key: "radius_mean", label : "radius_mean" },
  { key: "perimeter_mean",    label : "perimeter_mean" },
  { key: "area_mean", label : "area_mean" },
  { key: "compactness_mean",  label : "compactness_mean" },
  { key: "concavity_mean", label : "concavity_mean" },
  { key: "concave_points", label : "concave_points" },
  { key: "radius_se", label : "radius_se" },
  { key: "perimeter_se", label : "perimeter_se" },
  { key: "area_se", label : "area_se" },
  { key: "radius_worst", label : "radius_worst" },
  { key: "perimeter_worst", label : "perimeter_worst" },
  { key: "area_worst", label : "area_worst" },
  { key: "compactness_worst",  label : "compactness_worst" },
  { key: "concavity_worst", label : "concavity_worst" },
  { key: "concave_points_worst",  label : "concave_points_worst" }
];

const diabetesFields = [
  { key: "Pregnancies", label: "Pregnancies" },
  { key: "Glucose", label: "Glucose" },
  { key: "BloodPressure", label: "Blood Pressure" },
  { key: "SkinThickness", label: "Skin Thickness" },
  { key: "Insulin", label: "Insulin" },
  { key: "BMI", label: "BMI" },
  { key: "DiabetesPedigreeFunction", label: "Diabetes Pedigree Function" },
  { key: "Age", label: "Age" }
];

const parkinsonFields = [
  { key: "MDVP_Jitter_percent", label: "MDVP Jitter (%)" },
  { key: "MDVP_Jitter_abs", label: "MDVP Jitter (Abs)" },
  { key: "MDVP_RAP", label: "MDVP RAP" },
  { key: "MDVP_PPQ", label: "MDVP PPQ" },
  { key: "Jitter_DDP", label: "Jitter DDP" },
  { key: "MDVP_Shimmer", label: "MDVP Shimmer" },
  { key: "MDVP_Shimmer_dB", label: "MDVP Shimmer (dB)" },
  { key: "Shimmer_APQ3", label: "Shimmer APQ3" },
  { key: "Shimmer_APQ5", label: "Shimmer APQ5" },
  { key: "MDVP_APQ", label: "MDVP APQ" },
  { key: "Shimmer_dda", label: "Shimmer DDA" },
  { key: "NHR", label: "NHR" },
  { key: "HNR", label: "HNR" },
  { key: "RPDE", label: "RPDE" },
  { key: "DFA", label: "DFA" },
  { key: "PPE", label: "PPE" }
];

const LiverDisease = [
  
  { key: "age", label: "Age" },
  { key: "gender", label: "Gender" },
  { key: "total_bilirubin", label: "Total Bilirubin" },
  { key: "direct_bilirubin", label: "Direct Bilirubin" },
  { key: "alkaline_phosphotase", label: "Alkaline Phosphotase" },
  { key: "alamine_aminotransferase", label: "Alamine Aminotransferase" },
  { key: "aspartate_aminotransferase", label: "Aspartate Aminotransferase" },
  { key: "total_protiens", label: "Total Proteins" },
  { key: "albumin", label: "Albumin" },
  { key: "ag_ratio", label: "A/G Ratio" }
];


const App = () => {
  const [current, setCurrent] = useState(0);
  const authToken = useGetAuthToken()
  const allPredictions = [
    { type: "Cancer segmentation", form: () => <CancerPredictionForm /> },
    { type: "Pneumonia", form: () => <PneumoniaPredictionForm /> },
    {
      type: "Diabetes", form: () => <SimplePredictionForm<{prediction: string},{Pregnancies:number, Glucose: number, BloodPRessure: number, SkinThickness: number, Insulin: number, BMI: number, DiabetesPedigreeFunction: number, Age: number}>
        title="Diabetes Prediction"
        endpoint="http://127.0.0.1:5000/diabetes"
        formFields={diabetesFields}
        componentToDisplayPrediction={(data) => { return <div>{ data.prediction }</div> }}
        SavePredictionInDbWithTheS3ReferenceHandler={async (data) => {
          // upload to the s3 bucket 
          const s3 = (await axios.post<{link_to_data_blob_which_holds_prediction_params:string}>("http://localhost:4001/data/diabetes", data)).data

          // save the data with the s3 link
          if (authToken === null) {
            throw new Error("Unauthorized: No token found")
          }
          const res = await axios.post<object>(`http://localhost:3003/diag/diagnoses/user/${authToken?.userId}/diagnoses`, {
            NewDiagnosisInfo: {
              type: allPredictions[current]?.type,
              link_raw_data: s3.link_to_data_blob_which_holds_prediction_params,
              label: data.responseMsg.prediction,
              vote: false
            }
          }) 
          
          return res
          
        }}
      />
    },
    {
      type: "Body fat", form: () => <SimplePredictionForm<{prediction: string}, {}>
        title="Body Fat Prediction"
        endpoint="http://127.0.0.1:5000/body-fat-predict"
        formFields={bodyFatFields}
        componentToDisplayPrediction={(data) => {return <div>{data.prediction}</div>}}
      />
    },
    {
      type: "Kidney disease", form: () => <SimplePredictionForm
        title="Kidney Disease Prediction"
        endpoint="http://127.0.0.1:5000/kidney-disease-predict"
        formFields={kidneyDiseaseFields}
        componentToDisplayPrediction={(data) => {return <div>{data.prediction}</div>}}
      />
    },
    {
      type: "Heart disease",
      form: () => <SimplePredictionForm<{ prediction: string }, { prediction: string }>
        title="Heart Disease Prediction"
        endpoint="http://127.0.0.1:5000/heart-disease-predict"
        formFields={heartDiseaseFields}
        componentToDisplayPrediction={(data) => { return <div>{ data.prediction }</div> }}
      />
    },
    { type: "Malaria", form: () => <MAlari /> },
    {
      type: "Liver Disease",
      form: () => <SimplePredictionForm<{ prediction: string }, { prediction: string }>
        title="Liver Disease"
        endpoint="http://127.0.0.1:5000/liver-disease-predict"
        formFields={ LiverDisease}
        componentToDisplayPrediction={(data) => { return <div>{data.prediction}</div> }}
         />
    },
    {
      type: "Breast Cancer",
      form: () => <SimplePredictionForm<{ prediction: string }, { prediction: string }>
        title="Breast Cancer Prediction"
        endpoint="http://127.0.0.1:5000/breast-cancer-predict"
        formFields={breastCancerFields}
        componentToDisplayPrediction={(data) => { return <div>{data.prediction}</div> }}
      />
    },
    {
      type: "Parkinson",
      form: () => <SimplePredictionForm<{ prediction: string }, { prediction: string }>
        title="Parkinson"
        endpoint="http://127.0.0.1:5000/predict_parkinson"
        formFields={parkinsonFields}
        componentToDisplayPrediction={(data) => { return <div>{data.prediction}</div> }}
      />
    }
  ];

  const handleSelectDisease = (selectedDiseaseNumber:number) => {
    if (selectedDiseaseNumber >= allPredictions.length) {
      throw new Error("Choice shouldn't be higher than number of predictions");
    }
    setCurrent(selectedDiseaseNumber);
  };

  return (
    <div className="flex h-screen w-full bg-primary text-blue-50">
      <Sidebar
        options={allPredictions.map((pred) => pred.type)}
        selected_option_index={current}
        onSelectDisease={handleSelectDisease}
      />
      <div className="flex-1 overflow-y-auto p-6">
        {allPredictions[current]?.form()}
      </div>
    </div>
  );
};

export default App;
