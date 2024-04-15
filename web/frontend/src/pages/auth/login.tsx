import { InputForm } from "../../components/form";
import { cookies } from "~/utils/cookies"; // make sure cookies utility is correctly implemented
import { Api } from "~/utils/api"; // ensure Api utility is implemented with a login method
import { AuthContext } from "~/utils/context";
import { useContext, useState } from "react";
import { DefaultError, Error } from "~/components/error";
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
    <div className="flex h-screen flex-col items-center justify-center bg-secondary text-white">
      <h1>Login</h1>
      <InputForm
        input_schema={inputSchema}
        handleSubmit={async (objToSend: {
          username: string;
          password: string;
        }) => {
          try {
            const tokenObj = await Api.login(objToSend); // Assumed corrected Api.login usage
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
  );
};

export default Login;
