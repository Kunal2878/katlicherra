
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Save, CheckCircle, XCircle } from "lucide-react";
import { setStudentAttendanceData,updateStudentAttendance } from '../../../Store/slice';
import { useSelector, useDispatch } from 'react-redux';
const StudentAttendanceSystem = () => {
  const dispatch = useDispatch();
  const [selectedClass, setSelectedClass] = useState("");
   const [selectedDate, setSelectedDate] = useState(() => {
      const today = new Date();
      today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
      return today.toISOString().split('T')[0];
    });
  const [students, setStudents] = useState([]);
  const user = useSelector((state) => state.userData.user);
  const attendanceData = useSelector((state) => 
    Array.isArray(state.userData.StudentAttendanceData) 
      ? state.userData.StudentAttendanceData 
      : []
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const url = import.meta.env.VITE_API_BASE_URL;

  useEffect(()=>{
    setSelectedClass(user?.classTeacher)
    document.title ="Student Attendace"
  })
  // Fetch students and attendance when class or date changes
  useEffect(() => {
    if (selectedClass) {
      fetchStudentsAndAttendance();
    }
  }, [selectedClass, selectedDate]);

  // Clear message after 2 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Fetch students and attendance together
  const fetchStudentsAndAttendance = async () => {
    setLoading(true);
    try {
      // Fetch students for the selected class
      const studentsResponse = await axios.get(
        `https://katlicherra-backend-v2.onrender.com/api/v1/student/getstudentbyclassid/${selectedClass}`
      );
      const fetchedStudents = studentsResponse.data.data.students;
      setStudents(fetchedStudents);

      // Always initialize attendance data for all students
      const initialAttendance = fetchedStudents.map(student => ({
        student: student._id,
        status: null  // Default to null, indicating not yet marked
      }));

      try {
        // Attempt to fetch existing attendance
        const attendanceResponse = await axios.get(
          `${url}student-attendance/classes/${selectedClass}/attendance/${selectedDate}`
        );

        // If attendance exists, update the initial attendance
        if (attendanceResponse.data.attendance && attendanceResponse.data.attendance.students.length > 0) {
          const existingAttendance = attendanceResponse.data.attendance.students.map(
            (item) => ({
              student: item.student._id,
              status: item.status,
            })
          );

          // Merge existing attendance with initial attendance
          const mergedAttendance = initialAttendance.map(initItem => {
            const existingItem = existingAttendance.find(
              existing => existing.student === initItem.student
            );
            return existingItem || initItem;
          });

          dispatch(setStudentAttendanceData(mergedAttendance));
        } else {
          // No existing attendance, use initial attendance
          dispatch(setStudentAttendanceData(initialAttendance));
        }
      } catch (attendanceError) {
        // If fetching attendance fails, use initial attendance
        dispatch(setStudentAttendanceData(initialAttendance));
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setMessage(error.response?.data?.message || "Failed to fetch students");
      setStudents([]);
      dispatch(setStudentAttendanceData([]));
    } finally {
      setLoading(false);
    }
  };


  // Handle date change
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Get attendance status for a specific student
  const getAttendanceStatus = (studentId) => {
    const studentAttendance = attendanceData.find(
      (item) => item.student === studentId
    );
    
    return studentAttendance ? studentAttendance.status : null;
  };

  // Update attendance status for a specific student with toggle functionality
  const handleAttendanceChange = (studentId, status) => {
    // Find current status of this student
    const currentStatus = attendanceData.find(
      (item) => item.student === studentId
    )?.status;
    
    // If clicking the same status that's already selected, set to null
    // Otherwise, update to the new status
    const newStatus = currentStatus === status ? null : status;
    
    dispatch(updateStudentAttendance({ 
      studentId, 
      status: newStatus 
    }));
  };

  // Set attendance status for all students
  const setAllStudentsStatus = (status) => {
    // Get the current statuses to check if all students already have this status
    const allHaveStatus = students.every(student => 
      getAttendanceStatus(student._id) === status
    );
    
    // If all students already have this status, set all to null (toggle off)
    // Otherwise, set all to the provided status
    const newStatus = allHaveStatus ? null : status;
    
    const newData = students.map((student) => ({
      student: student._id,
      status: newStatus,
    }));
    
    dispatch(setStudentAttendanceData(newData));
  };

  // Save attendance
  const saveAttendance = async () => {
    if (!selectedClass || !selectedDate) {
      setMessage("Please select a class and date");
      return;
    }

    // Ensure all students have a status (present or absent)
    const incompleteAttendance = attendanceData.some(item => item.status === null);
    if (incompleteAttendance) {
      setMessage("Please mark attendance for all students");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        date: selectedDate,
        students: attendanceData.map(item => ({
          student: item.student,
          status: item.status || 'absent'  // Default to absent if somehow null
        })),
      };

      await axios.post(
        `${url}student-attendance/classes/${selectedClass}/attendance`,
        payload
      );

      // Refresh attendance after saving
      fetchStudentsAndAttendance();
      setMessage("Attendance saved successfully");
    } catch (error) {
      console.error("Error saving attendance:", error);
      setMessage("Failed to save attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sm:px-16 px-6 sm:py-16 py-10 min-h-screen">
      <div className="flex flex-col md:flex-row text-black justify-between items-start md:items-center mb-6 p-2">
        <div className="mb-4 md:mb-0">
          <h2 className="h2 text-2xl font-semibold mb-2">Mark Attendance</h2>
          <div className="flex items-center text-sm subtitle-2">
            <span className="mr-2">Students /</span>
            <span>Attendance</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-lg m-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          

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
        </div>

        {selectedClass && (
          <div className="mt-4">
            <h2 className="text-lg font-medium mb-4">Student List</h2>

            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm font-medium text-black-300">
                Set attendance for all students as:
              </span>
              <div className="flex gap-2">
                <label className="flex items-center gap-1 cursor-pointer">
                  <div 
                    onClick={() => setAllStudentsStatus("present")}
                    className={`w-4 h-4 border border-gray-300 rounded-full flex items-center justify-center ${
                      students.every(student => getAttendanceStatus(student._id) === "present") 
                        ? "bg-success-500 border-success-500" 
                        : ""
                    }`}
                  >
                    {students.every(student => getAttendanceStatus(student._id) === "present") && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-success-500">Present</span>
                </label>

                <label className="flex items-center gap-1 cursor-pointer">
                  <div 
                    onClick={() => setAllStudentsStatus("absent")}
                    className={`w-4 h-4 border border-gray-300 rounded-full flex items-center justify-center ${
                      students.every(student => getAttendanceStatus(student._id) === "absent") 
                        ? "bg-red-500 border-red-500" 
                        : ""
                    }`}
                  >
                    {students.every(student => getAttendanceStatus(student._id) === "absent") && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-danger">Absent</span>
                </label>
              </div>
            </div>

            <div className="overflow-x-auto text-black-300 text-base bg-white m-4">
              <table className="w-full min-w-[768px] pb-10">
                <thead className="">
                  <tr className="border-b bg-lamaPurpleLight">
                    <th className="px-6 py-4 text-left">Sl No</th>
                    <th className="px-6 py-4 text-left">Email</th>
                    <th className="px-6 py-4 text-left">Roll Number</th>
                    <th className="px-6 py-4 text-left">Name</th>
                    <th className="px-6 py-4 text-left">Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : students.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-left">
                        No students found
                      </td>
                    </tr>
                  ) : (
                    students.map((student, index) => (
                      <tr
                        key={student._id}
                        className="border-b hover:bg-gray-50 transition-colors duration-150 animate-fade-in"
                      >
                        <td className="px-6 py-4 text-left">{index + 1}</td>
                        <td className="px-6 py-4 text-left">
                          {student.email || "-"}
                        </td>
                        <td className="px-6 py-4 text-left">
                          {student.rollNumber || "-"}
                        </td>
                        <td className="px-6 py-4 text-left">{student.name}</td>
                        <td className="px-6 py-4 text-left">
                          <div className="flex gap-4">
                            <label
                              className={`flex items-center gap-1 cursor-pointer ${
                                getAttendanceStatus(student._id) === "present"
                                  ? "bg-success-100 p-2 rounded-md"
                                  : ""
                              }`}
                            >
                              <div 
                                onClick={() => handleAttendanceChange(student._id, "present")}
                                className={`w-4 h-4 border border-gray-300 rounded-full flex items-center justify-center ${
                                  getAttendanceStatus(student._id) === "present" 
                                    ? "bg-success-500 border-success-500" 
                                    : ""
                                }`}
                              >
                                {getAttendanceStatus(student._id) === "present" && (
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                              </div>
                              <CheckCircle
                                size={18}
                                className="text-success-400"
                              />
                              <span>Present</span>
                            </label>

                            <label
                              className={`flex items-center gap-1 cursor-pointer ${
                                getAttendanceStatus(student._id) === "absent"
                                  ? "bg-red-100 p-2 rounded-md"
                                  : ""
                              }`}
                            >
                              <div 
                                onClick={() => handleAttendanceChange(student._id, "absent")}
                                className={`w-4 h-4 border border-gray-300 rounded-full flex items-center justify-center ${
                                  getAttendanceStatus(student._id) === "absent" 
                                    ? "bg-red-500 border-red-500" 
                                    : ""
                                }`}
                              >
                                {getAttendanceStatus(student._id) === "absent" && (
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                              </div>
                              <XCircle size={18} className="text-danger" />
                              <span>Absent</span>
                            </label>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
                onClick={saveAttendance}
                disabled={loading}
              >
                <Save size={18} />
                <span>Save Attendance</span>
              </button>
            </div>

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
        )}
      </div>
    </div>
  );
};

export default StudentAttendanceSystem;
