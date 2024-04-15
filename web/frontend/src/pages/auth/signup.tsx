import { InputForm } from "../../components/form";
import { cookies } from "~/utils/cookies";
import { Api } from "~/utils/api";
import { CustomError, DefaultError } from "~/components/error";
import React, { useState } from "react";
import { SuccesfulPopUp } from "~/components/popup";
const Signup: React.FC = () => {
  const inputSchema = [
    { name: "username", label: "Username", type: "text" },
    { name: "password", label: "Password", type: "password" },
  ];
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-secondary text-white ">
      <h1>Signup</h1>
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
        <SuccesfulPopUp
          succesfulPart="signing up"
          timeBeforeExpiration={10000}
        />
      )}
      {isError && <DefaultError />}
    </div>
  );
};

export default Signup;
