import React, { useState, type ChangeEvent, type FormEvent } from "react";

// Define the input type for each form field
type InputField = {
  name: string;
  type: "text" | "number" | "file"; // Extendable for other input types
  label: string;
};

// Define the props for PredictForm
type PredictFormProps = {
  inputs: InputField[];
  onSubmit?: (data: Record<string, string | File | null>) => void;
};

const PredictForm: React.FC<PredictFormProps> = ({ inputs, onSubmit }) => {
  const [formData, setFormData] = useState<Record<string, string | File | null>>(() => {
    const initialData: Record<string, string | File | null> = {};
    inputs.forEach((input) => {
      initialData[input.name] = input.type === "file" ? null : "";
    });
    return initialData;
  });
const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  const { name, value, type, files } = e.target;
  
  setFormData(prevData => {
    const newData = { ...prevData };
    if (value === undefined) {
      console.error("Invalid input field:", name);
      return prevData;
    }
    if (files?.[0]) { 

      newData[name] = type === "file" ? (files ? files[0] : null) : value;
    }
      return newData;
  });
};

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    } else {
      console.log(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {inputs.map((input) => (
        <div key={input.name} style={{ marginBottom: "1rem" }}>
          <label htmlFor={input.name} style={{ display: "block", marginBottom: ".5rem" }}>
            {input.label}
          </label>
          {input.type === "file" ? (
            <input
              type="file"
              id={input.name}
              name={input.name}
              onChange={handleChange}
            />
          ) : (
            <input
              type={input.type}
              id={input.name}
              name={input.name}
              value={formData[input.name] as string}
              onChange={handleChange}
            />
          )}
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

// Define the App component
const App: React.FC = () => {
  const inputs: InputField[] = [
    { name: "name", type: "text", label: "Name" },
    { name: "age", type: "number", label: "Age" },
    { name: "file", type: "file", label: "Upload File" },
  ];

  const handleFormSubmit = (data: Record<string, string | File | null>) => {
    console.log("Form Data:", data);

    if (data.file instanceof File) {
      console.log("Uploaded File:", data.file.name);
    }
  };

  return <PredictForm inputs={inputs} onSubmit={handleFormSubmit} />;
};

export default App;

