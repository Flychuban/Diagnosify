import { InputForm } from "../../components/form";
import { AuthToken, cookies } from "~/utils/cookies";
import { api } from "~/utils/api/api";
import { AuthContext } from "~/utils/context";
import { useContext, useEffect, useState } from "react";
import { DefaultError, DismissableError } from "~/components/error";
import { useRouter } from "next/router";
import { ErrorState } from "~/utils/types";
import { getBaseUrl } from "~/utils/getHost";
import { ErrorPopUp } from "~/components/popup";

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
              if ("token" in tokenObj) {
                cookies.token.set(tokenObj.token);
if (cookies.token.get() !== undefined && cookies.token.get() !== null && cookies.token.get() !== {} as AuthToken) {
     console.log("host",getBaseUrl(window.location.href)); 
    window.location.href = `${getBaseUrl(window.location.href)}/diagnoses/new` 
    }
              setIsPopUpOpen(true);
              setStateForTriggeringRerender(stateForTriggeringRerender + 1)
              } else {
                setIsError("inavalid password")
              }
              
            }catch(err){}
          }}
        />
        {isPopUpOpen && (
          <div>
            <p>Redirecting ... </p>
          </div>
        )}
        <ErrorPopUp error={isError} isOpen={isError.length > 0} onClose={() => {
          setIsError("")
          setIsPopUpOpen(false)
          setStateForTriggeringRerender(stateForTriggeringRerender + 1)
        }}/>
      </div>
    </div>
  );
};

export default Login;
