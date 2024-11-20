import React, { useState, ChangeEvent, FormEvent } from "react";

interface InputSchema {
  name: string;
  label: string;
  type: string;
}

interface authForm {
  username: string
  password: string
}

interface Props {
  input_schema: InputSchema[];
  handleSubmit: (argsObject: authForm) => Promise<void>;
}

export const InputForm: React.FC<Props> = ({ input_schema, handleSubmit }) => {
  const [formData, setFormData] = useState<authForm>({username: "", password: ""});

  const handleChange = (e: ChangeEvent<HTMLInputElement>, name: string) => {
    setFormData({
      ...formData,
      [name]: e.target.value,
    });
  };

  return (
    <div className="flex h-[50%] w-[100%] items-center justify-center rounded-md  text-white">
      <form
        onSubmit={async (e: React.FormEvent) => {
          e.preventDefault();
          await handleSubmit(formData);
        }}
      >
        {input_schema.map((input, index) => (
          <div key={index} className="mb-4">
            <label htmlFor={input.name} className="block">
              {input.label}:
            </label>
            <input
              type={input.type}
              id={input.name}
              name={input.name}
              value={formData[input.name]}
              onChange={(e) => handleChange(e, input.name)}
              className="mt-1 w-full rounded border bg-secondary px-3 py-2"
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
