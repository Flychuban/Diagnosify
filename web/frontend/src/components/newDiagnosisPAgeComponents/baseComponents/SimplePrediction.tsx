import axios, {  } from "axios";
import React,{ ReactNode, useState } from "react";
import {PopUpWrapper, SuccesfulActionPopUp} from "../../popup"
import { CreateNewDiagnosisPopUp } from "./createNewDiagnosisPopUp";
import { getBaseUrl } from "~/utils/getHost";
interface PredictionFormProps<PredictionResponse,T> {
  title: string;
  endpoint: string;
  formFields: { key: keyof T; label: string; type?: string }[];
  componentToDisplayPrediction: (data: PredictionResponse) => ReactNode
  SavePredictionInDbWithTheS3ReferenceHandler: (data: { dataForPrediction: T, responseMsg: PredictionResponse }, vote: boolean, directVoteWhichSkipsVoting: boolean | null) => Promise<{newDiag: {diagnosis: {id:number}}}> 
}


export const SimplePredictionForm = <PredictionResponse, FormDataStructure extends Record<string, any>>({
  title,
  endpoint,
  formFields,
  componentToDisplayPrediction,
  SavePredictionInDbWithTheS3ReferenceHandler
}: PredictionFormProps<PredictionResponse, FormDataStructure>) => {
  const [isCreateDiagnosisPopUpOpen, setIsCreateDiagnosisPopUpOpen] = useState(false)
  const [idOfCreatedPrediction,setIdOfCreatedPrediction] = useState<null | number>(0)
  const [formData, setFormData] = useState<FormDataStructure>(
    formFields.reduce((acc, field) => {
      acc[field.key] = ""; // Correctly assign an empty string to each field key
      return acc;
    }, {} as FormDataStructure) // Ensure type safety for the accumulator
  );
  const [description, setDescription] = useState("")
  const [responseMessage, setResponseMessage] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [succesfulAction,setSuccesfulAction] = useState("") 
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
      <CreateNewDiagnosisPopUp
        isOpen={isCreateDiagnosisPopUpOpen}
        onClose={() => { setIsCreateDiagnosisPopUpOpen(false) }}
        saveDiagnosis={async (vote, directVoteWhichSkipsVoting) => {
          if (responseMessage === null) {
            throw new Error("No prediction received");
          }
          const res = await SavePredictionInDbWithTheS3ReferenceHandler({dataForPrediction:formData,responseMsg: responseMessage, description: description},vote, directVoteWhichSkipsVoting)
          console.log("6t6t",res);
          setIdOfCreatedPrediction(res.newDiag.diagnosis.id)
          setSuccesfulAction("created diagnosis")
        }}
      />
      <SuccesfulActionPopUp text={succesfulAction} onClose={() => { setSuccesfulAction("") }} >
      {idOfCreatedPrediction !== null && (

  <div className="flex justify-center items-center mt-4">
    <a
      href={`${getBaseUrl(window.location.href)}/diagnoses/${idOfCreatedPrediction}`}
      className="bg-primary text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-primary-dark hover:shadow-lg transition duration-200"
    >
      Go to Diagnosis
    </a>
  </div>
)}

      </SuccesfulActionPopUp> 
      <h2 className="mb-6 text-2xl font-bold text-primarytext">{title}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {formFields.map(({ key, label, type = "text" }) => (
      <div key={key as string} className="space-y-2">
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
          className="w-full rounded-lg border border-gray-300 bg-secondary px-3 py-2 text-primary-dark shadow-sm focus:border-primary focus:ring-2 focus:ring-primary-dark transition"
        />
      </div>
    ))}

  </div>

        <textarea placeholder="description (optional)" value={description} className="bg-secondary text-primarytext rounded-md border-y-[1px] border-x-[1px] border-primarytext w-[100%]" onChange={e => setDescription(e.target.value)} />
  <button
    type="submit"
    disabled={isLoading}
    className="w-full rounded-lg bg-primary py-3 text-white font-semibold hover:bg-primary-dark disabled:bg-gray-400 transition"
  >
    {isLoading ? "Processing..." : "Predict"}
  </button>
</form>

      <button
        onClick={async () => {
          if (!responseMessage) { 
            return;
          }
         setIsCreateDiagnosisPopUpOpen(true) 
        }}
      >create diagnosis</button>

      {responseMessage && componentToDisplayPrediction(responseMessage)}
    </div>
  );
};

