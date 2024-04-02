import { InputForm } from "../../components/form";

const Login: React.FC = () => {
  const inputSchema = [
    { name: "username", label: "Username", type: "text" },
    { name: "password", label: "Password", type: "password" },
    // Add more input fields as needed
  ];

  return (
    <div>
      <h1>Form Page</h1>
      <InputForm input_schema={inputSchema} />
    </div>
  );
};

export default Login;
