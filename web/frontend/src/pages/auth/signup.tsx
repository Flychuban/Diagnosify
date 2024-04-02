import { InputForm } from "../../components/form";
import { cookies } from "~/utils/cookies"; // make sure cookies utility is correctly implemented
import { Api } from "~/utils/api"; // ensure Api utility is implemented with a login method
import React, { useState } from "react";
const Signup: React.FC = () => {
  const inputSchema = [
    { name: "username", label: "Username", type: "text" },
    { name: "password", label: "Password", type: "password" },
  ];
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  return (
    <div>
      <h1>Form Page</h1>
      <InputForm
        input_schema={inputSchema}
        handleSubmit={async (objToSend: {
          username: string;
          password: string;
        }) => {
          const res = await Api.signup(objToSend);
          if (res) {
            setIsPopUpOpen(true);
          }
        }}
      />

      {isPopUpOpen && (
        <div>
          <p>Succesfulr register proceed to login</p>
        </div>
      )}
    </div>
  );
};

export default Signup;
