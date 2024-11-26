import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Define the types for user data
interface UserContextType {
  email: string | null;
  message: string | null;
  setUserData: (email: string, message: string) => void;
  logout: () => void;
}
// Define the props type for UserProvider
interface UserProviderProps {
    children: React.ReactNode;
  }

const UserContext = createContext<UserContextType | undefined>(undefined);

// User Context Provider
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [email, setEmail] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if the user is already logged in by fetching data from sessionStorage
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("userEmail");
    const storedMessage = sessionStorage.getItem("message");
    if (storedEmail && storedMessage) {
      setEmail(storedEmail);
      setMessage(storedMessage);
    }
  }, []);

  const setUserData = (email: string, message: string) => {
    setEmail(email);
    setMessage(message);
    sessionStorage.setItem("userEmail", email);
    sessionStorage.setItem("message", message);
  };

  const logout = () => {
    setEmail(null);
    setMessage(null);
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("message");

    navigate('/')
  };

  return (
    <UserContext.Provider value={{ email, message, setUserData, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access user context
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
