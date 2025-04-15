import React, { useState, useEffect } from "react";
import {
  Loader,
  Plus,
  X,
} from "lucide-react";

import Cookies from "js-cookie";
import Toast from "../../Components/Toast";
import {setLeaderBoard} from '../../../Store/slice'
import {GetLeaderBoardAPI,GetStudentByIDAPI} from '../../../service/api'
import {useSelector, useDispatch} from 'react-redux'
const TeachersStudentLeaderBoard = () => {
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState("");
  const [studentData, setStudentData] = useState({});
  const leaderboardData = useSelector((state) => state.userData.LeaderBoardData);
  const dispatch = useDispatch();
  const url = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("token");
  const user=useSelector((state) => state.userData.user);
  useEffect(() => {
    document.title = "Student Leaderboard";
  }, []);


  const fetchStudentData = async (studentId) => {
    const response = await GetStudentByIDAPI(url, studentId);
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      setStudentData(prev => ({...prev, [studentId]: response.data.student}));
    }
    else{
      setToastMessage(response.message);
      setToastIcon("wrong");
      setShowToast(true);
    }
  };



  const fetchLeaderboard = async () => {
      setLoading(true);
      const response = await GetLeaderBoardAPI(url, user?.classTeacher);
      if (response.status === 200 || response.status === 201 || response.status === 204) 
        {
        dispatch(setLeaderBoard(response.data));
        response.data.forEach(item => {
        fetchStudentData(item.student);
        });
      
      } else {
        setToastMessage(response.message);
        setToastIcon("wrong");
        setShowToast(true);
      }
      setLoading(false);
     
  };

  useEffect(() => {
    if(user?.classTeacher) { 
      fetchLeaderboard();
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="h-12 w-12 animate-spin text-purpleColor" />
      </div>
    );
  }

  return (
    <div className="sm:px-16 px-6 sm:py-16 py-10 min-h-screen">
      {showToast && (
        <div className="fixed">
          <Toast message={toastMessage} iconName={toastIcon} />
        </div>
      )}
      
      <div className="flex flex-col md:flex-row text-black justify-between items-start md:items-center mb-6 p-2">
      <div className="mb-4 md:mb-0">
          <h2 className="h2 mb-2">Student Leaderboard</h2>
          <div className="flex items-center subtitle-2">
            <span className="">Students Details / </span>
            <span>Student Leaderboard</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-2 rounded-md shadow-lg">
       
        <div className="overflow-x-auto text-black-300 text-base bg-white m-4">
          <table className="w-full min-w-[768px] pb-10">
            <thead>
              <tr className="border-b bg-lamaPurpleLight">
                <th className="px-6 py-4 text-left">SL No</th>
                <th className="px-6 py-4 text-left">Student's Name</th>
                <th className="px-6 py-4 text-left">Marks Obtained</th>
                <th className="px-6 py-4 text-left">Total Marks</th>
                <th className="px-6 py-4 text-left">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData?.length > 0 ? (
                leaderboardData?.map((student, index) => (
                  <tr
                    key={student._id}
                    className="border-b hover:bg-gray-50 transition-colors duration-150 animate-fade-in">
                    <td className="px-6 py-4 text-left">{index + 1}</td>
                    <td className="px-6 py-4 text-left">{studentData[student.student]?.name}</td>
                    <td className="px-6 py-4 text-left">{student.totalObtained}</td>
                    <td className="px-6 py-4 text-left">{student.totalMax}</td>
                    <td className="px-6 py-4 text-left">{student.percentage.toFixed(2)}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8">{'No data found for this class'}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>      
        </div>    
      </div>
  );
};

export default TeachersStudentLeaderBoard;