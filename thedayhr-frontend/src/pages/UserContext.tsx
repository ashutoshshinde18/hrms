import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"

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
    const accessToken = sessionStorage.getItem("accessToken");

    if (storedEmail && accessToken) {
      const decodedToken: any = jwtDecode(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp > currentTime) {
        setEmail(storedEmail);
      } else {
        refreshAccessToken();
      }
    } else {
      navigate("/");
    }
  }, []);

  const refreshAccessToken = async () => {
    const refreshToken = sessionStorage.getItem("refreshToken");

    if (!refreshToken) {
      logout();
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem("accessToken", data.access);
      } else {
        logout();
      }
    } catch (err) {
      logout();
    }
  };

  const setUserData = (email: string, message: string) => {
    setEmail(email);
    setMessage(message);
    sessionStorage.setItem("userEmail", email);
  };

  const logout = () => {
    setEmail(null);
    setMessage(null);
    sessionStorage.clear();
    navigate('/login')
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
