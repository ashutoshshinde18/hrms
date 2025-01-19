import React, { useState, useEffect } from "react";
import apiClient from "../../api/axiosInstance";

type AttendanceLog = {
  date: string;
  location: {
    clock_in: {
      address: string;
      latitude: number;
      longitude: number;
    };
    clock_out: {
      address: string;
      latitude: number;
      longitude: number;
    }
  };
  clockIn: string | null;
  clockOut: string | null;
  duration: string | null;
}
export function LogsRequestsCard() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchAttendanceLogs = async () => {
      try {
        const response = await apiClient.get("attendance/logs/", {
          withCredentials: true,
        });
        setAttendanceLogs(response?.data?.attendance_logs || []);
      } catch (error) {
        console.error("Error fetching attendance logs:", error);
      } finally {
        setIsLoading(false)
      }
    }
    fetchAttendanceLogs();
  }, [])

  const requests = [
    {
      date: "Jan 02, Thu",
      note: "Forgot to clock out",
      lastActionBy: "John Manager",
      status: "Approved",
    },
    // Add more requests as needed
  ];
  // Helper to calculate hour difference
  const calculateHours = (clockIn: string, clockOut: string): number => {
    if (!clockIn || !clockOut) return 0;
    
    const parseTime = (time: string): Date => {
      const [hourMinute, period] = time.split(" ");
      const [hours, minutes] = hourMinute.split(":").map((val) => parseInt(val));

      const date = new Date();
      let adjustedHours = hours;

      // Adjust hours for AM/PM
      if (period === "PM" && hours !== 12) {
        adjustedHours += 12;
      } else if (period === "AM" && hours === 12) {
        adjustedHours = 0;
      }
      
      date.setHours(adjustedHours, minutes, 0, 0);
      return date;
    };
    
    const inTime = parseTime(clockIn);
    const outTime = parseTime(clockOut);

    const diffMs = outTime.getTime() - inTime.getTime();
    const diffHours = diffMs / (1000 * 60 * 60); // Convert ms to hours

    return Math.max(0, diffHours); // Ensure non-negative value
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  const maxWorkingHours = 12; // Define the max working hours for progress
  return (
    <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Logs & Requests
      </h2>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {["Attendance Log", "Requests"].map((tab, index) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(index)}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${selectedTab === index ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      {selectedTab === 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clock In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clock Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceLogs.map((log, index) => {
                const hoursWorked = calculateHours(log.clockIn || "", log.clockOut || "");
                const progress = Math.min((hoursWorked / maxWorkingHours) * 100, 100); // Ensure valid progress percentage

                const missedClockout = !log.clockOut && hoursWorked > 12;
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="relative w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full bg-blue-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      {/* <span className="text-sm text-gray-600 ml-2">
                          {`${hoursWorked.toFixed(1)}`}
                        </span> */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.location?.clock_in?.address || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.clockIn || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.clockOut || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(!log.clockIn || !log.clockOut) ? (
                        <button className="text-blue-600 hover:text-blue-800">
                          Regularize
                        </button>
                      ) : (
                        "Present"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Note
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Action By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.note}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.lastActionBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
