// import { useState, useEffect } from 'react';
// import { Loader, FileSpreadsheet, FileText } from 'lucide-react';
// import { GetExamsAPI } from '../../../service/api';
// import { useSelector } from "react-redux";
// import axios from 'axios';
// import Toast from '../../Components/Toast';
// import StudentMarksheet from '../../Pages/Student/ViewStudentsDetails/Marksheet';

// const TeacherStudentMarksheet = (StudentData) => {
//   const [selectedExam, setSelectedExam] = useState('');
//   const [students, setStudents] = useState([])
//   const [selectedExamName, setSelectedExamName] = useState('');
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [exams, setExams] = useState([]);
//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastIcon, setToastIcon] = useState("");
//   const [showMarksheet, setShowMarksheet] = useState(false);
//   const url = import.meta.env.VITE_API_BASE_URL;
//   const user = useSelector((state) => state.userData.user);

//   const fetchStudents = async () => {
//     const response = await GetStudentByClassAPI(url, user?.classTeacher);
//     if (response.status === 200 || response.status === 201 || response.status === 204) {
//       setStudents(response.data.students)
//     } else {
//       setToastMessage('Failed to fetch students')
//       setToastIcon("wrong")
//       setShowToast(true)
//     }
//   }
//   useEffect(() => {
//     if (user?.classTeacher) {
//         fetchStudents()
//         fetchExams()
//     }
//   }, [])


//   const fetchResults = async (examType) => {
//     setLoading(true);
//     setError(null);
//     setShowMarksheet(false);
//     try {
//       const response = await axios.get(`${url}mark/students/${user?._id}/exams/${examType}`);
     

//       setResults(response.data.data.data);
//     } catch (err) {
//       setError(err.response.data.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (selectedExam) {
//       fetchResults(selectedExam);
//     }
//   }, [selectedExam]);

//   const fetchExams = async () => {
//     const response = await GetExamsAPI(url);
//     if (response.status === 200 || response.status === 201 || response.status === 204) {
//       setExams(response.data.exams)
//     } else {
//       setToastMessage('Failed to fetch exams')
//       setToastIcon("wrong")
//       setShowToast(true)
//     }
//   }


//   useEffect(() => {
//     if (showToast) {
//       const timer = setTimeout(() => {
//         setShowToast(false);
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [showToast]);

//   const toggleMarksheet = () => {
//     setShowMarksheet(!showMarksheet);
//   };

//   return (
//     <div className="w-full min-h-screen p-4 bg-gray-50">
//       {showToast && (
//         <div className="fixed top-4 right-4 z-50">
//           <Toast message={toastMessage} iconName={toastIcon} />
//         </div>
//       )}

//       <div className="w-full">
//         <h2 className="h2 text-black-300 text-left mb-6"> My Results</h2>

//         <div className="mb-4">
//           <select
//             value={selectedExam}
//             onChange={(e) => {
//               setSelectedExam(e.target.value)
//               const exam = exams.find(exam => exam._id === e.target.value)
//               setSelectedExamName(exam?.name)
//             }}
//             className="w-full md:w-64 p-2 border rounded-lg shadow-sm bg-primary-300 text-black-300 border-lamaSkyLight"
//           >
//             <option value="">{!exams ? "Loading Exams" : "Select Exam Type"}</option>
//             {exams.map((exam) => (
//               <option key={exam?._id} value={exam?._id}>
//                 {exam.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         {selectedExam && results.length > 0 && (
//           <div className="mb-4">
//             <button
//               onClick={toggleMarksheet}
//               className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
//             >
//               <FileText className="h-5 w-5 mr-2" />
//               {showMarksheet ? "Hide Marksheet" : "View Marksheet"}
//             </button>
//           </div>
//         )}

//         {showMarksheet && results.length > 0 ? (
//           <StudentMarksheet
//             studentData={user}
//             examData={selectedExamName}
//             results={results}
//           />
//         ) : (
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50 sticky top-0">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-black-100 tracking-wider">
//                       Subject
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-black-100 tracking-wider">
//                       Marks
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-black-100 tracking-wider">
//                       Max Marks
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {loading ? (
//                     <tr>
//                       <td colSpan="3" className="px-6 py-4 text-center">
//                         <Loader className="animate-spin h-8 w-8 text-blue-500 mx-auto" />
//                       </td>
//                     </tr>
//                   ) : !selectedExam ? (
//                     <tr>
//                       <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
//                         Please select your exam
//                       </td>
//                     </tr>
//                   ) : error ? (
//                     <tr>
//                       <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
//                         {error}
//                       </td>
//                     </tr>
//                   ) : results.length === 0 ? (
//                     <tr>
//                       <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
//                         No results found for the selected exam type
//                       </td>
//                     </tr>
//                   ) : (
//                     results.map((result, index) => (
//                       <tr key={index}>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <FileSpreadsheet className="h-5 w-5 text-gray-400 mr-2" />
//                             <span className="text-sm text-gray-700">{result.subject}</span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                           {result.marksObtained}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                           {result.maxMarks}
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TeacherStudentMarksheet;

import { useState, useEffect } from 'react';
import { Loader, FileSpreadsheet, FileText } from 'lucide-react';
import { GetExamsAPI, GetStudentByClassAPI } from '../../../service/api'; // Assuming you have these APIs
import { useSelector } from "react-redux";
import axios from 'axios';
import Toast from '../../Components/Toast';
import StudentMarksheet from '../../Pages/Student/ViewStudentsDetails/Marksheet';

const TeacherStudentMarksheet = () => {
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedExamName, setSelectedExamName] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exams, setExams] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState("");
  const [showMarksheet, setShowMarksheet] = useState(false);
  const [selectedStudentData, setSelectedStudentData] = useState(null);
  const url = import.meta.env.VITE_API_BASE_URL;
  const user = useSelector((state) => state.userData.user);

  const fetchStudents = async () => {
    try {
      const response = await GetStudentByClassAPI(url, user?.classTeacher);
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        setStudents(response.data.students);
      } else {
        setToastMessage('Failed to fetch students');
        setToastIcon("wrong");
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setToastMessage('Failed to fetch students');
      setToastIcon("wrong");
      setShowToast(true);
    }
  };

  useEffect(() => {
    if (user?.classTeacher) {
      fetchStudents();
      fetchExams();
    }
  }, [user?.classTeacher]);

  const fetchResults = async (examType, studentId) => {
    if (!examType || !studentId) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    setShowMarksheet(false);
    try {
      const response = await axios.get(`${url}mark/students/${studentId}/exams/${examType}`);
      setResults(response.data.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedExam && selectedStudent) {
      fetchResults(selectedExam, selectedStudent);
      const student = students.find(stud => stud._id === selectedStudent);
      setSelectedStudentData(student);
    } else {
      setResults([]);
      setSelectedStudentData(null);
    }
  }, [selectedExam, selectedStudent, students]);

  const fetchExams = async () => {
    try {
      const response = await GetExamsAPI(url);
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        setExams(response.data.exams);
      } else {
        setToastMessage('Failed to fetch exams');
        setToastIcon("wrong");
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
      setToastMessage('Failed to fetch exams');
      setToastIcon("wrong");
      setShowToast(true);
    }
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const toggleMarksheet = () => {
    setShowMarksheet(!showMarksheet);
  };

  return (
    <div className="w-full min-h-screen p-4 bg-gray-50">
      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast message={toastMessage} iconName={toastIcon} />
        </div>
      )}

      <div className="w-full">
        <h2 className="h2 text-black-300 text-left mb-6"> View Student Marksheet</h2>

        <div className="mb-4 flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <label htmlFor="studentSelect" className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
            <select
              id="studentSelect"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full p-2 border rounded-lg shadow-sm bg-primary-300 text-black-300 border-lamaSkyLight"
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student?._id} value={student?._id}>
                  {student?.firstName} {student?.lastName}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-1/2">
            <label htmlFor="examSelect" className="block text-sm font-medium text-gray-700 mb-1">Select Exam Type</label>
            <select
              id="examSelect"
              value={selectedExam}
              onChange={(e) => {
                setSelectedExam(e.target.value);
                const exam = exams.find(exam => exam._id === e.target.value);
                setSelectedExamName(exam?.name);
              }}
              className="w-full p-2 border rounded-lg shadow-sm bg-primary-300 text-black-300 border-lamaSkyLight"
            >
              <option value="">{!exams ? "Loading Exams" : "Select Exam Type"}</option>
              {exams.map((exam) => (
                <option key={exam?._id} value={exam?._id}>
                  {exam.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedExam && selectedStudent && results.length > 0 && (
          <div className="mb-4">
            <button
              onClick={toggleMarksheet}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              <FileText className="h-5 w-5 mr-2" />
              {showMarksheet ? "Hide Marksheet" : "View Marksheet"}
            </button>
          </div>
        )}

        {showMarksheet && selectedStudentData && results.length > 0 ? (
          <StudentMarksheet
            studentData={selectedStudentData}
            examData={selectedExamName}
            results={results}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black-100 tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black-100 tracking-wider">
                      Marks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black-100 tracking-wider">
                      Max Marks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center">
                        <Loader className="animate-spin h-8 w-8 text-blue-500 mx-auto" />
                      </td>
                    </tr>
                  ) : !selectedExam || !selectedStudent ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                        Please select a student and an exam.
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                        {error}
                      </td>
                    </tr>
                  ) : results.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                        No results found for the selected exam type for this student.
                      </td>
                    </tr>
                  ) : (
                    results.map((result, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileSpreadsheet className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-700">{result.subject}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {result.marksObtained}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {result.maxMarks}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherStudentMarksheet;