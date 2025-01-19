import React, { useState, useEffect } from "react";
import apiClient from "../../api/axiosInstance";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Default theme

export function AttendanceStatsCard() {
  const [timeRange, setTimeRange] = useState("Last Week");
  const [isCustomRangeVisible, setCustomRangeVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [averageHours, setAverageHours] = useState("0:00:00");
  const [totalDays, setTotalDays] = useState(0);

  const fetchStats = async (start: Date, end: Date) => {
    try {
      console.log(start)
      const response = await apiClient.get("attendance/stats/", {
        params: {
          start_date: start.toLocaleDateString("en-CA"),
          end_date: end.toLocaleDateString("en-CA"),
        },
        withCredentials: true,
      });
      const avgHoursData = response.data.avg_hours_per_day;
      const formattedAvgHours = avgHoursData
      ? `${avgHoursData.hours}h ${avgHoursData.minutes}m`
      : "0h 0m";
      setAverageHours(formattedAvgHours);
      setTotalDays(response.data.total_days);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const getLastMonthRange = () => {
    const now = new Date();
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    console.log("firstDayLastMonth: ",firstDayLastMonth)
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    return { start: firstDayLastMonth, end: lastDayLastMonth };
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    if (range === "Last Month") {
      const { start, end } = getLastMonthRange();
      fetchStats(start, end);
    } else if (range === "Last Week") {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 7);
      fetchStats(start, end);
    } else if (range === "Custom Range") {
      setCustomRangeVisible(true);
    }
  };

  const handleRangeChange = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setSelectedRange({ ...selectedRange, startDate, endDate });
  };

  const applyCustomRange = () => {
    fetchStats(selectedRange.startDate, selectedRange.endDate);
    setCustomRangeVisible(false);
  };


  useEffect(() => {
    handleTimeRangeChange("Last Week"); // Default fetch
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Attendance Stats
        </h2>
        <select
          value={timeRange}
          onChange={(e) => handleTimeRangeChange(e.target.value)}
          className="border rounded-md px-3 py-1.5"
        >
          <option>Last Week</option>
          <option>Last Month</option>
          <option>Custom Range</option>
        </select>
      </div>
      {isCustomRangeVisible && (
        <div className="absolute top-16 left-0 bg-white shadow-lg border rounded-md p-4 z-50">
          <DateRangePicker
            ranges={[selectedRange]}
            onChange={handleRangeChange}
            showMonthAndYearPickers={false}
            rangeColors={["#4CAF50"]}
            months={2}
            direction="horizontal"
            className="z-50"
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={applyCustomRange}
              className="bg-blue-600 text-white px-4 py-2 rounded-md mr-2"
            >
              Apply
            </button>
            <button
              onClick={() => setCustomRangeVisible(false)}
              className="bg-gray-200 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="flex items-center space-x-4">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="User avatar"
          className="h-12 w-12 rounded-full"
        />
        <div>
          <p className="text-sm font-medium text-gray-900">Me</p>
          <p className="text-sm text-gray-500">Average Hours/Day: {averageHours}</p>
          <p className="text-sm text-gray-500">Total Days: {totalDays}</p>
        </div>
      </div>
    </div>
  );
}
