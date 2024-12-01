import React, {useEffect} from "react";
import { useUserContext } from "./UserContext";
import { useLocation, useNavigate } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, message, logout } = useUserContext();

  useEffect(() => {
    // Parse query parameters
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("access");
    const refreshToken = params.get("refresh");
    if (accessToken && refreshToken) {
      // Store tokens in sessionStorage
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("refreshToken", refreshToken);

      // Remove tokens from the URL
      navigate("/", { replace: true });
    } else {
      // Fetch user data with existing token or redirect to login
      const storedAccessToken = sessionStorage.getItem("accessToken");
      if (!storedAccessToken) {
        navigate("/login");
      }
    }
  }, [location, navigate]);

  return (
    <main className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome to the Dashboard</h1>
          {email && <p className="text-gray-600 mt-2">Logged in as {email}</p>}
          {message && <p className="text-gray-600 mt-2">{message}</p>}
        </div>

        <button
          onClick={logout}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg mt-4"
        >
          Logout
        </button>
      </div>
    </main>
  );
};

export default DashboardPage;
