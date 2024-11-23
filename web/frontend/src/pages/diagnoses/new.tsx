import React, { useState, useEffect, useContext } from "react";
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
import { InputField } from "~/components/inputField";
import axios from "axios";
// Reusable MainForm Component
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div>
      <h1>{title}</h1>
      <form onSubmit={handleSubmit}>
        {children}
        <div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </div>
      </form>

      {responseMessage && (
        <div>
          <h3>Prediction:</h3>
          {componentToDisplayPrediction(responseMessage)}
        </div>
      )}
    </div>
  );
};
// Body Fat Prediction Form
const BodyFatPredictionForm = () => {
  const [formData, setFormData] = useState({
    Age: "",
    Weight: "",
    Height: "",
    Neck: "",
    Chest: "",
    Abdomen: "",
    Hip: "",
    Thigh: "",
    Knee: "",
    Ankle: "",
    Biceps: "",
    Forearm: "",
    Wrist: "",
  });
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/body-fat-predict",
        formData,
      );
      setResult(response.data);
    } catch (error) {
      setResult({ error: error.response?.data?.error || "An error occurred" });
    }
    setIsLoading(false);
  };

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">
        Body Fat Percentage Prediction
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((field) => (
          <div key={field} className="flex flex-col">
            <label className="mb-1 text-sm font-medium">{field}</label>
            <input
              type="number"
              step="0.01"
              className="rounded border p-2"
              value={formData[field]}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, [field]: e.target.value }))
              }
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? "Processing..." : "Predict"}
        </button>
      </form>
      {result && (
        <div className="mt-6 rounded bg-gray-50 p-4">
          {result.error ? (
            <p className="text-red-500">{result.error}</p>
          ) : (
            <p className="text-lg font-semibold">
              Body Fat Percentage: {result["Body Fat Percentage"]}%
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Kidney Disease Prediction Form
const KidneyDiseasePredictionForm = () => {
  const [formData, setFormData] = useState({
    specific_gravity: "",
    albumin: "",
    serum_creatinine: "",
    hemoglobin: "",
    PCV: "",
    hypertension: "",
  });
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/kidney-disease-predict",
        formData,
      );
      setResult(response.data);
    } catch (error) {
      setResult({ error: error.response?.data?.error || "An error occurred" });
    }
    setIsLoading(false);
  };

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">Kidney Disease Prediction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <label className="mb-1 text-sm font-medium">
              {key
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </label>
            <input
              type="number"
              step="0.01"
              className="rounded border p-2"
              value={value}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, [key]: e.target.value }))
              }
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? "Processing..." : "Predict"}
        </button>
      </form>
      {result && (
        <div className="mt-6 rounded bg-gray-50 p-4">
          {result.error ? (
            <p className="text-red-500">{result.error}</p>
          ) : (
            <p className="text-lg font-semibold">{result.prediction}</p>
          )}
        </div>
      )}
    </div>
  );
};

// Heart Disease Prediction Form
const HeartDiseasePredictionForm = () => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "Male",
    chest_pain: "",
    tresbps: "",
    cholesterol: "",
    fbs: "",
    restecg: "",
    thalach: "",
    exang: "",
    oldpeak: "",
    slope: "",
    ca: "",
    thal: "",
  });
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/heart-disease-predict",
        formData,
      );
      setResult(response.data);
    } catch (error) {
      setResult({ error: error.response?.data?.error || "An error occurred" });
    }
    setIsLoading(false);
  };

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">Heart Disease Prediction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Gender</label>
          <select
            className="rounded border p-2"
            value={formData.gender}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, gender: e.target.value }))
            }
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        {Object.entries(formData).map(
          ([key, value]) =>
            key !== "gender" && (
              <div key={key} className="flex flex-col">
                <label className="mb-1 text-sm font-medium">
                  {key
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="rounded border p-2"
                  value={value}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                />
              </div>
            ),
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? "Processing..." : "Predict"}
        </button>
      </form>
      {result && (
        <div className="mt-6 rounded bg-gray-50 p-4">
          {result.error ? (
            <p className="text-red-500">{result.error}</p>
          ) : (
            <p className="text-lg font-semibold">{result.prediction}</p>
          )}
        </div>
      )}
    </div>
  );
};

// Malaria Prediction Form
const MalariaPredictionForm = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setResult({ error: "Please select an image file" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/predict-malaria",
        formData,
      );
      setResult(response.data);
    } catch (error) {
      setResult({ error: error.response?.data?.error || "An error occurred" });
    }
    setIsLoading(false);
  };

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">Malaria Detection</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="rounded border p-2"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? "Processing..." : "Detect"}
        </button>
      </form>
      {result && (
        <div className="mt-6 rounded bg-gray-50 p-4">
          {result.error ? (
            <p className="text-red-500">{result.error}</p>
          ) : (
            <div>
              <p className="text-lg font-semibold">{result.message}</p>
              <p className="text-md">
                Probability: {result.malaria_probability}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
const DiabetesPrediction: React.FC = () => {
  const [formData, setFormData] = useState({
    Pregnancies: "",
    Glucose: "",
    BloodPressure: "",
    SkinThickness: "",
    Insulin: "",
    BMI: "",
    DiabetesPedigreeFunction: "",
    Age: "",
  });
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    const requiredFields = [
      "Pregnancies",
      "Glucose",
      "BloodPressure",
      "SkinThickness",
      "Insulin",
      "BMI",
      "DiabetesPedigreeFunction",
      "Age",
    ];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setResponseMessage(`Error: ${field} is required.`);
        return;
      }
    }

    setIsLoading(true);
    setResponseMessage(null);

    try {
      const response = await axios.post<{ prediction: string }>(
        "http://127.0.0.1:5000/diabetes",
        formData,
        { headers: { "Content-Type": "application/json" } },
      );
      setResponseMessage(response.data.prediction || "Unknown response");
      console.log("Prediction Response:", response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setResponseMessage(
          `Error: ${error.response?.data?.error || error.message}`,
        );
      } else {
        setResponseMessage("Unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainForm
      title="Diabetes Prediction"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      responseMessage={responseMessage}
      componentToDisplayPrediction={(data) => <div>{JSON.stringify(data)}</div>}
    >
      {Object.keys(formData).map((field) => (
        <div key={field}>
          <label htmlFor={field}>
            {field}:{" "}
            <input
              type="text"
              id={field}
              name={field}
              value={formData[field as keyof typeof formData]}
              onChange={handleChange}
            />
          </label>
        </div>
      ))}
    </MainForm>
  );
};

interface PredictionFormWithImageProps {
  title: string;
  endpoint: string;
  componentToDisplayPrediction?: (data: string) => React.ReactElement;
}
const PredictionForm: React.FC<PredictionFormWithImageProps> = ({
  title,
  endpoint,
  componentToDisplayPrediction,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [responseMessage, setResponseMessage] = useState<{
    errMsg: string;
    [key: string]: any;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
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
      const response = await axios.post<{
        prediction: { confidence: string; message: string };
      }>(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResponseMessage(response.data.prediction || "Unknown response");
      console.log("Prediction Response:", response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setResponseMessage(error.response?.data);
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
      componentToDisplayPrediction={componentToDisplayPrediction}
    >
      <div>
        <label
          htmlFor="fileInput"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Select Image (PNG/JPG/JPEG):
        </label>
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full rounded border border-gray-300 p-2"
        />
      </div>
    </MainForm>
  );
};

const CancerPredictionForm: React.FC = () => {
  return (
    <PredictionForm
      title="Cancer Prediction"
      endpoint="http://127.0.0.1:5000/cancer-segmentation"
      componentToDisplayPrediction={(data) => <div>{data}</div>}
    />
  );
};

const PneumoniaPredictionForm: React.FC = () => {
  return (
    <PredictionForm
      title="Pneumonia Prediction"
      endpoint="http://127.0.0.1:5000/predict_pneumonia"
      componentToDisplayPrediction={(data) => <div>{data}</div>}
    />
  );
};

// Updated App component to include all forms
const App = () => {
  const [current, setCurrent] = useState(0);

  const allPredictions = [
    { type: "pneumonia", form: () => <PneumoniaPredictionForm /> },
    { type: "diabetes", form: () => <DiabetesPrediction /> },
    { type: "cancer segmentation", form: () => <CancerPredictionForm /> },
    { type: "body fat", form: () => <BodyFatPredictionForm /> },
    { type: "kidney disease", form: () => <KidneyDiseasePredictionForm /> },
    { type: "heart disease", form: () => <HeartDiseasePredictionForm /> },
    { type: "malaria", form: () => <MalariaPredictionForm /> },
  ];

  const handleSelectDisease = (selectedDiseaseNumber) => {
    if (selectedDiseaseNumber >= allPredictions.length) {
      throw new Error("Choice shouldn't be higher than number of predictions");
    }
    setCurrent(selectedDiseaseNumber);
  };

  return (
    <div className="flex h-screen w-full bg-gray-100">
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
