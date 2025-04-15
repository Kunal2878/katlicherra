import React from "react";
import {useState,useEffect} from 'react'
import {
  Phone,
  User,
  Calendar,
  School2,
  GraduationCap,
  IndianRupee,
  Mail,
  Book

} from "lucide-react";

const TeacherProfilePage = (TeacherData) => {
const [user, setUser] = useState([])
const [isLoading, setLoading] = useState(false)
useEffect(()=>{
setUser(TeacherData.TeacherData.TeacherData)
},[TeacherData])



  return (
 


    <div className="min-h-screen  sm:px-16 px-6 sm:py-16 py-10">
      <div className="max-w-4xl mx-auto main">

        {/* Profile Card */}
        <div className="flex flex-col md:flex-row  overflow-hidden mb-6 gap-4 p-2">

          <div className="w-full md:w-1/2 p-6 flex md:flex-col flex-col gap-6 bg-blue-100 rounded-lg h-60 md:h-72 ">

            {/* Avatar and Basic Info */}
            <div className="w-full flex items-center md:items-start gap-6">
            <div className="w-1/5 flex flex-col gap-2 ">
              <div className="size-16 rounded-full  border-2 overflow-hidden flex justify-center items-center relative">
                {user?.avatar ? (
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <GraduationCap className=" size-3/4 text-blue-300" />
                )}
              
              </div>
              </div>


              <div className="w-4/5">
                <div className="flex items-center gap-2">
                                  <h1 className="text-xl font-bold text-gray-800">
                                    {user?.name || "User"}
                                  </h1>
                                
                                </div>
                <div className="flex justify-start text-left gap-2">
                  <p className="text-gray-600 text-sm mb-1">
                    {user?.description || `Hi I am a teacher`}
                  </p>
                </div>
              </div>            
              </div>



       
              <div className="w-full p-6 flex md:flex-row flex-col gap-6 ">
            {/* Stats */}
            <div className=" flex flex-col justify-center w-full ">
              <div className="w-full flex flex-col gap-2 md:gap-4">

                
                <div className="flex items-center gap-2 w-full">
                  <Mail className="size-3 md:size-6 font-black text-black-300" />
                  <div>
                    <span className="text-sm md:text-md font-medium text-black-300">{user?.email || "@gmail.com"  }</span>
                  </div>
                </div> 
                <div className="flex items-center gap-2 w-full">
                  <Phone className="size-3 md:size-6 font-black text-black-300" />
                  <div>
                    <span className="text-sm md:text-md font-medium text-black-300">{user?.phoneNumber || "987645335"  }</span>
                  </div>
                </div> 
                <div className="flex items-center gap-2 w-full">
                  <IndianRupee className="size-3 md:size-6 font-black text-black-300" />
                  <div>
                    <span className="text-sm md:text-md font-medium text-black-300">{user?.salary || "Salary"  }</span>
                  </div>
                </div> 
                
                
                            
              </div>            
              </div>
          </div>

          </div>


            {/* Stats Section */}
            <div className="w-full md:w-1/2 flex flex-wrap gap-4 mb-6">
            

                <div className="bg-lamaPurpleLight p-3 rounded-lg shadow-md flex items-center gap-3 w-full md:w-[calc(75%-6px)] h-20">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-6 bg-blue-100 rounded-full flex justify-center items-center">
                      <Calendar className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-md md:text-lg font-black text-black ">{user?.attendance||"90%"}</p>
                      <p className="text-xs md:text-sm text-black-200">Attendance</p>
                    </div>
                  </div>
                </div>
            
                <div className="bg-lamaYellowLight px-4 py-3 rounded-lg shadow-md flex items-center gap-3 w-full md:w-[calc(75%-6px)] h-20">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-6 bg-blue-100 rounded-full flex justify-center items-center">
                      <School2 className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-md md:text-lg font-black text-black">{user.qualification || "Qualification"}</h3>
                      <p className="text-xs md:text-sm text-black-200">Qualification</p>
                    </div>
                  </div>
                </div>   
                {
                  user?.classTeacher &&(

                <div className="bg-lamaSkyLight px-4 py-3 rounded-lg shadow-md flex items-center gap-3 w-full md:w-[calc(75%-6px)] h-20">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-6 bg-blue-100 rounded-full flex justify-center items-center">
                      <User className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-md md:text-lg font-black text-black">{user.studentClass?.classTeacher.name || "Teacher"}</h3>
                      <p className="text-xs md:text-sm text-black-200">Class Teacher</p>
                    </div>
                  </div>
                </div>                     
                  )
                }                  
                                 </div>
        </div>

{/* Assigned Classes Section */}
<div className="w-full flex flex-wrap gap-4 mb-6">
  <h3 className="h3 text-black-300 text-left w-full text-lg font-bold">Assigned Classes</h3>
  {user?.assignedClasses?.map((classItem, index) => (
    <div 
      key={index}
      className={`px-4 py-3 rounded-lg shadow-md flex items-center gap-3 w-full sm:w-[calc(50%-8px)] h-20 
      ${index % 2 === 0 ? 'bg-lamaPurpleLight' : 'bg-lamaYellowLight'}`}
    >
      <div className="flex items-center gap-2">
        <div className="w-10 h-6 bg-blue-100 rounded-full flex justify-center items-center">
          <School2 className="w-4 h-4 text-blue-500" />
        </div>
        <div>
          <h3 className="text-md md:text-lg font-black text-black">{classItem?.className}</h3>
          <p className="text-xs md:text-sm text-black-200">Class</p>
        </div>
      </div>
    </div>
  ))}
</div>

{/* Subjects Section */}
<div className="w-full flex flex-wrap gap-4 mb-6">
  <h3 className="h3 text-black-300 text-left  w-full text-lg font-bold">Subjects</h3>
  {user?.subject?.map((subject, index) => (
    <div 
      key={index}
      className={`p-3 rounded-lg shadow-md flex items-center gap-3 w-full sm:w-[calc(50%-8px)] h-20 
      ${index % 2 === 0 ? 'bg-lamaSkyLight' : 'bg-lamaYellowLight'}`}
    >
      <div className="flex items-center gap-2">
        <div className="w-10 h-6 bg-blue-100 rounded-full flex justify-center items-center">
          <Book className="w-4 h-4 text-blue-500" />
        </div>
        <div>
          <h3 className="text-md md:text-lg font-black text-black">{subject?.name }</h3>
          <p className="text-xs md:text-sm text-black-200">Subject</p>
        </div>
      </div>
    </div>
  ))}
</div>







        {/* Grid Layout for Bottom Sections */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left and Middle Sections */}
          <div className="md:col-span-2">


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
                criteria: Feedback from Students
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
                      {user.rating||8.4}
                    </text>
                    <text
                      x="50"
                      y="65"
                      fontSize="8"
                      textAnchor="middle"
                      fill="#9CA3AF"
                    >
                      out of 10 
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfilePage;