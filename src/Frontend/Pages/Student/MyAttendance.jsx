import { useState, useEffect } from 'react';
import { Calendar, Loader } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux'
import {setUser} from '../../../Store/slice'
import axios from 'axios';

const MyAttendance = () => {
  const url = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();
const user = useSelector((state) => state.userData.user)
if (user === null || user === undefined) {
  const userCookie = JSON.parse(Cookies.get('user')) || '{}'
  if(userCookie)
  {
    dispatch(setUser(userCookie))
  }
  }
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    fetchAttendance();
  }, [selectedMonth, selectedYear]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      // ${url}student-attendance//students/${user._id}/attendance-history`
      const response = await axios.get(`${url}student-attendance//students/${user?._id}/attendance-history`);
  
      setAttendance(response.data.attendanceHistory || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
    setLoading(false);
  };

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

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-3  md:p-4">
        <div className="flex items-center justify-between mb-4 md:mb-8 p-2 md:p-4 bg-slate-100">
          <h1 className="text-md md:text-3xl font-bold flex items-center gap-2 text-black">
            <Calendar className="h-6 w-6 md:h-8 md:w-8 font-black text-black" />
            <span className='text-purpleColor'>Attendance</span> Calendar
          </h1>
          <select
            className="text-xs md:text-base px-1 py-1 md:px-4 md:py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 bg-primary-300 text-black-300 border-lamaSkyLight"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {months.map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>        </div>

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
                  className={`size-8 md:size-12 rounded-full border shadow-lg  p-1 md:p-2 transition-all duration-200 transform hover:scale-105 flex items-center justify-center ${getAttendanceColor(
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

export default MyAttendance;