import React from "react";
import {
  Phone,
  Mail,
  Home,
  Briefcase,
  User,
  Calendar,
  MapPin,
  Hash,
  GraduationCap,
  Edit,
  Link,
  DollarSign,
  IndianRupee
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";

const ProfilePage = () => {
  const user = useSelector((state) => state.userData.user);

  return (
    <div className="min-h-screen  sm:px-16 px-6 sm:py-16 py-10">
      <div className="max-w-4xl mx-auto main">

        {/* Profile Card */}
        <div className="flex flex-col md:flex-row  overflow-hidden mb-6 gap-4 p-2">

          <div className="w-full md:w-1/2 p-6 flex md:flex-col flex-col gap-6 bg-blue-100">

            {/* Avatar and Basic Info */}
            <div className="w-full flex items-center md:items-start gap-6">
            <div className="w-1/5 flex flex-col gap-2 ">
              <div className="size-16 rounded-full bg-white border-2 border-blue-200 overflow-hidden flex justify-center items-center relative">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className=" size-full text-blue-300" />
                )}
                <div className="absolute bottom-0 right-0 bg-yellow-400 p-1 rounded-full">
                  <Edit className="w-3 h-3 text-white" />
                </div>
              </div>
              </div>


              <div className="w-4/5">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-800">
                    {user?.name || "User"}
                  </h1>
                  <Edit className="w-4 h-4 text-yellow-500" />
                </div>
                <div className="flex justify-start text-left gap-2">
                  <p className="text-gray-600 text-sm mb-1">
                    {user.description || "I am glad to be a part of Katlicherra Central School"}
                  </p>
                </div>
              </div>            </div>



          <div className="w-full p-6 flex md:flex-row flex-col gap-6 ">
            {/* Stats */}
            <div className="md:ml-auto flex flex-col justify-center w-full">
              <div className="w-full grid grid-cols-2 gap-2 md:gap-4">

                {user?.salary && (
                  <div className="flex items-center gap-2 w-full md:w-1/2 ">
                    <IndianRupee  className="size-4 md:size-6 text-black" />
                    <div>
                      <span className="text-sm md:text-md font-medium text-black-300">{user.salary}</span>
                    </div>
                  </div>
                )}
                
                {user?.yearsOfExperience && (
                  <div className="flex items-center gap-2 w-full md:w-1/2">
                    <Calendar  className="size-4 md:size-6 font-black text-black" />
                    <div>
                      <span className="text-sm md:text-md font-medium text-black-300">{user.yearsOfExperience}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2 w-full ">
                  <Phone className="size-4 md:size-6 font-black text-black" />
                  <div>
                    <span className="text-sm md:text-md font-medium text-black-300">{user?.contact || user?.phone ||user?.parentContact || "987645335"  }</span>
                  </div>
                </div>               
              </div>
            </div>
          </div>

          </div>


            {/* Stats Section */}
            <div className="w-full md:w-1/2 flex flex-wrap gap-4 mb-6">
            
              {(user.role === "student" || user.role === "teacher") && (
                <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-4 w-[calc(50%-8px)]">
                  <div className="flex items-center gap-2">
                    <div className="w-14 h-8 bg-blue-100 rounded-full flex justify-center items-center">
                      <Calendar className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-md md:text-lg font-black text-black ">90%</p>
                      <p className="text-xs md:text-sm text-black-200">Attendance</p>
                    </div>
                  </div>
                </div>
              )}

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
              )}            </div>

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

            {/* Performance Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-black">
                  Performance
                </h2>
                <div className="text-gray-400">
                  {/* Three dots menu */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-left text-sm text-black-300 mb-6">
                criteria: student feedback
              </p>
              <div className="flex justify-center items-center">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e6f7ff"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="10"
                      strokeDasharray="283"
                      strokeDashoffset="28"
                      transform="rotate(-90 50 50)"
                    />
                    <text
                      x="50"
                      y="50"
                      fontSize="20"
                      textAnchor="middle"
                      fill="#111827"
                      fontWeight="bold"
                    >
                      9.2
                    </text>
                    <text
                      x="50"
                      y="65"
                      fontSize="8"
                      textAnchor="middle"
                      fill="#9CA3AF"
                    >
                      out of 10 marks
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Class Information */}
          <div>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;