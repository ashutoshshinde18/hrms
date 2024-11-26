import {
    Loader2,
    Mail,
    Lock,
    LogIn,
    AlertCircle,
    User,
    ArrowLeft,
  } from "lucide-react";
  import { render } from "react-dom";
  import React, { useState, ChangeEvent, FocusEvent, FormEvent } from "react";
  import { Link } from "react-router-dom";
  
  interface FormData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  
  export default function SignupPage() {
    const [formData, setFormData] = useState<FormData>({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [touched, setTouched] = useState({
      fullName: false,
      email: false,
      password: false,
      confirmPassword: false,
    });
  
    const validateEmail = (email: string): boolean => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
  
    const validatePassword = (password: string): boolean => {
      return password.length >= 6;
    };
  
    const validateForm = (): boolean => {
      if (!formData.fullName.trim()) {
        setError("Full name is required");
        return false;
      }
      if (!validateEmail(formData.email)) {
        setError("Please enter a valid email address");
        return false;
      }
      if (!validatePassword(formData.password)) {
        setError("Password must be at least 6 characters");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
      return true;
    };
  
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        setError("");
      
        try {
          const response = await fetch('http://localhost:8000/user-management/api/signup/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: formData.fullName,
              email: formData.email,
              password: formData.password,
            }),
          });
      
          const data = await response.json();
      
          if (response.ok) {
            alert('Signup successful! Check your email to verify your account.');
          } else {
            console.log(data)
            console.log(data.error)
            setError(data.error || 'Signup failed. Please try again.');
          }
        } catch (err) {
          setError('Signup failed. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };
      
  
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleBlur = (field: keyof FormData) => {
      setTouched((prev) => ({
        ...prev,
        [field]: true,
      }));
    };
  
    return (
      <main className="min-h-screen w-full background-gradient flex items-center justify-center p-4 login-container">
        <div className="w-full max-w-[400px] bg-white rounded-xl shadow-lg p-6 sm:p-8 login-box">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-gray-900">Create Account</h1>
            <p className="text-gray-600 mt-2">Sign up for your TheDayHR account</p>
          </div>
  
          {error && (
            <div
              role="alert"
              className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center gap-2 mb-6 error-message"
            >
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}
  
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={() => handleBlur("fullName")}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 form-input"
                  placeholder="John Doe"
                />
              </div>
              {touched.fullName && !formData.fullName.trim() && (
                <p className="mt-1 text-sm text-red-600">Full name is required</p>
              )}
            </div>
  
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
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 form-input"
                  placeholder="you@example.com"
                />
              </div>
              {touched.email && !validateEmail(formData.email) && (
                <p className="mt-1 text-sm text-red-600">Please enter a valid email address</p>
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
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur("password")}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 form-input"
                  placeholder="••••••••"
                />
              </div>
              {touched.password && !validatePassword(formData.password) && (
                <p className="mt-1 text-sm text-red-600">Password must be at least 6 characters</p>
              )}
            </div>
  
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur("confirmPassword")}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 form-input"
                  placeholder="••••••••"
                />
              </div>
              {touched.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                )}
            </div>
  
            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed login-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-3" />
                    Signing Up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>
  
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/" className="text-blue-600 hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </main>
    );
  }
  