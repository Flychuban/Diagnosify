import React, {
  createContext,
  useEffect,
  useState,
  FC,
  useContext,
} from "react";
import { cookies } from "./cookies";
function jwt_decode(token) {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}
interface User {
  id: number;
  username: string;
}
interface AuthContextType {
  token: User | null;
  setToken: (newToken: User | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {}, // Default empty function
});

export const AuthProvider: FC = ({ children }) => {
  const [token, setToken] = useState<User | null>(null);

  useEffect(() => {
    async function fetchCookie() {
      const token = await cookies.token.get(); //! DONT REMOVE AWAIT
      console.log(token);
      if (token) {
        const parsedToken = jwt_decode(token);
        setToken({
          id: parsedToken.userId,
          username: parsedToken.username,
        });
      }
    }

    fetchCookie(); // Call fetchCookie inside useEffect
  }, []);

  const updateToken = (newToken: User | null) => {
    setToken(newToken);
    // You might also want to update the cookie here if needed
  };

  return (
    <AuthContext.Provider value={{ token, setToken: updateToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => useContext(AuthContext);
