import React, { useState, useEffect, useContext, ReactNode } from "react";
import { AuthToken, cookies } from "~/utils/cookies";
import { AuthContext } from "~/utils/context";
import { api } from "~/utils/api/api";
import { parseMlResult } from "~/utils/mlResultParser";
import { Reading } from "~/components/reading";
import { BaseError } from "~/components/error";
import { ResponseCodes } from "~/utils/statis_codes";
import { SuccesfulPopUp } from "~/components/popup";
import FileInput from "~/components/FileInput";
import { type Disease } from "~/utils/types";
import { Sidebar } from "~/components/sidebar";
import { Cloud, Upload } from 'lucide-react';
import { InputField } from "~/components/inputField";
import axios from "axios";

interface MainFormProps<T> {
  title: string;
  onSubmit: (formData: any) => Promise<void>;
  children: React.ReactNode;
  isLoading: boolean;
  responseMessage: T | null;
  componentToDisplayPrediction: (data: T) => React.ReactNode;
}

const MainForm = <T,>({
  title,
  onSubmit,
  children,
  isLoading,
  responseMessage,
  componentToDisplayPrediction,
}: MainFormProps<T>) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(e);
  };

  return (
    <div className="p-6 bg-secondary rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {children}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded-md text-white text-lg transition duration-300 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Loading...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};


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

interface PredictionFormWithImageProps<T,RequestResponse> {
  title: string;
  endpoint: string;
  componentToDisplayPrediction?: (data: T) => React.ReactElement;
  anotherComponentToDisplayPrediction: (data: RequestResponse) => React.ReactElement;
}

const PredictionForm = <T extends object,RequestResponse>({
  title,
  endpoint,
  componentToDisplayPrediction,
  anotherComponentToDisplayPrediction
}: PredictionFormWithImageProps<T, RequestResponse>) => {
  const [file, setFile] = useState<File | null>(null);
  const [responseMessage, setResponseMessage] = useState<{
    errMsg?: string;
    predictionData?: T;
  } | null>(null);
  const [diagnosisId, setDignosisId] = useState<number | null>(null); 
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setResponseMessage({ errMsg: "Please select a file." });
      return;
    }

    setIsLoading(true);
    setResponseMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post<{ prediction: T } | {errMsg: string}>(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if ("errMsg" in response.data) {
        setResponseMessage({ errMsg: response.data.errMsg });
        return;
      } else {
        setResponseMessage({ predictionData: response.data });
        console.log("Prediction Response:", response.data);
      }
      } catch (error) {
      if (axios.isAxiosError(error)) {
        setResponseMessage({ errMsg: error.message || "An error occurred." });
      } else {
        setResponseMessage({ errMsg: "Unexpected error occurred." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainForm
      title={title}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      responseMessage={responseMessage}
      componentToDisplayPrediction={
        responseMessage?.predictionData && componentToDisplayPrediction
          ? () => <div></div> 
          : () => <div>hi</div> 
      }
    >
      <div
        className="relative rounded-lg border-2 border-dashed border-gray-300 bg-gray-900 p-6 hover:border-gray-400 transition-colors"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Cloud className="w-12 h-12 text-gray-400" />
          <div className="text-sm text-gray-300">Drag and drop file here</div>
          <div className="flex items-center text-xs text-gray-400">
            <span>Limit 200MB per file · JPG, JPEG, JFIF, PNG</span>
          </div>
          {file && (
            <div className="flex items-center mt-2 text-sm text-green-400">
              <Upload className="w-4 h-4 mr-2" />
              {file.name}
            </div>
          )}
        </div>
        
      </div>
<div>
          <button onClick={async () => {
            const userId = cookies.token.get()
            if (userId === null) {
              throw new Error("user id is not set")
            }
            const data = responseMessage!.predictionData
            if (data === undefined) {
              throw new Error("Prediction data is not set")
            }
            await api.diagnoses.createDiagnosis(userId.userId.toString(),data)}}>publish diagnosis for review</button>
        </div>
      {(responseMessage?.predictionData !== undefined && responseMessage.predictionData !== null && diagnosisId !== null 
      ) && RatePrediction<T>({ predictionData: responseMessage?.predictionData, diagnosisId: diagnosisId })}
      {responseMessage !== null && responseMessage !== undefined && anotherComponentToDisplayPrediction<RequestResponse>(responseMessage.predictionData)}
    </MainForm>
  );
};

const CancerPredictionForm: React.FC = () => {
  return (
    <PredictionForm<{},{}>
      title="Cancer Prediction"
      endpoint="http://127.0.0.1:5000/cancer-segmentation"
      componentToDisplayPrediction={(data) => <div>{data}</div>}
      anotherComponentToDisplayPrediction={(data) => { return <div>{ data}</div>}}
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




interface PredictionFormProps<PredictionResponse,T> {
  title: string;
  endpoint: string;
  formFields: { key: keyof T; label: string; type?: string }[];
  componentToDisplayPrediction: (data: PredictionResponse) => ReactNode
}

const SimplePredictionForm = <PredictionResponse, FormDataStructure extends Record<string, any>>({
  title,
  endpoint,
  formFields,
  componentToDisplayPrediction,
}: PredictionFormProps<PredictionResponse, FormDataStructure>) => {
  const [formData, setFormData] = useState<FormDataStructure>(
    formFields.reduce((acc, field) => {
      acc[field.key] = ""; // Correctly assign an empty string to each field key
      return acc;
    }, {} as FormDataStructure) // Ensure type safety for the accumulator
  );

  const [responseMessage, setResponseMessage] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponseMessage(null);

    try {
      const response = await axios.post<PredictionResponse>(endpoint, formData);
      setResponseMessage(response.data);
    } catch (error) {
      setResponseMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-secondary p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold text-primary">{title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-wrap gap-4">
          {formFields.map(({ key, label, type = "text" }) => (
            <div key={key as string} className="basis-1/3">
              <label
                htmlFor={key as string}
                className="block text-sm font-medium text-primary-dark"
              >
                {label}
              </label>
              <input
                id={key as string}
                name={key as string}
                type={type}
                value={formData[key]}
                onChange={handleInputChange}
                className="w-full rounded border bg-secondary p-2 text-primary-dark"
              />
            </div>
          ))}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded bg-primary p-2 text-white hover:bg-primary-dark disabled:bg-gray-400"
        >
          {isLoading ? "Processing..." : "Predict"}
        </button>
      </form>

      {responseMessage && componentToDisplayPrediction(responseMessage)}
    </div>
  );
};



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
 

// Updated App component to include all forms
const App = () => {
  const [current, setCurrent] = useState(0);

  const allPredictions = [
    { type: "Cancer segmentation", form: () => <CancerPredictionForm /> },
    { type: "Pneumonia", form: () => <PneumoniaPredictionForm /> },
    {
      type: "Diabetes", form: () => <SimplePredictionForm<{prediction: string},{Pregnancies:number, Glucose: number, BloodPRessure: number, SkinThickness: number, Insulin: number, BMI: number, DiabetesPedigreeFunction: number, Age: number}>
        title="Diabetes Prediction"
        endpoint="http://127.0.0.1:5000/diabetes"
      formFields={diabetesFields}
      componentToDisplayPrediction={(data) => {return <div>{data.prediction}</div>}}
      /> },
    {
      type: "Body fat", form: () => <SimplePredictionForm<{prediction: string}, {}>
        title="Body Fat Prediction"
        endpoint="http://127.0.0.1:5000/body-fat-predict"
        formFields={bodyFatFields}
        componentToDisplayPrediction={(data) => {return <div>{data.prediction}</div>}}
 /> },
    { type: "Kidney disease", form: () => <SimplePredictionForm
        title="Kidney Disease Prediction"
        endpoint="http://127.0.0.1:5000/kidney-disease-predict"
        formFields={kidneyDiseaseFields}
        componentToDisplayPrediction={(data) => {return <div>{data.prediction}</div>}}
      /> },
    {
      type: "Heart disease",
      form: () => <SimplePredictionForm<{ prediction: string }, { prediction: string }>
        title="Heart Disease Prediction"
        endpoint="http://127.0.0.1:5000/heart-disease-predict"
        formFields={heartDiseaseFields}
        componentToDisplayPrediction={(data) => { return <div>{ data.prediction }</div> }}
      /> },
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
