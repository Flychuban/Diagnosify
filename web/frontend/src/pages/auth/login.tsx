import { InputForm } from "../../components/form";
import { cookies } from "~/utils/cookies";
import { Api } from "~/utils/api";
import { AuthContext } from "~/utils/context";
import { useContext, useState } from "react";
import { DefaultError } from "~/components/error";
import { useRouter } from "next/router";

const Login: React.FC = () => {
  const { token } = useContext(AuthContext);
  const router = useRouter();
  const inputSchema = [
    { name: "username", label: "Username", type: "text" },
    { name: "password", label: "Password", type: "password" },
  ];
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isError, setIsError] = useState(false);

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
            try {
              const tokenObj = await Api.login(objToSend);
              cookies.token.set(tokenObj.token);
              setIsPopUpOpen(true);
              router.push("/");
            } catch (err) {
              setIsError(true);
            }
          }}
        />
        {isPopUpOpen && (
          <div>
            <p>Redirecting ... </p>
          </div>
        )}
        {isError && <DefaultError />}
      </div>
    </div>
  );
};

export default Login;
