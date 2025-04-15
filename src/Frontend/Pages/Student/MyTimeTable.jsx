import { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import {useSelector} from "react-redux";
import axios from 'axios';
import Toast from '../../Components/Toast';

const MyTimeTable = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeTableUrl, setTimeTableUrl] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState("");
  
  const url = import.meta.env.VITE_API_BASE_URL;
  const user = useSelector((state) => state.userData.user);

  const fetchTimeTable = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${url}class/${user.studentClass}`);
  
      if (response.data.data.timeTable) {
        setTimeTableUrl(response.data.data.timeTable);
      } else {
        setError('Timetable not available');
      }
    } catch (err) {
      setError('Failed to fetch timetable');
      setToastMessage('Failed to fetch timetable');
      setToastIcon("wrong");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeTable();
  }, []);

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      {showToast && (
        <div className="fixed z-100">
          <Toast message={toastMessage} iconName={toastIcon} />
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <h2 className="h2 text-left font-bold text-black-300 mb-6">My Time Table</h2>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mt-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="animate-spin h-8 w-8 text-purpleColor" />
            </div>
          ) : error ? (
            <div className="text-center p-6 text-black-200">
              {error}
            </div>
          ) : timeTableUrl ? (
            <iframe
              src={timeTableUrl}
              className="w-full h-screen border-0"
              title="Time Table"
            />
          ) : (
            <div className="text-center p-6 text-black-200">
              Timetable not available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTimeTable;