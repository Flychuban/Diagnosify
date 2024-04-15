// pages/index.js

import React, { useState, useEffect, useContext } from "react";
import { cookies } from "~/utils/cookies";
import { AuthContext } from "~/utils/context";
import { Api } from "~/utils/api";
import { parseMlResult } from "~/utils/mlResultParser";
import { Reading } from "~/components/reading";
import { BaseError } from "~/components/error";
import { ResponseCodes } from "~/utils/statis_codes";
import { SuccesfulPopUp } from "~/components/popup";
import FileInput from "~/components/FileInput";

type Disease =
  | "heart Disease"
  | "parkinson"
  | "kidney Disease"
  | "breast Cancer"
  | "cancer Segmentation"
  | "diabetes"
  | "pneumonia";

const Sidebar: React.FC<{
  onSelectDisease: (disease: number) => void;
  options: Disease[];
  selected_option_index: number;
}> = ({ onSelectDisease, options, selected_option_index }) => {
  return (
    <div className="flex w-64 flex-col items-center justify-center space-y-3 bg-secondary text-white">
      <div className="a justify- flex flex-col justify-center text-center align-middle">
        <h1 className="text-center">Disease prediction</h1>
        <div className="flex  flex-col items-center bg-primary py-3">
          <h2 className="mb-6 text-xl font-bold">Select Disease</h2>
          <hr className="my-4 border-gray-300" />
          {options.map((option, index) => (
            <div
              key={index}
              className="flex w-[12rem] flex-col items-center bg-primary py-3"
            >
              <button
                className={`${
                  selected_option_index === index
                    ? "bg-red-700"
                    : "bg-transparent"
                } mb-2 w-32 rounded px-4 py-2 text-white`}
                onClick={() => onSelectDisease(index)}
              >
                {option}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const InputField: React.FC<{
  label: string;
  value: number | File | null;
  onChange: (value: number | File | null) => void;
}> = ({ label, value, onChange }) => {
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(+e.target.value);
  };

  return (
    <div className="my-4">
      <div>
        <label className="mb-2 block">{label}:</label>
      </div>
      <div>
        {!(typeof value === "number") ? (
          <FileInput value={value} onChange={onChange} />
        ) : (
          <input
            className="w-32 rounded border border-secondary bg-secondary p-2"
            type="number"
            value={value}
            onChange={handleNumberChange}
          />
        )}
      </div>
    </div>
  );
};

const DisplayedPrediction: React.FC<{
  predictInfo: {
    raw_data: { type: string; file: string }; // Add 'file' property to raw_data
    prediction: boolean;
    type: string;
  };
}> = ({ predictInfo }) => {
  const { token } = useContext(AuthContext);
  const [isPopup, setIsPopup] = useState(false);
  const [isError, setIsError] = useState(false);
  const [actualStatus, setActualStatus] = useState(false);

  const handleStatusChange = (status: boolean) => {
    setActualStatus(status);
  };

  const sendPrediction = async () => {
    try {
      const res = await Api.createDiagnosis(token?.id, {
        raw_data: { ...predictInfo.raw_data },
        label: predictInfo.prediction,
        type: predictInfo.type,
        verified_prediction_status: actualStatus,
      });
      if (
        res.status >= ResponseCodes.OK_WITH_RESPONSE &&
        res.status < ResponseCodes.NOT_FOUND
      ) {
        setIsPopup(true);
      }
    } catch (err) {
      setIsError(true);
    }
  };

  if (isError) {
    return <BaseError message={"Failed to create new diagnosis"} />;
  }

  return (
    <div className="border-spacing-4 border-4 border-amber-500">
      <p>{predictInfo.raw_data.type} prediction</p>
      <img src={predictInfo.raw_data.file} alt="Uploaded" />{" "}
      {/* Display uploaded image */}
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
      <button onClick={sendPrediction}>
        Send Prediction to feed if unsure about accuracy
      </button>
      {isPopup && (
        <SuccesfulPopUp
          succesfulPart="Creating diagnosis"
          timeBeforeExpiration={10000}
        />
      )}
    </div>
  );
};

const PredictionForm: React.FC<{ predictInfo: object; type: string }> = ({
  predictInfo,
  type,
}) => {
  const [formState, setFormState] = useState<{ [key: string]: string }>({});
  const [prediction, setPrediction] = useState<boolean | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setFormState({ ...predictInfo });
  }, [predictInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission:", formState);
    let formDataToSend = formState;
    if (file) {
      formDataToSend = new FormData();
      formDataToSend.append("file", file);
    }
    console.log(formDataToSend);
    const res = await Api.sendDiagnose({ data: formDataToSend, type });
    const parsedRes = parseMlResult(res.data.body);
    console.log("jijibiji", parsedRes);
    setPrediction(parsedRes);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setFormState((prev) => ({
        ...prev,
        file: URL.createObjectURL(e.target.files[0]),
      }));
    }
  };

  const handleChange = (key: string, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex-1 bg-primary p-5 text-white">
      <h1 className="mb-5 text-3xl font-bold">{type} Prediction using ML</h1>
      <form onSubmit={handleSubmit}>
        <div className=" mb-4 grid grid-cols-4 gap-4">
          {predictInfo.isFile ? (
            <div>
              <label htmlFor="fileInput">Upload Image:</label>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            Object.keys(formState).map((key) => (
              <InputField
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                value={formState[key]}
                onChange={(newValue) => handleChange(key, newValue)}
              />
            ))
          )}

          <button type="submit" className="rounded bg-blue-600 px-4 py-2">
            Predict
          </button>
        </div>
      </form>
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
  const [current, setCurrent] = useState<number>(0);

  const handleSelectDisease = (disease: number) => {
    setCurrent(disease);
  };

  const allPredictions: { type: Disease; info: object }[] = [
    {
      type: "diabetes",
      info: {
        glucose: 0,
        age: 0,
        pregnancies: 0,
        bmi: 0,
        skin_thickness: 0,
        insulin: 0,
        blood_pressure: 0,
        diabetes_pedigree_function: 0,
      },
    },
    {
      type: "pneumonia",
      info: {
        isFile: true,
      },
    },
  ];

  const currentPrediction = allPredictions[current];
  const predictInfo = currentPrediction ? currentPrediction.info : {};

  useEffect(() => {
    cookies, [];
  }, []);

  return (
    <div className="flex h-[100vh] w-full">
      <Sidebar
        onSelectDisease={handleSelectDisease}
        options={allPredictions.map((prediction) => prediction.type)}
        selected_option_index={current}
      />
      <PredictionForm
        predictInfo={{ ...predictInfo }}
        type={allPredictions[current].type}
      />
    </div>
  );
};

export default App;
