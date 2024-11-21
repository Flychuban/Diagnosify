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

type RawData = {
  type: string;
  file?: string;
};

type PredictInfo = {
  raw_data: RawData;
  prediction: boolean;
  type: string;
};

type PredictionFormProps = {
  predictInfo: Partial<RawData & { isFile: boolean }>;
  type: string;
};

type AllPrediction = {
  type: Disease;
  info: object;
};

const DisplayedPrediction: React.FC<{ predictInfo: PredictInfo }> = ({
  predictInfo,
}) => {
  const [token, setToken] = useState<AuthToken>({} as AuthToken);
  const [isPopup, setIsPopup] = useState(false);
  const [isError, setIsError] = useState(false);
  const [actualStatus, setActualStatus] = useState(false);

  useEffect(() => {
    const tempToken = cookies.token.get();
    if (tempToken === null) {
      throw new Error("no auth token found");
    }
    setToken(tempToken);
  });

  const handleStatusChange = (status: boolean) => {
    setActualStatus(status);
  };

  const sendPrediction = async () => {
    try {
      const res = await api.diagnoses.createDiagnosis(token.userId.toString(), {
        raw_data: { ...predictInfo.raw_data },
        label: predictInfo.prediction,
        type: predictInfo.type,
      });
    } catch (err) {
      setIsError(true);
    }
  };

  if (isError) {
    return <BaseError message="Failed to create new diagnosis" />;
  }

  return (
    <div className="border-spacing-4 border-4 border-amber-500">
      <p>{predictInfo.raw_data.type} prediction</p>
      {predictInfo.raw_data.file && (
        <img src={predictInfo.raw_data.file} alt="Uploaded" />
      )}
      <div>
        <span>
          Send Prediction with accurate label <br />
          Actual diagnosis: {JSON.stringify(actualStatus)}
          <br />
          <button onClick={() => handleStatusChange(false)}>False</button>
          <button onClick={() => handleStatusChange(true)}>True</button>
        </span>
        <button onClick={sendPrediction}>Send</button>
      </div>
      <div className="bg-blue-900">
        Predicted: {JSON.stringify(predictInfo.prediction)}
      </div>
      {isPopup && (
        <SuccesfulPopUp
          succesfulPart="Creating diagnosis"
          timeBeforeExpiration={10000}
        />
      )}
    </div>
  );
};

const PredictionForm: React.FC<PredictionFormProps> = ({ predictInfo, type }) => {
  const [formState, setFormState] = useState<RawData>({
    type: "",
    file: "",
    ...predictInfo,
  });
  const [prediction, setPrediction] = useState<boolean | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [token, setToken] = useState<AuthToken>();

  useEffect(() => {
    const tempToken = cookies.token.get();
    if (tempToken === null) {
      throw new Error("no auth token found");
    }
    setToken(tempToken);
    setFormState({ ...predictInfo });
  }, [predictInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.diagnoses.createDiagnosis(token!.userId.toString(), {
      ...formState,
      type,
    });
    if ("errMsg" in res) {
      throw new Error("req failed");
    } else {
      const parsedRes = res.prediction;
      setPrediction(parsedRes);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const fileToUpload = e.target.files[0];
      setFile(fileToUpload);

      setFormState((prev) => ({
        ...prev,
        file: URL.createObjectURL(fileToUpload),
      }));
    }
  };

  const handleChange = (key: string, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex-1 bg-primary p-5 text-white">
      <h1 className="mb-5 text-3xl font-bold">{type} using ML</h1>
      <div className="rounded bg-[#12141c] p-6">
        <p className="mb-4 text-gray-400">
          This is a example of using a trained ML model to make predictions for {type.toLowerCase()} on images.
        </p>
        <form onSubmit={handleSubmit}>
          {predictInfo.isFile ? (
            <div className="mt-6">
              <div className="relative">
                <div className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-600 bg-[#1a1b1e] p-6">
                  <div className="mb-4 text-gray-400">
                    <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-gray-400">Drag and drop file here</p>
                  <p className="text-xs text-gray-500">(Limit 200MB per file • JPG, JPEG, JFIF, PNG)</p>
                  <input
                    type="file"
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
              </div>
              {formState.file && (
                <div className="mt-4 rounded bg-[#12141c] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">
                      {file?.name || "Uploaded image"}
                    </span>
                    <button 
                      className="text-gray-400 hover:text-gray-300"
                      onClick={() => setFormState(prev => ({ ...prev, file: "" }))}
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <img src={formState.file} alt="Preview" className="mt-4 h-auto w-full rounded" />
                </div>
              )}
            </div>
          ) : (
            <div className="mb-4 grid grid-cols-4 gap-4">
              {Object.keys(formState).map((key) => (
                <InputField
                  key={key}
                  label={key.replace(/_/g, " ").toUpperCase()}
                  value={formState[key as keyof RawData]}
                  onChange={(newValue) => handleChange(key, newValue)}
                />
              ))}
            </div>
          )}
        </form>
      </div>
      {prediction !== null && (
        <DisplayedPrediction
          predictInfo={{
            prediction,
            raw_data: { ...formState },
            type,
          }}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  const { token } = useContext(AuthContext);
  const [current, setCurrent] = useState(0);

  const handleSelectDisease = (selectedDiseaseNumber: number) => {
    if (selectedDiseaseNumber > allPredictions.length) {
      throw new Error("choice shouldnt be higher than number of predictions");
    }
    setCurrent(selectedDiseaseNumber);
  };

  const allPredictions: AllPrediction[] = [
    { type: "cancer Segmentation", info: { isFile: true } },
    { type: "diabetes", info: { glucose: 0, age: 0 } },
    { type: "heart Disease", info: { cholesterol: 0, blood_pressure: 0 } },
    { type: "parkinson", info: { tremor: 0, gait: 0 } },
    { type: "kidney Disease", info: { Albumin: 0 } },
    { type: "breast Cancer", info: { isFile: true } },
    { type: "pneumonia", info: { isFile: true } },
    { type: "malaria", info: { isFile: true } },
    { type: "liver Disease", info: { bilirubin: 0, albumin: 0 } },
    { type: "Body Fat Percentage", info: { weight: 0, height: 0 } },
  ];

  return (
    <div className="flex h-screen w-full bg-primary">
      <div className="w-64 bg-[#12141c] p-4">
        <h3 className="mb-2 px-4 text-sm font-medium text-gray-400">Disease Prediction</h3>
        <p className="mb-4 px-4 text-xs text-gray-500">Select the disease you want to predict</p>
        <div className="space-y-1">
          {allPredictions.map((prediction, index) => (
            <button
              key={prediction.type}
              onClick={() => handleSelectDisease(index)}
              className={`w-full rounded-lg px-4 py-2 text-left text-sm ${
                current === index
                  ? "bg-red-500 text-white"
                  : "text-gray-300 hover:bg-[#1a1b1e]"
              }`}
            >
              {prediction.type}
            </button>
          ))}
        </div>
      </div>
      <PredictionForm
        predictInfo={allPredictions[current].info}
        type={allPredictions[current].type}
      />
    </div>
  );
};

export default App;
