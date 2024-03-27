import React, { useState, ChangeEvent, FormEvent } from "react";

interface InputSchema {
  name: string;
  label: string;
  type: string;
}

interface Props {
  input_schema: InputSchema[];
}

export const InputForm: React.FC<Props> = ({ input_schema }) => {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>, name: string) => {
    setFormData({
      ...formData,
      [name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    // You can perform further actions with the form data here
  };

  return (
    <form onSubmit={handleSubmit}>
      {input_schema.map((input, index) => (
        <div key={index}>
          <label htmlFor={input.name}>{input.label}:</label>
          <input
            type={input.type}
            id={input.name}
            name={input.name}
            value={formData[input.name] || ""}
            onChange={(e) => handleChange(e, input.name)}
          />
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};
