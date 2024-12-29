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
    Edit,
    Trash2,
    X
} from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"
import { render } from "react-dom";
import apiClient from "../api/axiosInstance";

axios.defaults.withCredentials = true;

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

const HRMSDashboard: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState<CardData>({});
    const [fetchedKeys, setFetchedKeys] = useState<Record<string, boolean>>({});
    const [isNewEntry, setIsNewEntry] = useState(true);
    const [formData, setFormData] = useState<any>({});
    const [activeCard, setActiveCard] = useState<string | null>(null);
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
    interface Achievement {
        id: string;
        title: string;
        date_awarded: string;
        meta:{
            deleted:boolean;
        };
    }
    interface CardData {
        personalInfo?: {
            full_name: string;
            date_of_birth: string;
            gender: string;
        };
        contactInfo?: {
            mobile_number: string;
            email: string;
            emergency_contact: {
                name: string;
                number: string;
            };
        };
        companyInfo?: {
            department: string;
            joining_date: string;
            reports_to: {
                name: string;
                designation: string;
            };
        };
        professionalSummaryInfo?: {
            summary: string;
        };
        financialDetails?: {
            aadhaar_number: string;
            pan_number: string;
            bank_name: string;
            account_number: string;
            ifsc_code: string;
        };
        achievementsInfo?: Achievement[]; 
        meta?: {
            deletedAchievements: string;
        };
        [key: string]: any; // Allow other dynamic keys
    }
    
    // Lazy loading of card data
    const openModal = async (card: string, isAddingNew: boolean = false) => {
        setActiveCard(card);
        setIsModalOpen(true);
        console.log("data[card]: ",data[card])
        if (isAddingNew){
            // Clear form for new entry
            setFormData({});
            setIsNewEntry(true);
            return;
        } else {
            if (card === "achievementsInfo") {
                // Wrap data[card] inside an `achievementsInfo` key
                const achievementsInfoData = {
                    achievementsInfo: data[card] || [], // Use existing data or an empty array
                };
                setFormData(achievementsInfoData);
            } else {
                setFormData(data[card]);
            }
            setIsNewEntry(false);
        }
        setIsModalOpen(true);
    };

    // Save or update data
    const saveChanges = async () => {
        console.log('form data when saving:',formData)
        if (!activeCard) return;

        try {
            const endpointMap: Record<string, string> = {
                personalInfo: "http://localhost:8000/user-management/api/profile/personalInfo/",
                contactInfo: "http://localhost:8000/user-management/api/profile/contactInfo/",
                companyInfo: "http://localhost:8000/user-management/api/profile/companyInfo/",
                professionalSummaryInfo: "http://localhost:8000/user-management/api/profile/professionalSummaryInfo/",
                financialDetailsInfo: "http://localhost:8000/user-management/api/profile/financialDetailsInfo/",
                achievementsInfo: "http://localhost:8000/user-management/api/profile/achievementsInfo/",
            };

            // // Prepare payload
            const payload =
                activeCard === "achievementsInfo"
                    ? { achievementsInfo: formData.achievementsInfo || [], meta: formData.meta } // Send flat array if backend expects it
                    : formData;
            // Make a POST request to create or update the entry
            // console.log('payload: ',payload)
            await apiClient.post(endpointMap[activeCard], payload, { withCredentials: true });
            
            toast.success(`${activeCard.replace(/([A-Z])/g, " $1")} saved successfully!`);

            // setData((prev) => ({ ...prev, [activeCard]: activeCard === "achievementsInfo" ? payload : formData[activeCard],}));
            setData((prev) => ({ ...prev, [activeCard]: payload[activeCard] }));
            setIsModalOpen(false);
        } catch (error) {
            toast.error(`Failed to save ${activeCard.replace(/([A-Z])/g, " $1")}.`);
        }
    };

    const [experiences, setExperiences] = useState([
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
    ]);

    const [teamMembers, setTeamMembers] = useState([
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
    ]);

    const [achievements, setAchievements] = useState([
        "Employee of the Month - March 2023",
        "Best HR Initiative Award 2022",
        "Perfect Attendance 2023",
        "Leadership Excellence Award",
    ]);

    const handleAddExperience = () => {
        setExperiences([
            ...experiences,
            {
                role: "",
                company: "",
                period: "",
            },
        ]);
    };
    const handleAddTeamMember = () => {
        setTeamMembers([
            ...teamMembers,
            {
                name: "",
                role: "",
            },
        ]);
    };
    const handleDeleteExperience = (index: number) => {
        const newExperiences = experiences.filter((_, i) => i !== index);
        setExperiences(newExperiences);
    };
    const handleDeleteTeamMember = (index: number) => {
        const newTeamMembers = teamMembers.filter((_, i) => i !== index);
        setTeamMembers(newTeamMembers);
    };
    const handleAddAchievement = () => {
        setAchievements([...achievements, ""]);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setActiveCard("");
    };
    // Fetch data for a specific card
    const fetchCardData = async (key: string) => {
        if (fetchedKeys[key]) return; // Avoid multiple fetches for the same key
        setFetchedKeys((prev) => ({ ...prev, [key]: true })); // Mark key as fetched
        try {
        const response = await apiClient.get(`user-management/api/profile/${key}/`, {
            withCredentials: true,
        });
        console.log('response using fetchcarddata: ',response)
        setData((prev) => ({
            ...prev,
            [key]: response.data,
        }));
        } catch (error) {
        console.error(`Failed to fetch ${key} data:`, error);
        }
    };
    console.log('formData: ',formData)
    // Card Renderer
    const renderCard = (title: string, key: string, fields: Record<string, string>, maskFields?: Record<string, string>) => {
        const cardData = data[key];
        console.log('Rendering card with data:', cardData);
        // Fetch data only if not already fetched
        if (!cardData && !fetchedKeys[key]) {
            fetchCardData(key); // Trigger data fetch for this card
        }

        // Check if the card is for achievements
        if (key === "achievementsInfo") {
            // Handle achievements as a list
            const achievements = Array.isArray(cardData) ? cardData : [];
            console.log('achievements inside seperate key: ',achievements)

            return (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <Trophy className="h-5 w-5" />
                            <h2 className="text-xl font-semibold">{title}</h2>
                        </div>
                        {cardData && (
                            <button
                                onClick={() => openModal(key)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <Edit className="h-4 w-4 text-gray-500" />
                            </button>
                        )}
                    </div>
                    {/* List of Achievements */}
                    {achievements.length > 0 ? (
                        <ul className="space-y-3">
                            {achievements
                                .filter((achievement) =>!achievement.deleted)
                                .map((achievement, index) => (
                                    <li key={index} className="flex items-center space-x-2">
                                        <ChevronRight className="h-4 w-4 text-blue-500" />
                                        <div>
                                            <div>{achievement.title}</div>
                                            <div className="text-sm text-gray-500">{achievement.date_awarded}</div>
                                        </div>
                                    </li>
                            ))}
                    </ul>
                    ):(
                        <div>
                            <p className="text-sm text-gray-500">No {title.toLowerCase()} added yet.</p>
                            <button
                                onClick={() => openModal(key, true)}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                                >
                                Add {title}
                            </button>
                        </div>
                    )}
                    
                </div>
            );
        }

        return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-semibold">{title}</h2>
            </div>
            {cardData && (
                <button
                    onClick={() => openModal(key)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                    <Edit className="h-4 w-4 text-gray-500" />
                </button>
            )}
            </div>
            {/* Card Content */}
            {cardData ? (
                <div className="space-y-3">
                    {Object.entries(fields).map(([fieldKey, label]) => {
                        // Support nested properties
                        const value = fieldKey
                            .split(".")
                            .reduce((acc, curr) => acc?.[curr], cardData);
                                // : cardData[fieldKey];
                        // Apply masking if the field is in the maskFields list
                        const maskedValue = maskFields && maskFields[fieldKey]
                            ? maskData(value, maskFields[fieldKey])
                            : value;
                        return (
                            <div key={fieldKey}>
                                <p className="text-sm text-gray-500">{label}</p>
                                <p>{maskedValue || "Not available"}</p>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div>
                    <p className="text-sm text-gray-500">No {title.toLowerCase()} added yet.</p>
                    <button
                        onClick={() => openModal(key, true)}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                        Add {title}
                    </button>
                </div>
            )}
        </div>
        );
    };

    // Contact Information Fields
    const contactInfoFields = {
        mobile_number: "Mobile Number",
        email: "Email",
        "emergency_contact.name": "Emergency Contact Name",
        "emergency_contact.number": "Emergency Contact Number",
    };
    // Contact Information Fields
    const companyInfoFields = {
        department: "Mobile Number",
        joining_date: "Email",
        "reports_to.name": "Reports To (Name)",
        "reports_to.designation": "Reports To (Designation)",
    };
    const professionalSummaryFields = {
        summary: "Professional Summary"
    };
    // Utility function to mask sensitive data
    const maskData = (value: string, type: string): string => {
        if (!value) return "";

        switch (type) {
            case "aadhaarNumber":
                return value.replace(/\d{4}(?=\d{4})/g, "XXXX");
            case "panNumber":
                return value.replace(/.{5}(?=.{4})/g, "XXXXX");
            case "accountNumber":
                return value.replace(/\d(?=\d{4})/g, "X");
            case "ifscCode":
                return value; // No masking for IFSC Code
            default:
                return value; // Default behavior for non-sensitive fields
        }
    };

    const financialDetailsFields = {
        aadhaar_number: "Aadhaar Number",
        pan_number: "PAN Number",
        bank_name: "Bank Name",
        account_number: "Account Number",
        ifsc_code: "IFSC Code",
    };  
    const financialDetailsMaskedFields = {
        aadhaar_number: "aadhaarNumber",
        pan_number: "panNumber",
        account_number: "accountNumber",
    }  

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

                    {/* Company Information Card */}
                    {renderCard("Company Information", "companyInfo", companyInfoFields)}

                    {/* Personal Information Card */}
                    {renderCard("Personal Information", "personalInfo", {
                        full_name: "Full Name",
                        date_of_birth: "Date of Birth",
                        gender: "Gender",
                    })}

                    {/* Contact Information Card */}
                    {renderCard("Contact Information", "contactInfo", contactInfoFields)}

                    {/* Financial & Identity Details */}
                    {renderCard("Financial & Identity Details", "financialDetailsInfo", financialDetailsFields, financialDetailsMaskedFields)}

                    {/* Professional Summary */}
                    {renderCard("Professional Summary", "professionalSummaryInfo", professionalSummaryFields)}

                    {/* Experience Timeline */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <Briefcase className="h-5 w-5 text-green-500" />
                                <h2 className="text-xl font-semibold">Experience Timeline</h2>
                            </div>
                            <button
                                onClick={() => {
                                    setActiveCard("Experience Timeline");
                                    setIsModalOpen(true);
                                }}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <Edit className="h-4 w-4 text-gray-500" />
                            </button>
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
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <Users className="h-5 w-5" />
                                <h2 className="text-xl font-semibold">Team Members</h2>
                            </div>
                            <button
                                onClick={() => {
                                    setActiveCard("Team Members");
                                    setIsModalOpen(true);
                                }}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <Edit className="h-4 w-4 text-gray-500" />
                            </button>
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
                    {/* <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center justify-between  mb-4">
                            <div className="flex items-center space-x-2">
                                <Trophy className="h-5 w-5" />
                                <h2 className="text-xl font-semibold">Achievements</h2>
                            </div>
                            <button
                                onClick={() => {
                                    setActiveCard("Achievements");
                                    setIsModalOpen(true);
                                }}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <Edit className="h-4 w-4 text-gray-500" />
                            </button>
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
                    </div> */}
                    {renderCard("Achievements", "achievementsInfo", {
                        title: "Achievements", // Title for the field in the card
                        date_awarded: "Date Awarded" // The date_awarded label to display in the card (optional)
                    })}
                    
                    {/* Edit Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
                                {/* Modal Header */}
                                <div className="flex justify-between bg-blue-500 dark:bg-blue-600 p-4 rounded-t-lg">
                                    <h2 className="text-xl font-semibold text-white">
                                        {/* Edit {activeCard} */}
                                        {isNewEntry ? "Add" : "Edit"} {activeCard?.replace(/([A-Z])/g, " $1")}
                                    </h2>
                                    {/* Close Button */}
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="top-3 right-3 p-2 hover:bg-blue-600/70 rounded-full"
                                        aria-label="Close"
                                    >
                                        <X className="h-5 w-5 text-white" />
                                    </button>
                                </div>

                                {/* Modal Content - Scrollable */}
                                <div className="p-6 overflow-y-auto flex-1">

                                    {/* Company Information Modal Content */}
                                    {activeCard === "companyInfo" && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    Department
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.department}
                                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    Joining Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={formData.joining_date}
                                                    onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    Reports To (Name)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.reports_to?.name}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            reports_to: { ...formData.reports_to, name: e.target.value },
                                                        })
                                                    }
                                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    Reports To (Designation)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.reports_to?.designation}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            reports_to: { ...formData.reports_to, designation: e.target.value },
                                                        })
                                                    }
                                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Personal Information Modal Content */}
                                    {activeCard === "personalInfo" && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.full_name || ""}
                                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    Date of Birth
                                                </label>
                                                <input
                                                    type="date"
                                                    value={formData.date_of_birth || ""}
                                                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    Gender
                                                </label>
                                                <select
                                                    value={formData.gender || ""}
                                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    {/* Contact Information Modal Content */}
                                    {activeCard === "contactInfo" && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    Mobile Number
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.mobile_number || ""}
                                                    onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                                    />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                                    />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    Emergency Contact Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.emergency_contact?.name}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            emergency_contact: {
                                                                ...formData.emergency_contact,
                                                                name: e.target.value,
                                                            },
                                                        })
                                                    }
                                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                                    />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    Emergency Contact Phone
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.emergency_contact?.number}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            emergency_contact: {
                                                                ...formData.emergency_contact,
                                                                number: e.target.value,
                                                            },
                                                        })
                                                    }
                                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                                    />
                                            </div>
                                        </div>
                                    )}

                                    {/* Financial & Identity Details Modal Content */}
                                    {activeCard === "financialDetailsInfo" && (
                                        <div className="space-y-4">
                                            {Object.entries(financialDetailsFields).map(([fieldKey, label]) => {
                                                const isMasked = Object.keys(financialDetailsMaskedFields).includes(fieldKey);
                                                const value = formData[fieldKey as keyof typeof formData]; // Cast fieldKey
                                                return (
                                                    <div key={fieldKey}>
                                                        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                            {label}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={isMasked ? maskData(value as string, fieldKey) : value} // Apply maskData if needed
                                                            onChange={(e) =>
                                                                setFormData({
                                                                    ...formData,
                                                                    [fieldKey]: e.target.value,
                                                                })
                                                            }
                                                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Professional Summary Modal Content */}
                                    {activeCard === "professionalSummaryInfo" && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    Professional Summary
                                                </label>
                                                <textarea
                                                    value={formData.summary}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, summary: e.target.value })
                                                    }
                                                    rows={4}
                                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Experience Timeline Modal Content */}
                                    {activeCard === "Experience Timeline" && (
                                        <div className="space-y-4">
                                            {experiences.map((exp, index) => (
                                                <div
                                                    key={index}
                                                    className="p-4 border dark:border-gray-700 rounded-lg space-y-3"
                                                >
                                                    <div className="flex justify-end">
                                                        <button
                                                            onClick={() => handleDeleteExperience(index)}
                                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                            Role
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={exp.role}
                                                            onChange={(e) => {
                                                                const newExperiences = [...experiences];
                                                                newExperiences[index].role = e.target.value;
                                                                setExperiences(newExperiences);
                                                            }}
                                                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                            Company
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={exp.company}
                                                            onChange={(e) => {
                                                                const newExperiences = [...experiences];
                                                                newExperiences[index].company = e.target.value;
                                                                setExperiences(newExperiences);
                                                            }}
                                                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                            Period
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={exp.period}
                                                            onChange={(e) => {
                                                                const newExperiences = [...experiences];
                                                                newExperiences[index].period = e.target.value;
                                                                setExperiences(newExperiences);
                                                            }}
                                                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                onClick={handleAddExperience}
                                                className="w-full p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                                            >
                                                + Add Experience
                                            </button>
                                        </div>
                                    )}

                                    {/* Team Members Modal Content */}
                                    {activeCard === "Team Members" && (
                                        <div className="space-y-4">
                                            {teamMembers.map((member, index) => (
                                                <div
                                                    key={index}
                                                    className="p-4 border dark:border-gray-700 rounded-lg space-y-3"
                                                >
                                                    <div className="flex justify-end">
                                                        <button
                                                            onClick={() => handleDeleteTeamMember(index)}
                                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center space-x-4">
                                                        <img
                                                            src={`https://placehold.co/200x200`}
                                                            alt={member.name}
                                                            className="h-12 w-12 rounded-full"
                                                        />
                                                        <div className="flex-1 space-y-3">
                                                            <div>
                                                                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                                    Name
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={member.name}
                                                                    onChange={(e) => {
                                                                        const newTeamMembers = [...teamMembers];
                                                                        newTeamMembers[index].name = e.target.value;
                                                                        setTeamMembers(newTeamMembers);
                                                                    }}
                                                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                                    Role
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={member.role}
                                                                    onChange={(e) => {
                                                                        const newTeamMembers = [...teamMembers];
                                                                        newTeamMembers[index].role = e.target.value;
                                                                        setTeamMembers(newTeamMembers);
                                                                    }}
                                                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                onClick={handleAddTeamMember}
                                                className="w-full p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                                            >
                                                + Add Team Member
                                            </button>
                                        </div>
                                    )}

                                    {/* Achievements Modal Content */}
                                    {activeCard === "achievementsInfo" && (
                                        <div className="space-y-4">
                                            {(formData.achievementsInfo || []).map((achievement: { id:number; title: string; date_awarded: string }, index: number) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    {/* Title Input */}
                                                    <input
                                                        type="text"
                                                        value={achievement.title}
                                                        onChange={(e) => {
                                                            const updatedAchievements = [...(formData.achievementsInfo || [])];
                                                            updatedAchievements[index].title = e.target.value;
                                                            setFormData({ ...formData, achievementsInfo: updatedAchievements });
                                                        }}
                                                        className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                                    />
                                                    {/* Date Awarded Input */}
                                                    <input
                                                        type="date"
                                                        value={achievement.date_awarded}
                                                        onChange={(e) => {
                                                            const updatedAchievements = [...(formData.achievementsInfo || [])];
                                                            updatedAchievements[index].date_awarded = e.target.value;
                                                            setFormData({ ...formData, achievementsInfo: updatedAchievements });
                                                        }}
                                                        className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                                    />
                                                    {/* Remove Button */}
                                                    <button
                                                        // onClick={() => {
                                                        //     const updatedAchievements = (formData.achievementsInfo || []).map((achievement:Achievement, i:number) => {
                                                        //         if (i === index) {
                                                        //             // Mark the achievement as deleted by setting `deleted: true`
                                                        //             return { id: achievement.id, deleted: true };
                                                        //         }
                                                        //         return achievement;
                                                        //     });
                                                        //     setFormData({ ...formData, achievementsInfo: updatedAchievements });
                                                        // }}
                                                        onClick={() => {
                                                            const updatedAchievementsInfo: Achievement[] = []; // Explicitly set the type
                                                            const updatedDeletedIds: string[] = [...(formData.meta?.deletedAchievements || [])];
                                                        
                                                            (formData.achievementsInfo || []).forEach((achievement: Achievement, i: number) => {
                                                                if (i === index) {
                                                                    // Add the deleted achievement ID to the `meta` field
                                                                    updatedDeletedIds.push(achievement.id);
                                                                } else {
                                                                    // Keep non-deleted achievements in the main list
                                                                    updatedAchievementsInfo.push(achievement);
                                                                }
                                                            });
                                                        
                                                            // Update the state with the modified data structure
                                                            setFormData({
                                                                ...formData,
                                                                achievementsInfo: updatedAchievementsInfo,
                                                                meta: { ...formData.meta, deletedAchievements: updatedDeletedIds },
                                                            });
                                                        }}
                                                        
                                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            {/* Add Achievement Button */}
                                            <button
                                                onClick={() => {
                                                    const newAchievement = {id:"", title: "", date_awarded: "" };
                                                    const updatedAchievements = [...(formData.achievementsInfo || []).map((a:Achievement) => ({ ...a })), newAchievement];
                                                    setFormData({ ...formData, achievementsInfo: updatedAchievements });
                                                }}  
                                                className="w-full p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                                            > 
                                                + Add Achievement
                                            </button>
                                        </div>
                                    )}

                                </div>

                                {/* Modal Footer */}
                                <div className="p-4 border-t dark:border-gray-700">
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            onClick={handleCloseModal}
                                            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={saveChanges}
                                            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                                        >
                                            {/* Save Changes */}
                                            {isNewEntry ? "Save" : "Update"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default HRMSDashboard;
