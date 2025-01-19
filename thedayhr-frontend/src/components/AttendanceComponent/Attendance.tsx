// pages/UserProfile.tsx
import React, { useEffect, useState } from "react";
import { Clock, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { AttendanceStatsCard } from "./AttendanceStats";
import { ActionsCard } from "./ActionsCard";
import { LogsRequestsCard } from "./LogRequestsCard";

const Attendance: React.FC = () => {
    return(
        <main className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Attendance Dashboard
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AttendanceStatsCard />
                <ActionsCard />
                <LogsRequestsCard />
            </div>
        </div>
        </main>
    )
};

export default Attendance;