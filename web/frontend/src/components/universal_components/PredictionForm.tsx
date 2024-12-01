import axios from "axios";
import React,{ useState } from "react";
import { api } from "~/utils/api/api";
import { MainForm } from "../newDiagnosisPAgeComponents/baseComponents/MainForm";
import { Cloud, Upload } from "lucide-react";
import { PopUpWrapper } from "../popup";


export interface PredictionFormWithImageProps<T, RequestResponse> {
  title: string;
  endpoint: string;
  componentToDisplayPrediction?: (data: T) => React.ReactElement;
  anotherComponentToDisplayPrediction: (
    data: RequestResponse,
  ) => React.ReactElement;
  savePrediction: (
    data: {prediction: string, file: File},
  ) => Promise<{ isSaved: boolean; payloadWithAdditionalInfo: string }>;
}

export const PredictionForm = <T extends object, RequestResponse>({
  title,
  endpoint,
  componentToDisplayPrediction,
  anotherComponentToDisplayPrediction,
  savePrediction,
}: PredictionFormWithImageProps<T, RequestResponse>) => {
  const [
    isRateDiagnosisDirectlyPopUpOpen,
    setIsRateDiagnosisDirectlyPopUpOpen,
  ] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [responseMessage, setResponseMessage] = useState<{
    errMsg?: string;
    predictionData?: T;
  } | null>(null);
  const [diagnosisId, setDignosisId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const popUpVoteHander = (vote: boolean) => {
    setIsRateDiagnosisDirectlyPopUpOpen(false);
    api.diagnoses.votings;
  };

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
          <button
            onClick={async () => {
              const userId = cookies.token.get();
              if (userId === null) {
                throw new Error("user id is not set");
              }
              const data = responseMessage!.predictionData;
              if (data === undefined) {
                throw new Error("Prediction data is not set");
              }
              await api.diagnoses.createDiagnosis(
                userId.userId.toString(),
                data,
              );
            }}
          >
            publish diagnosis for review
          </button>
        </div>
        <div>
          <PopUpWrapper
            onClose={() => {
              setIsRateDiagnosisDirectlyPopUpOpen(false);
            }}
            isOpen={isRateDiagnosisDirectlyPopUpOpen}
            ComponentToDisplay={() => {
              return (
                <div className="flex flex-auto gap-3">
                  <button onClick={() => {}}>its correct</button>
                  <button onClick={() => {}}>its not correct</button>
                </div>
              );
            }}
          />
          <div>hi2</div>
        </div>
        {responseMessage !== null &&
          responseMessage !== undefined &&
          anotherComponentToDisplayPrediction<RequestResponse>(
            responseMessage.predictionData,
          )}
      </MainForm>
      <div className="flex flex-auto gap-2">
        <button
          className="bg-primary"
          onClick={async () => {
            if (file === null) {
              throw new Error("Please select a file first");
            }
            await savePrediction({
              file: file,
              prediction: JSON.stringify(responseMessage!.predictionData!)
            });
          }}
        >
          Send to feed
        </button>
        <button
          className="bg-primary"
          onClick={async () => {
            await setIsRateDiagnosisDirectlyPopUpOpen(true);
          }}
        >
          Vote directly
        </button>
      </div>
    </>
  );
};
