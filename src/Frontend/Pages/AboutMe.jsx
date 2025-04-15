import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  User,
  Calendar,
  MapPin,
  Hash,
  GraduationCap,
  Edit,
  Link,
  DollarSign,
  IndianRupee,
  CreditCard,
  UserCircle
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";

const ProfilePage = () => {
  const user = useSelector((state) => state.userData.user);

  return (
    <div className="min-h-screen  sm:px-16 px-6 sm:py-16 py-10">
      <div className="max-w-4xl mx-auto main">

        {/* Profile Card */}
        <div className="flex flex-col md:flex-row  overflow-hidden mb-6 gap-4 p-2">

          <div className="w-full md:w-1/2 p-6 flex md:flex-col flex-col gap-6 bg-blue-100 rounded-lg h-auto">

            {/* Avatar and Basic Info */}
            <div className="w-full flex items-center md:items-start gap-6">
              <div className="w-1/5 flex flex-col gap-2">
                <div className="size-16 rounded-full border-2 overflow-hidden flex justify-center items-center relative">
                  {user?.avatar ? (
                    <img
                      src={user?.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="size-3/4 text-blue-300" />
                  )}
                </div>
              </div>

              <div className="w-4/5">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-800 truncate">
                    {user?.name || "User"}
                  </h1>
                </div>
                <div className="flex justify-start text-left gap-2">
                  <p className="text-gray-600 text-sm mb-1 truncate">
                    {user?.description || "I am glad to be a part of Katlicherra Central School"}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-blue-500" />
                <span className="text-sm font-medium truncate text-black-300">{user?.contact || user?.phone || user?.parentContact || "987645335"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-blue-500" />
                <span className="text-sm font-medium truncate text-black-300">{user?.email || "Email"}</span>
              </div>
              {user?.role === "student" && (
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-blue-500" />
                  <span className="text-sm font-medium truncate text-black-300">{new Date(user?.dob).toLocaleDateString() || "DOB"}</span>
                </div>
              )}
              {user?.role === "student" && (
                <div className="flex items-center gap-2">
                  <CreditCard className="size-4 text-blue-500" />
                  <span className="text-sm font-medium truncate text-black-300">Aadhar: {user?.aadharId || "N/A"}</span>
                </div>
              )}
              {user?.role === "student" && (
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-blue-500" />
                  <span className="text-sm font-medium truncate text-black-300">{user?.address || "Address"}</span>
                </div>
              )}
              {user?.role === "student" && (
                <div className="flex items-center gap-2">
                  <UserCircle className="size-4 text-blue-500" />
                  <span className="text-sm font-medium truncate text-black-300">Gender: {user?.gender || "N/A"}</span>
                </div>
              )}

              {user?.salary && (
                <div className="flex items-center gap-2">
                  <IndianRupee className="size-4 text-blue-500" />
                  <span className="text-sm font-medium truncate text-black-300">{user.salary}</span>
                </div>
              )}
              {user?.yearsOfExperience && (
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-blue-500" />
                  <span className="text-sm font-medium truncate text-black-300">{user?.yearsOfExperience} years experience</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="w-full md:w-1/2 flex flex-wrap gap-4 mb-6">
            {(user.role === "student" || user.role === "teacher") && (
              <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-4 w-[calc(50%-8px)]">
                <div className="flex items-center gap-2">
                  <div className="w-14 h-8 bg-blue-100 rounded-full flex justify-center items-center">
                    <Hash className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-md md:text-lg font-black text-black">{user?.subjects?.length}</p>
                    <p className="text-xs md:text-sm text-black-200">Subjects</p>
                  </div>
                </div>
              </div>
            )}
            {user.role === "teacher" && (
              <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-4 w-[calc(50%-8px)]">
                <div className="flex items-center gap-2">
                  <div className="w-14 h-8 bg-blue-100 rounded-full flex justify-center items-center">
                    <User className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-md md:text-lg font-black text-black">Class 10 B</h3>
                    <p className="text-xs md:text-sm text-black-200">Class Teacher</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Grid Layout for Bottom Sections */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left and Middle Sections */}
          <div className="md:col-span-2">
            {/* Important Links Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl text-left font-bold text-black mb-2">
                Important Links
              </h2>
              <p className="text-sm text-left  text-black-300 mb-4">
                Here you can add important links
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-gray-600 rounded-full text-sm">
                  Teacher's Classes
                </span>
                <span className="px-3 py-1 bg-blue-100 text-gray-600 rounded-full text-sm">
                  Teacher's Subjects
                </span>
                <span className="px-3 py-1 bg-yellow-100 text-gray-600 rounded-full text-sm">
                  Teacher's Payment Status
                </span>
                <span className="px-3 py-1 bg-purple-100 text-gray-600 rounded-full text-sm">
                  Teacher's Salary Details
                </span>
                <span className="px-3 py-1 bg-green-100 text-gray-600 rounded-full text-sm">
                  Teacher's Qualification
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;