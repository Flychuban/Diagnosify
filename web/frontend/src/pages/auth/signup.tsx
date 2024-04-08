import { InputForm } from "../../components/form";
import { cookies } from "~/utils/cookies";
import { Api } from "~/utils/api";
import { Error, DefaultError } from "~/components/error";
import React, { useState } from "react";
const Signup: React.FC = () => {
  const inputSchema = [
    { name: "username", label: "Username", type: "text" },
    { name: "password", label: "Password", type: "password" },
  ];
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  return (
    <div>
      <h1>Form Page</h1>
      <InputForm
        input_schema={inputSchema}
        handleSubmit={async (objToSend: {
          username: string;
          password: string;
        }) => {
          try {
            const res = await Api.signup(objToSend);
            if (res) {
              setIsPopUpOpen(true);
            }
          } catch (err) {
            setIsError(true);
          }
        }}
      />

      {isPopUpOpen && (
        <div>
          <p>Succesfulr register proceeding to login page </p>
        </div>
      )}
      {isError && <DefaultError />}
    </div>
  );
};

export default Signup;
