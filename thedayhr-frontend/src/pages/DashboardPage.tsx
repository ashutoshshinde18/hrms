import React, {useEffect} from "react";
import { useUserContext } from "./UserContext";
import { useLocation, useNavigate } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, message, logout } = useUserContext();

  useEffect(() => {
      const checkAuth = async () => {
        try {
            const response = await fetch("http://localhost:8000/user-management/api/token/refresh/", {
                method: "POST",
                credentials: "include", // Include cookies
            });

            if (!response.ok) {
                navigate("/login");
            }
        } catch (err) {
            navigate("/login");
        }
    };

    checkAuth();
  }, [navigate]);

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
