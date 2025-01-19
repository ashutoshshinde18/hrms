import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Timer } from "lucide-react";
import apiClient from "../../api/axiosInstance";


export function ActionsCard() {
  const [time, setTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [workDuration, setWorkDuration] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  // Fetch initial clock-in state from the backend
  useEffect(() => {
    const fetchClockInStatus = async () => {
      try {
        const response = await apiClient.get("attendance/clock-in-out/", {
          withCredentials: true,
        });
        const { is_clocked_in, start_time, end_time } = response.data;

        if (is_clocked_in && start_time) {
          const parsedStartTime = new Date(start_time);
          setStartTime(parsedStartTime);
          setIsClockedIn(true);

          // Calculate and update elapsed time
          const now = new Date();
          const diff = now.getTime() - parsedStartTime.getTime();
          setWorkDuration({
            hours: Math.floor(diff / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000),
          });

          // Start the timer
          const id = setInterval(() => {
            const updatedDiff = new Date().getTime() - parsedStartTime.getTime();
            setWorkDuration({
              hours: Math.floor(updatedDiff / (1000 * 60 * 60)),
              minutes: Math.floor((updatedDiff % (1000 * 60 * 60)) / (1000 * 60)),
              seconds: Math.floor((updatedDiff % (1000 * 60)) / 1000),
            });
          }, 1000);
          setTimerId(id);
        }
        // Handle the clock-out scenario if available
        if (end_time) {
          const parsedEndTime = new Date(end_time);
          setEndTime(parsedEndTime);
          setIsClockedIn(false);
          setWorkDuration({
            hours: Math.floor((parsedEndTime.getTime() - new Date(start_time).getTime()) / (1000 * 60 * 60)),
            minutes: Math.floor(((parsedEndTime.getTime() - new Date(start_time).getTime()) % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor(((parsedEndTime.getTime() - new Date(start_time).getTime()) % (1000 * 60)) / 1000),
          });
        }
      } catch (error: any) {
        alert("Failed to fetch clock-in status: " + error.message);
      }
    };

    fetchClockInStatus();

    // Start updating the current time every second
    const timeInterval = setInterval(() => {
      setTime(new Date()); // Updates the current time every second
    }, 1000);

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
      clearInterval(timeInterval); // Clear the time update interval on unmount
    };
  }, []);

  const getLocation = async () => {
    return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        (error) => reject(error)
      )
    })
  }

  // Handle clock-in/clock-out action
  const handleClockInOut = async () => {
    try {
      const location = await getLocation();
      const action = isClockedIn ? "clock_out" : "clock_in";
      const response = await apiClient.post(
        "attendance/clock-in-out/",
        {
          action,
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        },
        { withCredentials: true }
      );

      if (action === "clock_in") {
        const now = new Date();
        console.log("Clocked In at:", now.toLocaleTimeString());
        setStartTime(now);
        setIsClockedIn(true);
        const id = setInterval(() => {
          const diff = new Date().getTime() - now.getTime();
          setWorkDuration({
            hours: Math.floor(diff / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000),
          });
        }, 1000);
        setTimerId(id);
      } else {
        const now = new Date();
        console.log("Clocked Out at:", now.toLocaleTimeString());
        console.log(
          `Elapsed Time: ${workDuration.hours}h ${workDuration.minutes}m ${workDuration.seconds}s`
        );
        setStartTime(null);
        setWorkDuration({ hours: 0, minutes: 0, seconds: 0 });
        setIsClockedIn(false);
        if (timerId) {
          clearInterval(timerId);
          setTimerId(null);
        }
      }

      // alert(response.data.message);
    } catch (error: any) {
      alert(
        "Failed to clock in/out: " +
        (error.response?.data?.error || error.message)
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Actions</h2>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-semibold">
              {format(time, "hh:mm:ss a")}
            </p>
            <p className="text-sm text-gray-500">
              {format(time, "EEE dd MMM yyyy")}
            </p>
          </div>
          <div
            className={`px-4 py-2 rounded-md border ${isClockedIn
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
              }`}
          >
            <span
              className={`text-sm font-medium ${isClockedIn ? "text-green-700" : "text-red-700"
                }`}
            >
              {isClockedIn ? "Present" : endTime ? "You were present" : "Not In Yet"}
            </span>
          </div>

        </div>
        <div className="space-y-4">
          <button
            onClick={handleClockInOut}
            className={`w-full py-2 px-4 rounded-md font-medium ${isClockedIn ? "bg-red-600 text-white hover:bg-red-700" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          >
            {isClockedIn ? "Clock Out" : "Clock In"}
          </button>
          {isClockedIn && (
            <div className="flex items-center justify-center text-gray-600 space-x-2">
              <Timer className="h-4 w-4" />
              <span>{`${workDuration.hours}h ${workDuration.minutes}m ${workDuration.seconds}s`}</span>
            </div>
          )}
          <button className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50">
            Half Day
          </button>
        </div>
      </div>
    </div>
  );
}
