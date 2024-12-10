import axios, { AxiosResponse } from "axios";
import React,{ useState } from "react";
import { api } from "~/utils/api/api";
import { MainForm } from "../newDiagnosisPAgeComponents/baseComponents/MainForm";
import { Cloud, Upload } from "lucide-react";
import { ErrorPopUp, PopUpWrapper, SuccesfulActionPopUp } from "../popup";
import { CreateNewDiagnosisPopUp } from "../newDiagnosisPAgeComponents/baseComponents/createNewDiagnosisPopUp";
import FileVisualizer from "../inPageImgVisulizer";
import { getBaseUrl } from "~/utils/getHost";


export interface PredictionFormWithImageProps<T, RequestResponse> {
  title: string;
  endpoint: string;
  componentToDisplayPrediction?: (data: T) => React.ReactElement;
  anotherComponentToDisplayPrediction: (
    data: RequestResponse,
  ) => React.ReactElement;
  savePrediction: (
    data: { prediction: string, file: File },
    directVoteWhichSkipsVoting: boolean | null,
    vote: boolean,
    description: string
  ) => Promise<AxiosResponse<{ newDiag: {diagnosis: {id: number}} }>>;
}

export const PredictionForm = <T extends object, RequestResponse>({
  title,
  endpoint,
  componentToDisplayPrediction,
  anotherComponentToDisplayPrediction,
  savePrediction,
}: PredictionFormWithImageProps<T, RequestResponse>) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("")
  const [description, setDescription] = useState("")
  const [responseMessage, setResponseMessage] = useState<{
    errMsg?: string;
    predictionData?: T;
  } | null>(null);
  const [succesfulAction, setIsSuccesfullaction] = useState("")
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreatenewDiagOpen, setIsCreatenewDiagOpen] = useState(false)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  const [succesfulDiagnosisCreationId, setSuccesfulDiagnosisCreationId] = useState<null | number>(null)

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
      const response = await axios.post<{ prediction: T } | { errMsg: string }>(
        endpoint,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
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
    <>
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
        <SuccesfulActionPopUp text={succesfulAction} onClose={() => { setIsSuccesfullaction("") }}>
{succesfulDiagnosisCreationId !== null && (
  <div className="flex justify-center items-center mt-4">
    <a
      href={`${getBaseUrl(window.location.href)}/diagnoses/${succesfulDiagnosisCreationId}`}
      className="bg-primary text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-primary-dark hover:shadow-lg transition duration-200"
    >
      Go to Diagnosis
    </a>
  </div>
)}
        </SuccesfulActionPopUp>
        
        <ErrorPopUp isOpen={error.length > 0} error={ error} onClose={() => setError("")} />
        <div
          className="relative rounded-lg border-2 border-dashed border-gray-300 bg-gray-900 p-6 transition-colors hover:border-gray-400"
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            <Cloud className="h-12 w-12 text-gray-400" />
            <div className="text-sm text-gray-300">Drag and drop file here</div>
            <div className="flex items-center text-xs text-gray-400">
              <span>Limit 200MB per file · JPG, JPEG, JFIF, PNG</span>
            </div>
            {file && (
              <div className="mt-2 flex items-center text-sm text-green-400">
                <Upload className="mr-2 h-4 w-4" />
                {file.name}
              </div>
            )}
          </div>
        </div>
        <div>
          
          {file !== null && <FileVisualizer file={file} />}
        </div>
        <div>
          <CreateNewDiagnosisPopUp
            isOpen={isCreatenewDiagOpen}
            onClose={() => {
                setIsCreatenewDiagOpen(false);
              }
            }
          
            saveDiagnosis={async (vote: boolean, skipVoting: boolean | null) => {
              if (file === null) {
                setError("no file uploaded")
                throw new Error("no file uploaded")
              }
              try {
                console.log("mjioijjo",savePrediction)
                const data_1 = await savePrediction({
                  file: file,
                  prediction: JSON.stringify(responseMessage!.predictionData!),
                  
                }, skipVoting, vote, description);
                console.log("new diag", data_1.data);
                setSuccesfulDiagnosisCreationId(data_1.data.newDiag.diagnosis.id)
                setIsSuccesfullaction("created diagnosis");
                return;
              } catch (e) {
                console.error("Error creating prediction:", e);
                setError("error creating prediction, pls try again");
                return;
              }
            }}
          /> 
        </div>
        {responseMessage !== null &&
          responseMessage !== undefined &&
          anotherComponentToDisplayPrediction(
            responseMessage.predictionData,
          )}
      </MainForm>
      <input placeholder="description (optional)" value={description} onChange={(e) => setDescription(e.target.value)}/>
      <div className="flex flex-auto gap-2">
        <button
          className="bg-primary"
          onClick={async () => {
            if (file === null) {
              throw new Error("Please select a file first");
            }
            setIsCreatenewDiagOpen(true)
          }}
        >
          Send to feed
        </button>
      </div>
    </>
  );
};
