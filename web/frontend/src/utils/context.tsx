import React, {
  createContext,
  useEffect,
  useState,
  FC,
  useContext,
} from "react";
import { cookies } from "./cookies";

interface AuthContextType {
  token: string | null;
  setToken: (newToken: string | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {}, // Default empty function
});

export const AuthProvider: FC = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCookie() {
      const token = await cookies.token.get();
      if (token) {
        setToken(token);
      }
    }

    fetchCookie(); // Call fetchCookie inside useEffect
  }, []);

  const updateToken = (newToken: string | null) => {
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
