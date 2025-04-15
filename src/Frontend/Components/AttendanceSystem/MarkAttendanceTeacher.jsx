// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Calendar, Save, CheckCircle, XCircle, Filter } from "lucide-react";
// import{GetAllTeacher,GetAllTeachers,GetTeacherAttendance,MarkTeacherAttendance} from '../../Route'
// import {useSelector,useDispatch} from 'react-redux'
// import {setTeacherAttendanceData} from '../../../Store/slice'
// import Cookies from "js-cookie";
// const TeacherAttendanceSystem = () => {
//   const dispatch = useDispatch()
//   const attendanceHistory = useSelector((state) => state.userData.TeacherAttendanceData);
//   const [teachers, setTeachers] = useState([]);
//   const [selectedTeacher, setSelectedTeacher] = useState("");
//   const [selectedDate, setSelectedDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );
//   const [attendanceStatus, setAttendanceStatus] = useState("");
//   // const [attendanceHistory, setAttendanceHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [viewMode, setViewMode] = useState("mark"); // "mark" or "history"
//   const url = import.meta.env.VITE_API_BASE_URL;
//   const token = Cookies.get("token");
//   useEffect(() => {
//     fetchTeachers();
//   }, []);

//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => {
//         setMessage("");
//       }, 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   useEffect(() => {
//     if (selectedTeacher && viewMode === "history" && startDate && endDate) {
//       fetchAttendanceHistory();
//     }
//   }, [selectedTeacher, startDate, endDate, viewMode]);

//   const fetchTeachers = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${url}${GetAllTeachers}`); // Adjust the endpoint as needed
//       setTeachers(response.data.data.teachers);
//     } catch (error) {
//       console.error("Error fetching teachers:", error);
//       setMessage(error?.response?.data?.message|| "Network Error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAttendanceHistory = async () => {
//     if (!selectedTeacher || !startDate || !endDate) {
//       setMessage("Please select a teacher and date range");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `${url}${GetTeacherAttendance}/:${selectedTeacher}?startDate=${startDate}=&endDate=${endDate}=`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
//       dispatch(setTeacherAttendanceData(response.data.data))
//       // setAttendanceHistory(response.data.data);
//     } catch (error) {
//       dispatch(setTeacherAttendanceData([]))
//       console.error("Error fetching attendance history:", error);
//       setMessage(error.response.data.message||error?.message);
//       if (error.status === 401) {  
//         Cookies.remove('user');
//         Cookies.remove('token');
//         window.location.href = '/user-options';                      
//       }
     
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTeacherChange = (e) => {
//     setSelectedTeacher(e.target.value);
//   };

//   const handleDateChange = (e) => {
//     setSelectedDate(e.target.value);
//   };

//   const handleStartDateChange = (e) => {
//     setStartDate(e.target.value);
//   };

//   const handleEndDateChange = (e) => {
//     setEndDate(e.target.value);
//   };

//   const handleStatusChange = (status) => {
//     setAttendanceStatus(status);
//   };

//   const markAttendance = async () => {
//     if (!selectedTeacher || !selectedDate) {
//       setMessage("Please select a teacher and date");
//       return;
//     }

//     setLoading(true);
//     try {
//       const payload = {
//           date: selectedDate,
//         teacher: selectedTeacher,
//         status: attendanceStatus,
//       };

//       await axios.post(`${url}${MarkTeacherAttendance}`, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       setMessage("Attendance saved successfully");
//     } catch (error) {
//       setMessage(error.response?.data?.message || "Failed to save attendance");
//       if (error.status === 401) {  
//         Cookies.remove('user');
//         Cookies.remove('token');
//         window.location.href = '/user-options';                      
//       }
     
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getTeacherName = (id) => {
//     const teacher = teachers.find((t) => t._id === id);
//     return teacher ? teacher.name : "Unknown Teacher";
//   };

//   return (
//     <div className="sm:px-16 px-6 sm:py-16 py-10 min-h-screen">
//       <div className="flex flex-col md:flex-row text-black justify-between items-start md:items-center mb-6 p-2">
//         <div className="mb-4 md:mb-0">
//           <h2 className="h2 text-2xl font-semibold mb-2">Teacher Attendance</h2>
//           <div className="flex items-center text-sm subtitle-2">
//             <span className="mr-2">Teachers /</span>
//             <span>Attendance</span>
//           </div>
//         </div>
//         <div className="flex space-x-4">
//           <button
//             className={`px-4 py-2 rounded-lg ${
//               viewMode === "mark"
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-200 text-gray-700"
//             }`}
//             onClick={() => setViewMode("mark")}
//           >
//             Mark Attendance
//           </button>
//           <button
//             className={`px-4 py-2 rounded-lg ${
//               viewMode === "history"
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-200 text-gray-700"
//             }`}
//             onClick={() => setViewMode("history")}
//           >
//             View History
//           </button>
//         </div>
//       </div>

//       <div className="bg-white p-4 rounded-lg shadow-lg m-4">
//         {viewMode === "mark" ? (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Teacher <span className="text-danger">*</span>
//                 </label>
//                 <select
//                   className="w-full p-2 rounded-lg text-xs outline-none bg-primary-300 text-black-300 border-lamaSkyLight"
//                   value={selectedTeacher}
//                   onChange={handleTeacherChange}
//                 >
//                   <option value="">Select Teacher</option>
//                   {teachers.map((teacher) => (
//                     <option key={teacher._id} value={teacher._id}>
//                       {teacher.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Attendance Date <span className="text-danger">*</span>
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="date"
//                     className="w-full p-2 rounded-lg text-xs outline-none bg-primary-300 text-black-300 border-lamaSkyLight"
//                     value={selectedDate}
//                     onChange={handleDateChange}
//                     onClick={(e) => e.target.showPicker()}
//                   />
//                   <Calendar
//                     className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
//                     size={18}
//                   />
//                 </div>
//               </div>

              
//                             {!selectedTeacher && (
//                               <div className="col-span-2 mt-4">
//                                 <p className="text-black-200 text-sm">Please select a teacher</p>
//                               </div>
//                             )}
                            
              
//             </div>

//             {selectedTeacher && (
//               <div className="mt-6">
//                 <h2 className="text-lg font-medium mb-4">Mark Attendance</h2>

//                 <div className="p-4 border rounded-lg bg-gray-50">
//                   <div className="flex gap-4">
//                     <label
//                       className={`flex items-center gap-1 cursor-pointer p-2 rounded-md ${
//                         attendanceStatus === "present" ? "bg-success-100" : ""
//                       }`}
//                     >
//                       <input
//                         type="radio"
//                         name="teacherAttendance"
//                         checked={attendanceStatus === "present"}
//                         onChange={() => handleStatusChange("present")}
//                         className="appearance-none w-4 h-4 border border-gray-300 rounded-full checked:bg-success-500 checked:border-success-500"
//                       />
//                       <CheckCircle size={18} className="text-success-400" />
//                       <span className="text-success-500">Present</span>
//                     </label>

//                     <label
//                       className={`flex items-center gap-1 cursor-pointer p-2 rounded-md ${
//                         attendanceStatus === "absent" ? "bg-red-100" : ""
//                       }`}
//                     >
//                       <input
//                         type="radio"
//                         name="teacherAttendance"
//                         checked={attendanceStatus === "absent"}
//                         onChange={() => handleStatusChange("absent")}
//                         className="appearance-none w-4 h-4 border border-gray-300 rounded-full checked:bg-red-500 checked:border-red-500"
//                       />
//                       <XCircle size={18} className="text-danger" />
//                       <span className="text-danger">Absent</span>
//                     </label>
//                   </div>
//                 </div>

//                 <div className="mt-6 flex justify-end">
//                   <button
//                     className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
//                     onClick={markAttendance}
//                     disabled={loading}
//                   >
//                     <Save size={18} />
//                     <span>{loading ? "Saving..." : "Save Attendance"}</span>
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Teacher <span className="text-danger">*</span>
//                 </label>
//                 <select
//                   className="w-full p-2 rounded-lg text-xs outline-none bg-primary-300 text-black-300 border-lamaSkyLight"
//                   value={selectedTeacher}
//                   onChange={handleTeacherChange}
//                 >
//                   <option value="">Select Teacher</option>
//                   {teachers.map((teacher) => (
//                     <option key={teacher._id} value={teacher._id}>
//                       {teacher.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Start Date <span className="text-danger">*</span>
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="date"
//                     className="w-full p-2 rounded-lg text-xs outline-none bg-primary-300 text-black-300 border-lamaSkyLight"
//                     value={startDate}
//                     onChange={handleStartDateChange}
//                     onClick={(e) => e.target.showPicker()}
//                   />
//                   <Calendar
//                     className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
//                     size={18}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   End Date <span className="text-danger">*</span>
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="date"
//                     className="w-full p-2 rounded-lg text-xs outline-none bg-primary-300 text-black-300 border-lamaSkyLight"
//                     value={endDate}
//                     onChange={handleEndDateChange}
//                     onClick={(e) => e.target.showPicker()}
//                   />
//                   <Calendar
//                     className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
//                     size={18}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="mb-4 flex justify-end">
//               <button
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
//                 onClick={fetchAttendanceHistory}
//                 disabled={loading || !selectedTeacher || !startDate || !endDate}
//               >
//                 <Filter size={18} />
//                 <span>Apply Filter</span>
//               </button>
//             </div>

//             <div className="overflow-x-auto text-black-300 text-base bg-white">
//               <table className="w-full min-w-[768px] pb-10">
//                 <thead>
//                   <tr className="border-b bg-lamaPurpleLight">
//                     <th className="px-6 py-4 text-left">Sl No</th>
//                     <th className="px-6 py-4 text-left">Date</th>
//                     <th className="px-6 py-4 text-left">Teacher Name</th>
//                     <th className="px-6 py-4 text-left">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {loading ? (
//                     <tr>
//                       <td colSpan="4" className="px-6 py-4 text-center">
//                         Loading...
//                       </td>
//                     </tr>
//                   ) : !selectedTeacher ? (
//                     <tr>
//                       <td colSpan="4" className="px-6 py-4 text-center">
//                         Please select a teacher
//                       </td>
//                     </tr>
//                   ) : attendanceHistory.length === 0 ? (
//                     <tr>
//                       <td colSpan="4" className="px-6 py-4 text-center">
//                         No attendance records found
//                       </td>
//                     </tr>
//                   ) : (
//                     attendanceHistory.map((record, index) => (
//                       <tr
//                         key={record._id}
//                         className="border-b hover:bg-gray-50 transition-colors duration-150 animate-fade-in"
//                       >
//                         <td className="px-6 py-4 text-left">{index + 1}</td>
//                         <td className="px-6 py-4 text-left">
//                           {new Date(record.date).toLocaleDateString()}
//                         </td>
//                         <td className="px-6 py-4 text-left">
//                           {record.teacher.name || getTeacherName(record.teacher)}
//                         </td>
//                         <td className="px-6 py-4 text-left">
//                           <span
//                             className={`px-2 py-1 rounded-full text-xs ${
//                               record.status === "present"
//                                 ? "bg-success-100 text-success-700"
//                                 : "bg-red-100 text-red-700"
//                             }`}
//                           >
//                             {record.status.charAt(0).toUpperCase() +
//                               record.status.slice(1)}
//                           </span>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </>
//         )}

//         {message && (
//           <div
//             className={`mt-4 p-2 rounded-md ${
//               message.includes("success")
//                 ? "bg-success-100 text-success-500"
//                 : "bg-red-100 text-red-700"
//             }`}
//           >
//             {message}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TeacherAttendanceSystem;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Save, CheckCircle, XCircle, Filter } from "lucide-react";
import{GetAllTeacher,GetAllTeachers,GetTeacherAttendance,MarkTeacherAttendance} from '../../Route'
import {useSelector,useDispatch} from 'react-redux'
import {setTeacherAttendanceData} from '../../../Store/slice'
import Cookies from "js-cookie";

const TeacherAttendanceSystem = () => {
  const dispatch = useDispatch()
  const attendanceHistory = useSelector((state) => state.userData.TeacherAttendanceData);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  // const [selectedDate, setSelectedDate] = useState(
  //   new Date().toISOString().split("T")[0]
  // );
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split('T')[0];
  });
  const [attendanceStatus, setAttendanceStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [viewMode, setViewMode] = useState("mark"); // "mark" or "history"
  const url = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("token");
  
  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (selectedTeacher && viewMode === "history" && startDate && endDate) {
      fetchAttendanceHistory();
    }
  }, [selectedTeacher, startDate, endDate, viewMode]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}${GetAllTeachers}`); // Adjust the endpoint as needed
      setTeachers(response.data.data.teachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setMessage(error?.response?.data?.message|| "Network Error");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceHistory = async () => {
    if (!selectedTeacher || !startDate || !endDate) {
      setMessage("Please select a teacher and date range");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${url}${GetTeacherAttendance}/:${selectedTeacher}?startDate=${startDate}=&endDate=${endDate}=`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      dispatch(setTeacherAttendanceData(response.data.data))
    } catch (error) {
      dispatch(setTeacherAttendanceData([]))
      console.error("Error fetching attendance history:", error);
      setMessage(error.response.data.message||error?.message);
      if (error.status === 401) {  
        Cookies.remove('user');
        Cookies.remove('token');
        window.location.href = '/user-options';                      
      }
     
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherChange = (e) => {
    setSelectedTeacher(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  // Modified status change handler to toggle selection
  const handleStatusChange = (status) => {
    // If the same status is clicked again, set it to empty string (deselect)
    if (attendanceStatus === status) {
      setAttendanceStatus("");
    } else {
      // Otherwise, set to the new status
      setAttendanceStatus(status);
    }
  };

  const markAttendance = async () => {
    if (!selectedTeacher || !selectedDate) {
      setMessage("Please select a teacher and date");
      return;
    }

    // Check if attendance status is selected
    if (!attendanceStatus) {
      setMessage("Please select attendance status (Present or Absent)");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        date: selectedDate,
        teacher: selectedTeacher,
        status: attendanceStatus,
      };

      await axios.post(`${url}${MarkTeacherAttendance}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage("Attendance saved successfully");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to save attendance");
      if (error.status === 401) {  
        Cookies.remove('user');
        Cookies.remove('token');
        window.location.href = '/user-options';                      
      }
     
    } finally {
      setLoading(false);
    }
  };

  const getTeacherName = (id) => {
    const teacher = teachers.find((t) => t._id === id);
    return teacher ? teacher.name : "Unknown Teacher";
  };

  return (
    <div className="sm:px-16 px-6 sm:py-16 py-10 min-h-screen">
      <div className="flex flex-col md:flex-row text-black justify-between items-start md:items-center mb-6 p-2">
        <div className="mb-4 md:mb-0">
          <h2 className="h2 text-2xl font-semibold mb-2">Teacher Attendance</h2>
          <div className="flex items-center text-sm subtitle-2">
            <span className="mr-2">Teachers /</span>
            <span>Attendance</span>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              viewMode === "mark"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setViewMode("mark")}
          >
            Mark Attendance
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              viewMode === "history"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setViewMode("history")}
          >
            View History
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-lg m-4">
        {viewMode === "mark" ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teacher <span className="text-danger">*</span>
                </label>
                <select
                  className="w-full p-2 rounded-lg text-xs outline-none bg-primary-300 text-black-300 border-lamaSkyLight"
                  value={selectedTeacher}
                  onChange={handleTeacherChange}
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attendance Date <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full p-2 rounded-lg text-xs outline-none bg-primary-300 text-black-300 border-lamaSkyLight"
                    value={selectedDate}
                    onChange={handleDateChange}
                    onClick={(e) => e.target.showPicker()}
                  />
                  <Calendar
                    className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
                    size={18}
                  />
                </div>
              </div>
              
              {!selectedTeacher && (
                <div className="col-span-2 mt-4">
                  <p className="text-black-200 text-sm">Please select a teacher</p>
                </div>
              )}
            </div>

            {selectedTeacher && (
              <div className="mt-6">
                <h2 className="text-lg font-medium mb-4">Mark Attendance</h2>

                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex gap-4">
                    {/* Present option - modified to use a div wrapper that can be clicked */}
                    <div 
                      className={`flex items-center gap-1 cursor-pointer p-2 rounded-md ${
                        attendanceStatus === "present" ? "bg-success-100" : ""
                      }`}
                      onClick={() => handleStatusChange("present")}
                    >
                      <div className="relative w-4 h-4">
                        <input
                          type="radio"
                          name="teacherAttendance"
                          checked={attendanceStatus === "present"}
                          onChange={() => {}} // Empty onChange to avoid React warning
                          className="appearance-none w-4 h-4 border border-gray-300 rounded-full checked:bg-success-500 checked:border-success-500"
                        />
                      </div>
                      <CheckCircle size={18} className="text-success-400" />
                      <span className="text-success-500">Present</span>
                    </div>

                    {/* Absent option - modified to use a div wrapper that can be clicked */}
                    <div
                      className={`flex items-center gap-1 cursor-pointer p-2 rounded-md ${
                        attendanceStatus === "absent" ? "bg-red-100" : ""
                      }`}
                      onClick={() => handleStatusChange("absent")}
                    >
                      <div className="relative w-4 h-4">
                        <input
                          type="radio"
                          name="teacherAttendance"
                          checked={attendanceStatus === "absent"}
                          onChange={() => {}} // Empty onChange to avoid React warning
                          className="appearance-none w-4 h-4 border border-gray-300 rounded-full checked:bg-red-500 checked:border-red-500"
                        />
                      </div>
                      <XCircle size={18} className="text-danger" />
                      <span className="text-danger">Absent</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
                    onClick={markAttendance}
                    disabled={loading}
                  >
                    <Save size={18} />
                    <span>{loading ? "Saving..." : "Save Attendance"}</span>
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teacher <span className="text-danger">*</span>
                </label>
                <select
                  className="w-full p-2 rounded-lg text-xs outline-none bg-primary-300 text-black-300 border-lamaSkyLight"
                  value={selectedTeacher}
                  onChange={handleTeacherChange}
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full p-2 rounded-lg text-xs outline-none bg-primary-300 text-black-300 border-lamaSkyLight"
                    value={startDate}
                    onChange={handleStartDateChange}
                    onClick={(e) => e.target.showPicker()}
                  />
                  <Calendar
                    className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
                    size={18}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full p-2 rounded-lg text-xs outline-none bg-primary-300 text-black-300 border-lamaSkyLight"
                    value={endDate}
                    onChange={handleEndDateChange}
                    onClick={(e) => e.target.showPicker()}
                  />
                  <Calendar
                    className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
                    size={18}
                  />
                </div>
              </div>
            </div>

            <div className="mb-4 flex justify-end">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
                onClick={fetchAttendanceHistory}
                disabled={loading || !selectedTeacher || !startDate || !endDate}
              >
                <Filter size={18} />
                <span>Apply Filter</span>
              </button>
            </div>

            <div className="overflow-x-auto text-black-300 text-base bg-white">
              <table className="w-full min-w-[768px] pb-10">
                <thead>
                  <tr className="border-b bg-lamaPurpleLight">
                    <th className="px-6 py-4 text-left">Sl No</th>
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-left">Teacher Name</th>
                    <th className="px-6 py-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : !selectedTeacher ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center">
                        Please select a teacher
                      </td>
                    </tr>
                  ) : attendanceHistory.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center">
                        No attendance records found
                      </td>
                    </tr>
                  ) : (
                    attendanceHistory.map((record, index) => (
                      <tr
                        key={record._id}
                        className="border-b hover:bg-gray-50 transition-colors duration-150 animate-fade-in"
                      >
                        <td className="px-6 py-4 text-left">{index + 1}</td>
                        <td className="px-6 py-4 text-left">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-left">
                          {record.teacher.name || getTeacherName(record.teacher)}
                        </td>
                        <td className="px-6 py-4 text-left">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              record.status === "present"
                                ? "bg-success-100 text-success-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {record.status.charAt(0).toUpperCase() +
                              record.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {message && (
          <div
            className={`mt-4 p-2 rounded-md ${
              message.includes("success")
                ? "bg-success-100 text-success-500"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAttendanceSystem;
