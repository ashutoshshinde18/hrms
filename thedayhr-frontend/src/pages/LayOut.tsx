import {
    Search,
    ChevronDown,
    LogOut,
    Settings,
    Clock,
    CalendarDays,
    Wallet,
    BarChart3,
    User,
    Bell,
    Menu,
    Lock,
    AlertCircle
} from "lucide-react";

import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUserContext } from "./UserContext";

interface NavigationItem {
    icon: React.ReactNode;
    label: string;
    path: string;
}

const Layout: React.FC = () => {
    const  { email, message, logout } = useUserContext();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
    const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const navigationItems: NavigationItem[] = [
        { icon: <Clock className="text-indigo-500" />, label: "Attendance", path: "/attendance" },
        { icon: <CalendarDays className="text-emerald-500" />, label: "Leave Management", path: "/leave-management" },
        { icon: <Wallet className="text-orange-500" />, label: "Payroll", path: "/payroll" },
        { icon: <BarChart3 className="text-cyan-500" />, label: "Reports & Analytics", path: "/reports-analytics" },
    ];
    const handleProfileClick = () => {
        navigate("/user-profile"); // Redirects to the HRMSDashboard page
        setIsDropdownOpen(false); // Close the dropdown
    };
    return (
        <div
            className={`min-h-screen ${isDarkMode ? "dark bg-gray-900 text-white" : "bg-gray-50"
                }`}
        >
            {/* Top Navbar */}
            <nav className="fixed w-full h-16 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 z-50 px-4">
                <div className="h-full flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <button onClick={toggleSidebar} className="lg:hidden">
                            <Menu className="h-6 w-6" />
                        </button>
                        <img
                            src="https://placehold.co/120x40"
                            alt="Company Logo"
                            className="h-8"
                        />
                        <img
                            src="https://placehold.co/40x40"
                            alt="Client Logo"
                            className="h-8 rounded-full"
                        />
                        <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 rounded-full border border-gray-300 dark:border-gray-600 px-3 py-2">
                            <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-transparent border-none focus:outline-none ml-2 w-80"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button
                                onClick={toggleDropdown}
                                className="flex items-center space-x-3 rounded-lg px-2 py-1.5 transition-all hover:bg-gray-100"
                            >
                                <img
                                    src="https://randomuser.me/api/portraits/men/32.jpg"
                                    alt="Profile"
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                                <ChevronDown
                                    className={`h-4 w-4 text-gray-600 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {/* Dropdown Modal */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 origin-top-right animate-dropdown rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                                    <div className="border-b border-gray-100 px-4 py-3">
                                        <p className="text-sm font-medium">John Doe</p>
                                        <p className="text-xs text-gray-500">john.doe@company.com</p>
                                    </div>
                                    <button onClick={handleProfileClick} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </button>
                                    <a className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                        <Bell className="mr-2 h-4 w-4" />
                                        Notifications
                                    </a>
                                    <a className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                        <Lock className="mr-2 h-4 w-4" />
                                        Change Password
                                    </a>
                                    <a className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </a>
                                    <a className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                        <AlertCircle className="mr-2 h-4 w-4" />
                                        Report an Issue
                                    </a>
                                    <button onClick={logout} className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 ${isSidebarExpanded ? "w-64" : "w-20"} ${!isSidebarExpanded && "items-center"} z-40 border-r border-gray-300 dark:border-gray-700`}
            >
                <nav className="p-4 space-y-2">
                    {navigationItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={()=> navigate(item.path)}
                            className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {item.icon}
                            <span className={`ml-3 ${!isSidebarExpanded && "hidden"}`}>
                                {item.label}
                            </span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className={`pt-20 ${isSidebarExpanded ? "ml-64" : "ml-20"} transition-all duration-300 p-6`}>
                <Outlet />
            </main>

            </div>
    );
};

export default Layout;