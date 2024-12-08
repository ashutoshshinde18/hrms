import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"
import apiClient from "../api/axiosInstance";

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

  const setUserData = (email: string, message: string) => {
    setEmail(email);
    setMessage(message);
  };

  const logout = async () => {
    try {
      const response = await apiClient.post("/user-management/api/logout/", {
        withCredentials: true,
      });

      if (response.status == 200) {
        setEmail(null);
        setMessage(null);
        navigate("/login");
      } else {
        console.error("Failed to log out. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
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
