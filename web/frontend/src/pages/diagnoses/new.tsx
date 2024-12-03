import React, { useState, useEffect, useContext, ReactNode } from "react";
import { AuthToken, cookies } from "~/utils/cookies";
import { AuthContext } from "~/utils/context";
import { api, getGatewayUrl } from "~/utils/api/api";
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
import { Env } from "~/utils/env";


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
  { key: "Wrist", label: "Wrist" },
   {key: "Age", label: "Age"}
];

const kidneyDiseaseFields = [
  {key:"specific_gravity" , label: "Specific Gravity" },
  { key: "albumin" , label: "Albumin" },
  { key:"serum_creatinine" , label: "Serum Creatinine" },
  { key:  "hemoglobin" , label: "Hemoglobin" },
  { key: "PCV" , label: "PCV" },
  {key: "hypertension" , label: "Hypertension" },
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


const CancerPredictionForm: React.FC = () => {
  return (
    <PredictionForm<{},  {s3_loc: string}
>
      title="Cancer Prediction"
      endpoint="http://127.0.0.1:5000/cancer-segmentation"
      componentToDisplayPrediction={(data) => <div>{data}</div>}
      anotherComponentToDisplayPrediction={(data) => {
        return <div>
          <img src={data.s3_loc} />
          {(JSON.stringify(data))}</div>
      }}

    />
  );
}


async function saveImageDataTextResponse(diseaseEndpoint: string,data: {prediction: string, file: File},directVoteWhichSkipsVoting: boolean | null, vote: boolean) {
  const authToken2 = cookies.token.get()
        if (authToken2 === null) {
          throw new Error("invalid token")
        }

        const formDdata = new FormData()
        formDdata.append("data", data.file)
  const s3uploadData = await axios.post<{ link_to_data_blob_which_holds_prediction_params: string }>(Env.upload_url+"/" + diseaseEndpoint, formDdata, {
    headers: {
            "Authorization": "Bearer " + cookies.token.get()?.userId,
            "authorization": "Bearer " + cookies.token.get()?.userId
          }
        })
        const res = await axios.post<object>(`${getGatewayUrl()}/diag/diag/diagnosis/user/${authToken2.userId}/diagnoses`, {
              newDiagInfo: {
                type: diseaseEndpoint,
                link_raw_data: s3uploadData.data.link_to_data_blob_which_holds_prediction_params,
                label: data.prediction,
                vote: vote
          },
          directVoteWhichSkipsVoting: directVoteWhichSkipsVoting
            }, {
    headers: {
            "Authorization": "Bearer " + cookies.token.get()?.userId,
            "authorization": "Bearer " + cookies.token.get()?.userId
          }
        })
        return res

        // return api.diagnoses.saveImageDataTextResponse(diseaseEndpoint,data)

}

async function textDataTextResponseUpload(diseaseEndpoint: string,data: {responseMsg: {prediction: string}}, vote: boolean, voteWhichSkipsVoting: null | boolean): Promise<object> {
            try {
            const res = await api.diagnoses.saveTextDataTextResponseDiagnosis(diseaseEndpoint, data, vote, voteWhichSkipsVoting)
          
            return res
          } catch (error) { 
              console.error("Error saving prediction:", error);
              return {error: error.message}
          }
}



const PneumoniaPredictionForm: React.FC = () => {
  return (
    <PredictionForm<
      object,
      { prediction: { message: string; confidence: string } }
    >
      title="Pneumonia Prediction"
      endpoint={`${mlPredictionUrl}/predict_pneumonia`}
      componentToDisplayPrediction={(data) => <div>{JSON.stringify(data)}</div>}
      anotherComponentToDisplayPrediction={(data) => {
        console.log("dat", data);
        return <div>{data.prediction.message}</div>;
      }}
      savePrediction={async (data, directVoteWhichSkipsVoting: boolean | null, vote: boolean) => {
        await saveImageDataTextResponse("pneumonia", data, directVoteWhichSkipsVoting ,vote);
        const authToken2 = cookies.token.get();
      }}
    />
  );
};

const MAlari = () => {
  return (
    <PredictionForm<{prediction: {message: string, malaria_probability: string}},{prediction: {message: string, malaria_probability: string}}>
      title="Malaria Prediction"
      endpoint={`${mlPredictionUrl}/predict-malaria`}
      componentToDisplayPrediction={(data: { message: string }) => <div>{data.message}</div>}
      anotherComponentToDisplayPrediction={(data) => { return <div>{ data.prediction.message}</div>}}
      savePrediction={async (data,directVoteWhichSkipsVoting: boolean | null, vote: boolean) => {
        await saveImageDataTextResponse("malaria", data, directVoteWhichSkipsVoting,vote)
      }}
    />
  )
}

const mlPredictionUrl = Env.prediction_service_url

const App = () => {
  const [current, setCurrent] = useState(0);
  const authToken = useGetAuthToken()
  const allPredictions = [
    { type: "Pneumonia", form: () => <PneumoniaPredictionForm /> },
    {
      type: "Diabetes", form: () => <SimplePredictionForm<{prediction: string},{Pregnancies:number, Glucose: number, BloodPRessure: number, SkinThickness: number, Insulin: number, BMI: number, DiabetesPedigreeFunction: number, Age: number}>
        title="Diabetes Prediction"
        endpoint={mlPredictionUrl+"/diabetes"}
        formFields={diabetesFields}
        componentToDisplayPrediction={(data) => { return <div>{ data.prediction }</div> }}
        SavePredictionInDbWithTheS3ReferenceHandler={async (data,vote: boolean,voteWhichSkipsVoting: boolean | null) => {
          // upload to the s3 bucket 
          try {
            
        

            return await textDataTextResponseUpload("diabetes", data, vote, voteWhichSkipsVoting)
          } catch (error) { 
            console.error("Error saving prediction:", error);
            return {data: {error: error.message}, status: 500, statusText: "Error saving prediction" , config: {}, headers: {}} // as axios response
          }
        }}
      />
    },
    {
      type: "Body fat", form: () => <SimplePredictionForm<{prediction: string}, {}>
        title="Body Fat Prediction"
        endpoint={mlPredictionUrl + "/body-fat-predict"}
        formFields={bodyFatFields}
        componentToDisplayPrediction={(data) => { return <div>{data.prediction}</div> }}
        SavePredictionInDbWithTheS3ReferenceHandler={async (data,vote: boolean,voteWhichSkipsVoting: boolean | null) => {
          return await textDataTextResponseUpload(
            "bodyfat",
            data,
            vote,
            voteWhichSkipsVoting,
          );
        }}
      />
    },
    {
      type: "Kidney disease", form: () => <SimplePredictionForm
        title="Kidney Disease Prediction"
        endpoint={mlPredictionUrl+"/kidney-disease-predict"}
        formFields={kidneyDiseaseFields}
        componentToDisplayPrediction={(data) => { return <div>{data.prediction}</div> }}
        SavePredictionInDbWithTheS3ReferenceHandler={async (data,vote: boolean,voteWhichSkipsVoting: boolean | null) => {
          return await textDataTextResponseUpload(
            "kidney-disease",
            data,
            vote,
            voteWhichSkipsVoting,
          );
        }}
      />
    },
    {
      type: "Heart disease",
      form: () => <SimplePredictionForm<{ prediction: string }, { prediction: string }>
        title="Heart Disease Prediction"
        endpoint={mlPredictionUrl + "/heart-disease-predict"}
        formFields={heartDiseaseFields}
        componentToDisplayPrediction={(data) => { return <div>{ data.prediction }</div> }}
        SavePredictionInDbWithTheS3ReferenceHandler={async (data,vote: boolean,voteWhichSkipsVoting: boolean | null) => {
          return await textDataTextResponseUpload(
            "heart-disease",
            data,
            vote,
            voteWhichSkipsVoting,
          );
        }}
      />
    },
    { type: "Malaria", form: () => <MAlari /> },
    {
      type: "Liver Disease",
      form: () => <SimplePredictionForm<{ prediction: string }, { prediction: string }>
        title="Liver Disease"
        endpoint={mlPredictionUrl + "/liver-disease-predict"}
        formFields={ LiverDisease}
        componentToDisplayPrediction={(data) => { return <div>{data.prediction}</div> }}
        SavePredictionInDbWithTheS3ReferenceHandler={async (data,vote: boolean,voteWhichSkipsVoting: boolean | null) => {
           return await textDataTextResponseUpload("liver-disease", data, vote,voteWhichSkipsVoting)
         }}
      />
    },
    {
      type: "Breast Cancer",
      form: () => <SimplePredictionForm<{ prediction: string }, { prediction: string }>
        title="Breast Cancer Prediction"
        endpoint={mlPredictionUrl + "/breast-cancer-predict"}
        formFields={breastCancerFields}
        componentToDisplayPrediction={(data) => { return <div>{data.prediction}</div> }}
        SavePredictionInDbWithTheS3ReferenceHandler={async (data,vote: boolean,voteWhichSkipsVoting: boolean | null) => {
          return await textDataTextResponseUpload(
            "breast-cancer",
            data,
            vote,
            voteWhichSkipsVoting,
          );
        }}
      />
    },

    { type: "Cancer segmentation", form: () => <CancerPredictionForm /> },
    {
      type: "Parkinson",
      form: () => <SimplePredictionForm<{ prediction: string }, { prediction: string }>
        title="Parkinson"
        endpoint={mlPredictionUrl + "/predict_parkinson"}
        formFields={parkinsonFields}
        componentToDisplayPrediction={(data) => { return <div>{data.prediction}</div> }}
        SavePredictionInDbWithTheS3ReferenceHandler={async (data,vote: boolean,voteWhichSkipsVoting: boolean | null) => {
          return await textDataTextResponseUpload("parkinson", data, vote,voteWhichSkipsVoting )
        }}

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
        onSelectDisease={(number) => { handleSelectDisease(number) }}
      />
      <div className="flex-1 overflow-y-auto p-6">
        {allPredictions[current]?.form()}
      </div>
    </div>
  );
};

export default App;
