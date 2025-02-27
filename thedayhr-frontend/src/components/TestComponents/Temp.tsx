export {}
// const [currentTime, setCurrentTime] = useState(new Date());
//     const [isClockedIn, setIsClockedIn] = useState(false);
//     const [activeTab, setActiveTab] = useState("attendance");
//     useEffect(() => {
//         const timer = setInterval(() => {
//             setCurrentTime(new Date());
//         }, 1000);
//         return () => clearInterval(timer);
//     }, []);
//     return (
//         <main className="min-h-screen w-full bg-gray-50 p-4 md:p-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
//                 <div className="bg-white rounded-lg shadow-sm p-6">
//                     <div className="flex justify-between items-center mb-6">
//                         <h2 className="text-xl font-semibold">Attendance Stats</h2>
//                         <select className="border rounded-md px-3 py-1.5">
//                             <option>Last Week</option>
//                             <option>Last Month</option>
//                             <option>Custom Range</option>
//                         </select>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                         <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
//                             <User className="w-6 h-6 text-gray-600" />
//                         </div>
//                         <div>
//                             <h3 className="font-medium">Me</h3>
//                             <p className="text-gray-600">Average Hours/Day: 8h 39m</p>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="bg-white rounded-lg shadow-sm p-6">
//                     <h2 className="text-xl font-semibold mb-6">Actions</h2>
//                     <div className="flex flex-col space-y-6">
//                         <div className="text-center">
//                             <div className="text-3xl font-medium mb-2">
//                                 {format(currentTime, "hh:mm:ss a")}
//                             </div>
//                             <div className="text-gray-600">
//                                 {format(currentTime, "EEE dd MMM yyyy")}
//                             </div>
//                         </div>
//                         <div className="flex flex-col sm:flex-row gap-4">
//                             <button
//                                 onClick={() => setIsClockedIn(!isClockedIn)}
//                                 className={`flex-1 py-2 px-4 rounded-md font-medium ${isClockedIn ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
//                             >
//                                 {isClockedIn ? "Clock Out" : "Clock In"}
//                             </button>
//                             <button className="flex-1 py-2 px-4 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
//                                 Partial/Half Day
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
//                     <h2 className="text-xl font-semibold mb-6">Logs & Requests</h2>
//                     <div className="border-b border-gray-200 mb-6">
//                         <div className="flex space-x-6">
//                             <button
//                                 onClick={() => setActiveTab("attendance")}
//                                 className={`pb-3 px-1 ${activeTab === "attendance" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
//                             >
//                                 Attendance Log
//                             </button>
//                             <button
//                                 onClick={() => setActiveTab("requests")}
//                                 className={`pb-3 px-1 ${activeTab === "requests" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
//                             >
//                                 Requests
//                             </button>
//                         </div>
//                     </div>
//                     {activeTab === "attendance" && (
//                         <div>
//                             <div className="flex justify-between items-center mb-6">
//                                 <h3 className="text-gray-600">Last 30 Days</h3>
//                                 <div className="flex space-x-2">
//                                     <button className="px-3 py-1 rounded-md bg-blue-50 text-blue-600">
//                                         30 Days
//                                     </button>
//                                     <button className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-50">
//                                         Dec
//                                     </button>
//                                     <button className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-50">
//                                         Nov
//                                     </button>
//                                 </div>
//                             </div>
//                             <div className="overflow-x-auto">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                     <thead>
//                                         <tr>
//                                             <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
//                                                 Date
//                                             </th>
//                                             <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
//                                                 Hours
//                                             </th>
//                                             <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
//                                                 Location
//                                             </th>
//                                             <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
//                                                 Clock In
//                                             </th>
//                                             <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
//                                                 Clock Out
//                                             </th>
//                                             <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
//                                                 Duration
//                                             </th>
//                                             <th className="px-4 py-3 text-left text-sm font-medium text-gray-500"></th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-gray-200">
//                                         <tr>
//                                             <td className="px-4 py-3 text-sm">Jan 03, Fri</td>
//                                             <td className="px-4 py-3">
//                                                 <div className="w-32 h-2 bg-blue-100 rounded-full">
//                                                     <div className="w-3/4 h-full bg-blue-500 rounded-full"></div>
//                                                 </div>
//                                             </td>
//                                             <td className="px-4 py-3 text-sm">Office</td>
//                                             <td className="px-4 py-3 text-sm">09:00 AM</td>
//                                             <td className="px-4 py-3 text-sm">06:00 PM</td>
//                                             <td className="px-4 py-3 text-sm">9h 00m</td>
//                                             <td className="px-4 py-3 text-sm">
//                                                 <button className="text-blue-600 hover:text-blue-700">
//                                                     Regularize
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </main>
//     );