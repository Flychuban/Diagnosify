import { InputForm } from "../../components/form";
import { cookies } from "~/utils/cookies";
import { api } from "~/utils/api/api";
import { AuthContext } from "~/utils/context";
import { useContext, useEffect, useState } from "react";
import { DefaultError, DismissableError } from "~/components/error";
import { useRouter } from "next/router";
import { ErrorState } from "~/utils/types";
import { getBaseUrl, getHost } from "~/utils/getHost";

const Login: React.FC = () => {
  const { token } = useContext(AuthContext);
  const router = useRouter();
  const inputSchema = [
    { name: "username", label: "Username", type: "text" },
    { name: "password", label: "Password", type: "password" },
  ];
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isError, setIsError] = useState<ErrorState>("");
  const [stateForTriggeringRerender, setStateForTriggeringRerender] = useState(0)
  useEffect(() => {
    // we do this since we dont want to be annoying and redirect the user when he enters it in the browser normally 
    if (stateForTriggeringRerender === 0) {
      return
    }
    if (cookies.token.get() !== undefined && cookies.token.get() !== null && cookies.token.get() !== "") {
     console.log("host",getBaseUrl(window.location.href)); 
    window.location.href = `${getBaseUrl(window.location.href)}` 
    }
  },[stateForTriggeringRerender])
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="flex w-full max-w-md flex-col items-center rounded-lg bg-gray-800 p-6 shadow-lg">
        <h1 className="mb-6 w-full text-center text-3xl font-semibold">
          Login
        </h1>
        <InputForm
          input_schema={inputSchema}
          handleSubmit={async (objToSend: {
            username: string;
            password: string;
          }) => {
            // try {
            //   const tokenObj = await api.user.login(objToSend);
            //   if (tokenObj.err) {
            //     setIsError(tokenObj.err)
            //   }
            //   if (tokenObj.data === null) {
            //     throw new Error("no data found")
            //   }
            //   cookies.token.set(tokenObj.data?.token);
            //   setIsPopUpOpen(true);
            //   setStateForTriggeringRErender(stateForTriggeringRerender + 1)
            // } catch (err) {
            //   console.error(err)
            //   setIsError(JSON.stringify(err));
            // }
            

            try {
              const tokenObj = await api.user.login(objToSend);
              if ("errMsg" in tokenObj) {
                setIsError(tokenObj.errMsg)
              } else {
                cookies.token.set(tokenObj.token);
              }

              setIsPopUpOpen(true);
              setStateForTriggeringRerender(stateForTriggeringRerender + 1)
            }catch(err){}
          }}
        />
        {isPopUpOpen && (
          <div>
            <p>Redirecting ... </p>
          </div>
        )}
        {isError.length > 0 && <DismissableError message={isError } />}
      </div>
    </div>
  );
};

export default Login;
