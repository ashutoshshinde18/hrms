import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Users,
    Building2,
    Clock,
    Briefcase,
    Heart,
    UserCircle,
    CreditCard,
    Building,
    Landmark,
  } from "lucide-react";
  import React from "react";
  
  const UserProfile: React.FC = () => {
    return (
      <main className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg">
          {/* Profile Header */}
          <div className="mb-8 flex flex-col items-center border-b border-gray-200 pb-8 text-center">
            <div className="mb-4">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                alt="Profile photo"
                className="h-32 w-32 rounded-full object-cover ring-4 ring-gray-100"
              />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Sarah Johnson</h1>
            <p className="mb-2 text-lg text-gray-600">Senior Product Manager</p>
            <p className="text-sm text-gray-500">Employee ID: EMP-2024-0123</p>
          </div>
  
          {/* Information Grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Personal Information */}
            <section className="rounded-lg border border-gray-100 p-6 transition-shadow hover:shadow-md">
              <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
                <User className="mr-2 h-5 w-5 text-gray-500" />
                Personal Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="text-gray-700">15 March 1988</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Heart className="mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="text-gray-700">Female</p>
                  </div>
                </div>
              </div>
            </section>
  
            {/* Contact Information */}
            <section className="rounded-lg border border-gray-100 p-6 transition-shadow hover:shadow-md">
              <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
                <Phone className="mr-2 h-5 w-5 text-gray-500" />
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-700">sarah.johnson@company.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-700">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-gray-700">
                      123 Business Avenue, Suite 400, San Francisco, CA 94107
                    </p>
                  </div>
                </div>
              </div>
            </section>
  
            {/* Job Details */}
            <section className="md:col-span-2 rounded-lg border border-gray-100 p-6 transition-shadow hover:shadow-md">
              <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
                <Briefcase className="mr-2 h-5 w-5 text-gray-500" />
                Job Details
              </h2>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex items-center">
                  <Building2 className="mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="text-gray-700">Product Management</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Join Date</p>
                    <p className="text-gray-700">1 June 2020</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <UserCircle className="mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Reports To</p>
                    <p className="text-gray-700">Michael Scott</p>
                  </div>
                </div>
              </div>
            </section>
  
            {/* Financial & Identity Details */}
            <section className="md:col-span-2 rounded-lg border border-gray-100 p-6 transition-shadow hover:shadow-md">
              <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
                <CreditCard className="mr-2 h-5 w-5 text-gray-500" />
                Financial & Identity Details
              </h2>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex items-center">
                  <CreditCard className="mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Aadhar Card Number</p>
                    <p className="text-gray-700">1234 5678 9012</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CreditCard className="mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">PAN Card Number</p>
                    <p className="text-gray-700">ABCDE1234F</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Building className="mr-3 h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Bank Name</p>
                      <p className="text-gray-700">State Bank of India</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Landmark className="mr-3 h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Account Number</p>
                      <p className="text-gray-700">1234567890</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Building2 className="mr-3 h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">IFSC Code</p>
                      <p className="text-gray-700">SBIN0001234</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    );
  };
  
  export default UserProfile;
  