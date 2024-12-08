import { Loader2, Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "./UserContext";
import apiClient from "../api/axiosInstance";

interface TouchedState {
  email: boolean;
  password: boolean;
}

export default function LoginPage() {
  const GOOGLE_CLIENT_ID = "684766656106-fpdkiiher50v298o2bl609pipc81oqrg.apps.googleusercontent.com"
  const REDIRECT_URI = "http://localhost:8000/user-management/api/auth/google/callback"
  const SCOPE = "profile email";
  const RESPONSE_TYPE = "code";
  const navigate = useNavigate();
  const { setUserData } = useUserContext();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [touched, setTouched] = useState<TouchedState>({
    email: false,
    password: false,
  });

  const initiateGoogleLogin = () => {
    console.log('in')
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&response_type=${RESPONSE_TYPE}&access_type=online&prompt=consent`;
    console.log(googleAuthUrl)
    window.location.href = googleAuthUrl
  }
  // Validate email format
  const validateEmail = (email: string): boolean => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) !== null;
  };

  // Validate password (minimum length)
  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validateEmail(email) || !validatePassword(password)) {
      setError("Please check your email and password");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      // Make an API call to the Django login endpoint
    const response = await apiClient.post("/user-management/api/login/", {
      email,
      password
    });

    // console.log('data: ',data)
    if (response.status == 200) {
      const data = response.data;
      setUserData(data.useremail, data.message);
      navigate("/");
    } else {
      // Handle API errors
      setError("Login failed. Please try again.");
    }
    } catch (err:any) {
      if (err.response?.data?.error) {
          setError(err.response.data.error); // API-provided error message
      } else {
          setError("Login failed. Please try again."); // Generic error message
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Login to your TheDayHR account</p>
        </div>

        {error && (
          <div
            role="alert"
            className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center gap-2 mb-6"
          >
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() =>
                  setTouched({
                    ...touched,
                    email: true,
                  })
                }
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
                aria-invalid={touched.email && !validateEmail(email)}
                aria-describedby={
                  touched.email && !validateEmail(email)
                    ? "email-error"
                    : undefined
                }
              />
            </div>
            {touched.email && !validateEmail(email) && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
                Please enter a valid email address
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() =>
                  setTouched({
                    ...touched,
                    password: true,
                  })
                }
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                aria-invalid={touched.password && !validatePassword(password)}
                aria-describedby={
                  touched.password && !validatePassword(password)
                    ? "password-error"
                    : undefined
                }
              />
            </div>
            {touched.password && !validatePassword(password) && (
              <p id="password-error" className="mt-1 text-sm text-red-600">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Login
              </>
            )}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={initiateGoogleLogin}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <img
                src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
                alt="Google"
                className="w-5 h-5"
              />
              <span>Google</span>
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 oauth-button"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 23 23"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill="#f25022" d="M1 1h9v9H1z" />
                <path fill="#00a4ef" d="M1 11h9v9H1z" />
                <path fill="#7fba00" d="M11 1h9v9h-9z" />
                <path fill="#ffb900" d="M11 11h9v9h-9z" />
              </svg>
              <span>Microsoft</span>
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          New user?{" "}
          <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Click to Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
