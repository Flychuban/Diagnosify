import { InputForm } from "../../components/form";
import { cookies } from "~/utils/cookies"; // make sure cookies utility is correctly implemented
import { Api } from "~/utils/api"; // ensure Api utility is implemented with a login method
import { AuthContext } from "~/utils/context";
import { useContext } from "react";
const Login: React.FC = () => {
  const { token } = useContext(AuthContext);
  const inputSchema = [
    { name: "username", label: "Username", type: "text" },
    { name: "password", label: "Password", type: "password" },
  ];

  return (
    <div>
      <h1>Form Page</h1>
      <InputForm
        input_schema={inputSchema}
        handleSubmit={async (objToSend: {
          username: string;
          password: string;
        }) => {
          const tokenObj = await Api.login(objToSend); // Assumed corrected Api.login usage
          cookies.token.set(tokenObj.token);
        }}
      />
      <p>{console.log(token)}</p>
    </div>
  );
};

export default Login;
