import React, { useState, useEffect, useContext } from "react";
import { cookies } from "~/utils/cookies";
import { AuthContext } from "~/utils/context";
import { Api } from "~/utils/api";
import { parseMlResult } from "~/utils/mlResultParser";
import { Reading } from "~/components/reading";
import { BaseError } from "~/components/error";
import { ResponseCodes, SimplifiedResponseCodes } from "~/utils/statis_codes";
import { PopUp, SuccesfulPopUp } from "~/components/popup";
type Disease =
  | "heart Disease"
  | "parkinson"
  | "kidney Disease"
  | "breast Cancer"
  | "cancer Segmentation"
  | "diabetes"
  | "pneumonia";

interface InputFieldProps {
  label: string;
  value: number | File | null; // Update value type to allow File object
  onChange: (value: number | File | null) => void;
}

function displayFields(formState, handleChange) {
  return Object.keys(formState).map((key) => (
    <InputField
      key={key}
      label={key.charAt(0) + key.slice(1)}
      value={formState[key]}
      onChange={(newValue) => handleChange(key, newValue)}
    />
  ));
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(e.target.files[0]); // Store the selected file
    }
  };

  return (
    <div className="my-4 flex items-center">
      <label className="mr-3 w-32">{label}:</label>
      {typeof value === "number" ? (
        <input
          className="mx-3 w-20 border-2 border-gray-200 p-1 text-center"
          type="number"
          value={value}
          onChange={(e) => onChange(+e.target.value)}
        />
      ) : (
        <input
          className="mx-3 w-20 border-2 border-gray-200 p-1 text-center"
          type="file"
          onChange={handleFileChange} // Handle file selection
        />
      )}
    </div>
  );
};

const Sidebar: React.FC<{
  onSelectDisease: (disease: number) => void;
  options: Disease[];
  selected_option_index: number;
}> = ({ onSelectDisease, options, selected_option_index }) => {
  return (
    <div className="space-y-3 bg-gray-800 p-5 text-white">
      <h2 className="mb-3 text-lg font-bold">Select Disease</h2>
      {options.map((option, index) => (
        <div key={index}>
          <button
            className={
              selected_option_index === index ? "bg-blue-400" : "bg-red-700"
            }
            onClick={() => {
              onSelectDisease(index);
            }}
          >
            {option}
          </button>
        </div>
      ))}
    </div>
  );
};

const DisplayedPrediction: React.FC<{
  predictInfo: {
    raw_data: { type: string };
    prediction: boolean;
    type: string;
  };
}> = ({ predictInfo }) => {
  const { token } = useContext(AuthContext);
  const [isPopup, setIsPopup] = useState(false);
  const [isError, setIsError] = useState(false);
  const [actualStatus, setActualStatus] = useState(false);
  if (isError) {
    return <BaseError message={"failed tpo create new diagnosis"} />;
  }
  return (
    <div className="border-spacing-4 border-4 border-amber-500">
      <p>{predictInfo.raw_data.type} prediction</p>
      <Reading
        rawData={predictInfo.raw_data}
        prediction={predictInfo.prediction}
        type={predictInfo.type}
      />
      <div>
        <span>
          Send Prediction with aqurate label{" "}
          <br color={"a bit bad practice to use br"} />
          Actual diagnosis: {JSON.stringify(actualStatus)}
          <br />
          <button
            onClick={() => {
              setActualStatus(false);
            }}
          >
            False
          </button>
          <button
            onClick={() => {
              setActualStatus(true);
            }}
          >
            True
          </button>
        </span>
        <button
          onClick={async () => {
            console.log("hi", {});
            try {
              const res = await Api.createDiagnosis(token?.id, {
                raw_data: { ...predictInfo.raw_data },
                label: predictInfo.prediction,
                type: predictInfo.type,
                verified_prediction_status: actualStatus,
              });
              console.log("hihi-------hihi", res);
              if (
                res.status >= ResponseCodes.OK_WITH_RESPONSE &&
                res.status < ResponseCodes.NOT_FOUND
              ) {
                console.log("koooor");

                setIsPopup(true);
              }
            } catch (err) {
              setIsError(true);
            }
          }}
        >
          Send
        </button>
      </div>
      <div className="bg-blue-900">
        Predicted : {JSON.stringify(predictInfo.prediction)}
      </div>
      <button
        onClick={async () => {
          try {
            const formatedObj = {
              type: predictInfo.type,
              raw_data: { ...predictInfo.raw_data },
              label: predictInfo.prediction,
            };

            console.log(formatedObj);

            const res = await Api.createDiagnosis(token?.id, formatedObj);
            if (res.status >= ResponseCodes.OK_WITH_RESPONSE && res.status < ResponseCodes.NOT_FOUND) {
              console.log("koooor");
              setIsPopup(true);
            }
          } catch (err) {
            setIsError(true);
          }
        }}
      >
        {" "}
        Send Prediction to feed if unsure about aquracy
      </button>
      {isPopup && (
        <SuccesfulPopUp
          succesfulPart="creating diagnosis"
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
  const [formState, setFormState] = useState<object>({});
  const [Prediction, setPrediction] = useState<null | boolean>(null);
  useEffect(() => {
    setFormState({ ...predictInfo });
  }, [predictInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission:", formState);
    const res = await Api.sendDiagnose({ ...predictInfo, type: type });
    const parsedRes = parseMlResult(res.data.body);
    setPrediction(parsedRes);
  };

  const handleChange = (key: string, value: number | File | null) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex-1 p-5">
      <h1 className="mb-5 text-3xl font-bold">{type} Prediction using ML</h1>
      <form onSubmit={handleSubmit}>
        {displayFields(formState, handleChange)}
        <button
          type="submit"
          className="mt-5 rounded bg-blue-500 p-3 text-white shadow"
        >
          Predict
        </button>
      </form>
      {Prediction !== null && (
        <DisplayedPrediction
          predictInfo={{
            prediction: Prediction,
            raw_data: { ...formState },
            type: type,
          }}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  const { token } = useContext(AuthContext);

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
        age: 0,
      },
    },
  ];
  const [current, setCurrent] = useState<number>(0);
  const handleSelectDisease = (disease: number) => {
    setCurrent(disease);
  };

  const currentPrediction = allPredictions[current];
  const predictInfo = currentPrediction ? currentPrediction.info : {};

  useEffect(() => {
    cookies, [];
  });
  return (
    <div className="flex">
      <Sidebar
        onSelectDisease={handleSelectDisease}
        options={allPredictions.map((prediction) => prediction.type)}
        selected_option_index={current}
      />
      <PredictionForm
        predictInfo={{ ...predictInfo }}
        type={allPredictions[current].type}
      />
      <button
        onClick={() => {
          cookies.token.set("hihihi");
        }}
      >
        hi
      </button>
    </div>
  );
};

export default App;
