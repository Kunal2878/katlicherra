

import { useState, useEffect } from 'react';
import { Calendar, Loader } from 'lucide-react';
import axios from 'axios';
import Toast from '../../../Components/Toast';
import Cookies from 'js-cookie'

const TeacherAttendance = (TeacherData) => {
const url = import.meta.env.VITE_API_BASE_URL;
const token =Cookies.get("token")
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    fetchAttendance();
  }, [selectedMonth, selectedYear]);

  // Function to handle date filtering
  const handleDateFilter = () => {
    if (startDate && endDate) {
      fetchAttendanceByDateRange(startDate, endDate);
    } else {
      setToastMessage("Please select both start and end dates");
      setToastIcon("warning");
      setShowToast(true);
    }
  };

  // Function to fetch attendance within date range
  const fetchAttendanceByDateRange = async (start, end) => {
    setLoading(true);
    
    try {
      const response = await axios.get(
        `${url}teacher/getattendancehistory/${TeacherData.TeacherData.TeacherData?._id}?startDate=${start}&endDate=${end}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );      
      if (response.status === 200 || response.status === 201 || response.status === 204) {

        setAttendance(response.data.data || []);
        // Update the calendar view to show the month from start date
        if (response.data.data && response.data.data.length > 0) {
          const firstDate = new Date(start);
          setSelectedMonth(firstDate.getMonth());
          setSelectedYear(firstDate.getFullYear());
        }
      }
    } 
    catch (error) {
      setToastMessage(error.response?.data?.message || "Failed to fetch attendance records");
      setToastIcon("wrong");
      setShowToast(true)
    } 
    finally 
    {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      
      const response = await axios.get(
        `${url}teacher/getattendancehistory/${TeacherData.TeacherData.TeacherData?._id}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );
      
      if (response.status === 200) {
        setAttendance(response.data.data || []);
      } 
      
      else {
        setToastMessage("Failed to fetch attendance records");
        setToastIcon("error");
        setShowToast(true);
      }
    } 
    catch (error) {
      setToastMessage(error.response?.data?.message || "Failed to fetch attendance records");
      setToastIcon("wrong");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const getAttendanceColor = (day) => {
    const currentDate = new Date(selectedYear, selectedMonth, day);
    const attendanceRecord = attendance.find(record => {
      const recordDate = new Date(record.date);
      return recordDate.getDate() === day && 
             recordDate.getMonth() === selectedMonth && 
             recordDate.getFullYear() === selectedYear;
    });

    if (!attendanceRecord) return '';
    return attendanceRecord.status === 'present' ? 'bg-green-200 hover:bg-green-300' : 
           attendanceRecord.status === 'absent' ? 'bg-red-200 hover:bg-red-300' : '';
  };

  // Set default date range to current month
  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    // Format dates for input fields
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    setStartDate(formatDate(firstDay));
    setEndDate(formatDate(lastDay));
  }, []);

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gray-50">
      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast message={toastMessage} iconName={toastIcon} />
        </div>
      )}
      <div className="max-w-4xl mx-auto p-3 md:p-4 z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-8 p-2 md:p-4 bg-slate-100 rounded-lg">
          <h2 className="h2 text-left font-bold text-black-300 mb-4 md:mb-0 mr-6">
            Attendance Calendar
          </h2>
          <div className="w-full md:w-auto flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center">
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="flex flex-col">
                <label className="text-left text-xs text-gray-600 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-xs md:text-base px-1 py-1 md:px-4 md:py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 bg-primary-300 text-black-300 border-lamaSkyLight [color-scheme:light]"
                />
              </div>

              <div className="flex flex-col">
                <label className=" text-left text-xs text-gray-600 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-xs md:text-base px-1 py-1 md:px-4 md:py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 bg-primary-300 text-black-300 border-lamaSkyLight [color-scheme:light]"
                />
              </div>
              <div className="flex flex-col">
              <label className=" text-left text-xs text-gray-600 mb-1">Month</label>
              <select
            className="text-xs md:text-base px-1 py-1 md:px-4 md:py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 bg-primary-300 text-black-300 border-lamaSkyLight"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {months.map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select> 
              </div>




            </div>
            <button
              onClick={handleDateFilter}
              className="mt-2 md:mt-0 text-xs md:text-base px-3 py-1 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Filter
            </button>
           
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <Loader className="h-12 w-12 animate-spin text-purpleColor" />
          </div>
        ) : (
          <div className="text-purpleColor rounded-xl shadow-lg p-3 md:p-6 transition-all duration-300 hover:shadow-xl">
            <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-xs md:text-base font-semibold py-1 md:py-2 bg-lamaPurple rounded-md">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 md:gap-2 bg-primary-300 text-black-300 border-lamaSkyLight p-2 md:p-5 rounded-md">
              {[...Array(getFirstDayOfMonth(selectedMonth, selectedYear))].map((_, index) => (
                <div key={`empty-${index}`} className="h-12 md:h-24"></div>
              ))}
              {[...Array(getDaysInMonth(selectedMonth, selectedYear))].map((_, index) => (
                <div
                  key={index + 1}
                  className={`size-8 md:size-12 rounded-full border shadow-lg p-1 md:p-2 transition-all duration-200 transform hover:scale-105 flex items-center justify-center ${getAttendanceColor(
                    index + 1
                  )}`}
                >
                  <span className="text-xs md:text-base font-medium">{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 md:mt-8 flex gap-2 md:gap-4 justify-center">
          <div className="flex items-center gap-1 md:gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-green-200 rounded text-green-400"></div>
            <span className='text-sm md:text-base text-green-400'>Present</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-red-200 rounded"></div>
            <span className='text-sm md:text-base text-red-400'>Absent</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;