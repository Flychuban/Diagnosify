import axios, { AxiosResponse } from "axios";
import React,{ ReactNode, useState } from "react";
import {PopUpWrapper} from "../../popup"
interface PredictionFormProps<PredictionResponse,T> {
  title: string;
  endpoint: string;
  formFields: { key: keyof T; label: string; type?: string }[];
  componentToDisplayPrediction: (data: PredictionResponse) => ReactNode
  SavePredictionInDbWithTheS3ReferenceHandler: (data: { dataForPrediction: T, responseMsg: PredictionResponse  }) => Promise<AxiosResponse>
}


export const SimplePredictionForm = <PredictionResponse, FormDataStructure extends Record<string, any>>({
  title,
  endpoint,
  formFields,
  componentToDisplayPrediction,
  SavePredictionInDbWithTheS3ReferenceHandler
}: PredictionFormProps<PredictionResponse, FormDataStructure>) => {
  const [isCreateDiagnosisPopUpOpen,setIsCreateDiagnosisPopUpOpen] = useState(false)
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
      <button
        onClick={async () => {
        setTimeout(() => {
          setIsCreateDiagnosisPopUpOpen(true)
        }, 1)
          if (!responseMessage) { 
            return;
          }
          
          const res = await SavePredictionInDbWithTheS3ReferenceHandler({dataForPrediction:formData,responseMsg: responseMessage })
          console.dir("res",res)
        }}
      >create diagnosis</button>
      <PopUpWrapper
        onClose={() => { setIsCreateDiagnosisPopUpOpen(false) }} isOpen={isCreateDiagnosisPopUpOpen} ComponentToDisplay={() => {
          return <div>
            <button onClick={() => { }}>vote directly</button>
            <button onClick={() => {

            }}>send to feed</button>
        </div>
        }}
      />

      {responseMessage && componentToDisplayPrediction(responseMessage)}
    </div>
  );
};

