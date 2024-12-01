import {
    Search,
    Sun,
    Moon,
    ChevronDown,
    LogOut,
    Settings,
    Clock,
    CalendarDays,
    Wallet,
    BarChart3,
    ChevronRight,
    Building2,
    Mail,
    Phone,
    Briefcase,
    Users,
    Trophy,
    User,
    Bell,
    Menu,
} from "lucide-react";
import React, { useState } from "react";
import { render } from "react-dom";

interface NavigationItem {
    icon: React.ReactNode;
    label: string;
}

interface Experience {
    role: string;
    company: string;
    period: string;
}

interface TeamMember {
    name: string;
    role: string;
}

export default function HRMSDashboard() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] =
        useState<boolean>(false);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
    const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);
    const toggleProfileDropdown = () =>
        setIsProfileDropdownOpen(!isProfileDropdownOpen);

    const navigationItems: NavigationItem[] = [
        { icon: <Clock className="text-indigo-500" />, label: "Attendance" },
        { icon: <CalendarDays className="text-emerald-500" />, label: "Leave Management" },
        { icon: <Wallet className="text-orange-500" />, label: "Payroll" },
        { icon: <BarChart3 className="text-cyan-500" />, label: "Reports & Analytics" },
    ];

    const experienceTimeline: Experience[] = [
        { role: "HR Manager", company: "Current Company", period: "2022 - Present" },
        {
            role: "Senior HR Executive",
            company: "Previous Company",
            period: "2018 - 2022",
        },
        { role: "HR Executive", company: "First Company", period: "2015 - 2018" },
    ];

    const teamMembers: TeamMember[] = [
        { name: "Alice Smith", role: "HR Executive" },
        { name: "Bob Johnson", role: "HR Assistant" },
        { name: "Carol White", role: "Recruiter" },
        { name: "David Brown", role: "HR Coordinator" },
    ];

    const achievements: string[] = [
        "Employee of the Month - March 2023",
        "Best HR Initiative Award 2022",
        "Perfect Attendance 2023",
        "Leadership Excellence Award",
    ];

    return (
        <div
            className={`min-h-screen ${isDarkMode ? "dark bg-gray-900 text-white" : "bg-gray-50"
                }`}
        >
            

            {/* Main Content */}
            <main
                // className="pt-20 px-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {/* Company Information */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md  hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center space-x-2 mb-4">
                            <Building2 className="h-5 w-5 text-blue-500" />
                            <h2 className="text-xl font-semibold">Company Information</h2>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Department
                                </p>
                                <p>Human Resources</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Joining Date
                                </p>
                                <p>01 Jan 2022</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Reports To
                                </p>
                                <p>Sarah Johnson (HR Director)</p>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center space-x-2 mb-4">
                            <Users className="h-5 w-5 text-blue-500" />
                            <h2 className="text-xl font-semibold">Personal Information</h2>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Full Name
                                </p>
                                <p>John Michael Doe</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Date of Birth
                                </p>
                                <p>15 Mar 1985</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Gender
                                </p>
                                <p>Male</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center space-x-2 mb-4">
                            <Mail className="h-5 w-5" />
                            <h2 className="text-xl font-semibold">Contact Information</h2>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4" />
                                <p>+1 (555) 123-4567</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4" />
                                <p>john.doe@company.com</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Emergency Contact
                                </p>
                                <p>Jane Doe: +1 (555) 987-6543</p>
                            </div>
                        </div>
                    </div>

                    {/* Financial & Identity Details */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center space-x-2 mb-4">
                            <Wallet className="h-5 w-5 text-orange-500" />
                            <h2 className="text-xl font-semibold">
                                Financial & Identity Details
                            </h2>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Aadhaar Number
                                </p>
                                <p>XXXX-XXXX-1234</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    PAN Number
                                </p>
                                <p>ABCDE1234F</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Bank Name
                                </p>
                                <p>State Bank of India</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Account Number
                                </p>
                                <p>XXXXXXXX5678</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    IFSC Code
                                </p>
                                <p>SBIN0123456</p>
                            </div>
                        </div>
                    </div>

                    {/* Professional Summary */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center space-x-2 mb-4">
                            <Briefcase className="h-5 w-5" />
                            <h2 className="text-xl font-semibold">Professional Summary</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                            Experienced HR professional with over 8 years of expertise in
                            talent acquisition, employee relations, and performance
                            management. Proven track record in implementing successful HR
                            initiatives and fostering positive workplace culture.
                        </p>
                    </div>

                    {/* Experience Timeline */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center space-x-2 mb-4">
                            <Briefcase className="h-5 w-5 text-green-500" />
                            <h2 className="text-xl font-semibold">Experience Timeline</h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                {
                                    role: "HR Manager",
                                    company: "Current Company",
                                    period: "2022 - Present",
                                },
                                {
                                    role: "Senior HR Executive",
                                    company: "Previous Company",
                                    period: "2018 - 2022",
                                },
                                {
                                    role: "HR Executive",
                                    company: "First Company",
                                    period: "2015 - 2018",
                                },
                            ].map((exp, index) => (
                                <div key={index} className="flex items-start">
                                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                                    <div>
                                        <p className="font-medium">{exp.role}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {exp.company} • {exp.period}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Team Members */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center space-x-2 mb-4">
                            <Users className="h-5 w-5" />
                            <h2 className="text-xl font-semibold">Team Members</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                {
                                    name: "Alice Smith",
                                    role: "HR Executive",
                                },
                                {
                                    name: "Bob Johnson",
                                    role: "HR Assistant",
                                },
                                {
                                    name: "Carol White",
                                    role: "Recruiter",
                                },
                                {
                                    name: "David Brown",
                                    role: "HR Coordinator",
                                },
                            ].map((member, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <img
                                        src={`https://placehold.co/200x200`}
                                        alt={member.name}
                                        className="h-8 w-8 rounded-full"
                                    />
                                    <div>
                                        <p className="font-medium text-sm">{member.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {member.role}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Achievements */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center space-x-2 mb-4">
                            <Trophy className="h-5 w-5" />
                            <h2 className="text-xl font-semibold">Achievements</h2>
                        </div>
                        <ul className="space-y-3">
                            {[
                                "Employee of the Month - March 2023",
                                "Best HR Initiative Award 2022",
                                "Perfect Attendance 2023",
                                "Leadership Excellence Award",
                            ].map((achievement, index) => (
                                <li key={index} className="flex items-center space-x-2">
                                    <ChevronRight className="h-4 w-4 text-blue-500" />
                                    <span>{achievement}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}

render(<HRMSDashboard />, document.getElementById("root"));
