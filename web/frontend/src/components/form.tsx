import React, { useState, ChangeEvent, FormEvent } from "react";

interface InputSchema {
  name: string;
  label: string;
  type: string;
}

interface Props {
  input_schema: InputSchema[];
  handleSubmit: any;
}

export const InputForm: React.FC<Props> = ({ input_schema, handleSubmit }) => {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>, name: string) => {
    setFormData({
      ...formData,
      [name]: e.target.value,
    });
  };

  return (
    <form
      onSubmit={(e: React.FormEvent) => {
        e.preventDefault();

        handleSubmit(formData);
      }}
    >
      {input_schema.map((input, index) => (
        <div key={index}>
          <label htmlFor={input.name}>{input.label}:</label>
          <input
            type={input.type}
            id={input.name}
            name={input.name}
            value={formData[input.name] ?? ""}
            onChange={(e) => handleChange(e, input.name)}
          />
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};
