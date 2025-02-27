import React, { useState, useEffect } from "react";
import { useUserContext } from "../UserManagementComponent/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../api/axiosInstance";

interface User {
  id: number;
  email: string;
  role: string;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { email, message, issuperuser, logout } = useUserContext();

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

    // Fetch users only if the current user is a superuser
    if (issuperuser) {
      const fetchUsers = async () => {
        try {
          const response = await apiClient.get("/user-management/api/users/", {
            withCredentials: true,
          });
          setUsers(response.data);
        } catch (error) {
          console.error("Error fetching users:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    } else {
      setLoading(false);
    }

  }, [navigate, issuperuser]);

  const handleRoleChange = async (userId: number, newRole: string) => {
    const response = await apiClient.put(`/user-management/api/users/${userId}/`,
      { role: newRole },
      { withCredentials: true }
    )
    if (response.status == 200) {
      alert("Role updated successfully.");
      setUsers((prevUsers) =>
        prevUsers.map((user) => user.id === userId ? { ...user, role: newRole } : user)
      );
    } else {
      alert("Failed to update role.");
    }
  };

  return (
    <main className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome to the Dashboard</h1>
          {email && <p className="text-gray-600 mt-2">Logged in as {email}</p>}
          {message && <p className="text-gray-600 mt-2">{message}</p>}
        </div>

        {/* <button
          onClick={logout}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg mt-4"
        >
          Logout
        </button> */}
        {issuperuser && (
          <div className="w-full max-w-[600px] bg-white rounded-xl shadow-lg p-6 sm:p-8 mt-8">
            <h2 className="text-xl font-semibold">Manage Users</h2>
            {loading ? (
              <p>Loading users...</p>
            ) : (
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        >
                          <option value="Admin">Admin</option>
                          <option value="HR">HR</option>
                          <option value="Manager">Manager</option>
                          <option value="Employee">Employee</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default DashboardPage;
