import React, { useState } from "react";
import { render } from "react-dom";
import {
  Calendar,
  Mail,
  Phone,
  MapPin,
  Building2,
  ChevronDown,
  Sun,
  Moon,
  ChevronRight,
  User,
  Award,
  TrendingUp,
  Users,
  Target,
  Briefcase,
} from "lucide-react";  // Import necessary icons

interface Skill {
  name: string;
  progress: number;
}

interface Metric {
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface Project {
  name: string;
  progress: number;
  team: number;
}

interface TeamMember {
  name: string;
  role: string;
}

export default function ProfileSection() {
  const [isDark, setIsDark] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const skills: Skill[] = [
    { name: "UI Design", progress: 95 },
    { name: "UX Research", progress: 85 },
    { name: "Prototyping", progress: 90 },
    { name: "Design Systems", progress: 88 },
    { name: "User Testing", progress: 82 },
  ];

  const metrics: Metric[] = [
    { label: "Projects", value: "24", icon: Briefcase as React.ComponentType<{ size?: number; className?: string }>},
    { label: "Performance", value: "96%", icon: TrendingUp  as React.ComponentType<{ size?: number; className?: string }>,},
    { label: "Team Size", value: "12", icon: Users  as React.ComponentType<{ size?: number; className?: string }>,},
    { label: "Goals Met", value: "89%", icon: Target  as React.ComponentType<{ size?: number; className?: string }>,},
  ];

  const projects: Project[] = [
    { name: "Design System 2.0", progress: 75, team: 6 },
    { name: "Mobile App Redesign", progress: 45, team: 4 },
    { name: "Web Platform Update", progress: 90, team: 8 },
  ];

  const achievements: string[] = [
    "Design Excellence Award 2023",
    "Best Team Lead Q2 2023",
    "Innovation Champion",
    "Top Performer 2022",
  ];

  const teamMembers: TeamMember[] = [
    { name: "Alex Kim", role: "UI Designer" },
    { name: "Maria Garcia", role: "UX Researcher" },
    { name: "James Wilson", role: "Product Designer" },
    { name: "Lisa Chen", role: "Visual Designer" },
  ];

  return (
    <div className={`min-h-screen ${isDark ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <span>HRMS</span>
            <ChevronRight size={16} />
            <span>Employee</span>
            <ChevronRight size={16} />
            <span className="text-blue-600 dark:text-blue-400">Profile</span>
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 lg:p-8">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg transform transition group-hover:scale-105">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <h1 className="mt-4 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Sarah Anderson
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 font-medium mt-1">
                    Senior Product Designer
                  </p>
                  <div className="flex items-center mt-2 text-gray-500 dark:text-gray-400">
                    <Building2 size={16} className="mr-1" />
                    <span>Design Department</span>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4 dark:text-white">Skills</h2>
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium dark:text-gray-300">
                          {skill.name}
                        </span>
                        <span className="text-sm text-blue-600 dark:text-blue-400">
                          {skill.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${skill.progress}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Members */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4 dark:text-white">Team Members</h2>
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div
                      key={member.name}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <User size={20} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium dark:text-white">{member.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-9 space-y-8">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {metrics.map((metric) => (
                <div key={metric.label} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <metric.icon className="text-blue-600 dark:text-blue-400" size={24} />
                    <span className="text-2xl font-bold dark:text-white">{metric.value}</span>
                  </div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">{metric.label}</p>
                </div>
              ))}
            </div>

            {/* Current Projects */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-6 dark:text-white">Current Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div
                    key={project.name}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <h3 className="font-medium dark:text-white">{project.name}</h3>
                    <div className="mt-2 mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500 dark:text-gray-400">Progress</span>
                        <span className="text-blue-600 dark:text-blue-400">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${project.progress}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Users size={16} className="mr-1" />
                      <span>{project.team} team members</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-6 dark:text-white">Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                  >
                    <Award className="text-blue-600 dark:text-blue-400" />
                    <span className="font-medium dark:text-white">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-6 dark:text-white">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="mailto:sarah@example.com"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Mail className="text-blue-600 dark:text-blue-400" />
                  <span className="dark:text-white">sarah@example.com</span>
                </a>
                <a
                  href="tel:+1234567890"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Phone className="text-blue-600 dark:text-blue-400" />
                  <span className="dark:text-white">+1 (234) 567-890</span>
                </a>
                <div className="flex items-center space-x-3 p-3 rounded-lg">
                  <MapPin className="text-blue-600 dark:text-blue-400" />
                  <span className="dark:text-white">San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

