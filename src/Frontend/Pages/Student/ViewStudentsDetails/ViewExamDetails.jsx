  import { useState, useEffect } from 'react';
  import { Loader, FileSpreadsheet, Trash, FileText } from 'lucide-react';
  import { GetExamsAPI } from '../../../../service/api';
  import axios from 'axios';
  import Toast from '../../../Components/Toast';
  import StudentMarksheet from './Marksheet';

  const ExamMarkDetails = (StudentData ) => {
    const [selectedExam, setSelectedExam] = useState('');
    const [selectedExamName, setSelectedExamName] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [exams, setExams] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastIcon, setToastIcon] = useState("");
    const [showMarksheet, setShowMarksheet] = useState(false);
    const url = import.meta.env.VITE_API_BASE_URL;
  
    const fetchResults = async (examType) => {
      setLoading(true);
      setError(null);
      setShowMarksheet(false);
      try {
        const response = await axios.get(`${url}mark/students/${StudentData.StudentData.studentData?._id}/exams/${examType}`);
        // const response = await axios.get(`${url}mark/students/67b06f1d0c026e1e1e98be78/exams/67cc0fe63576d7391683441d`);
        setResults(response.data.data.data);
      } catch (err) {
        setError(err.response.data.message);
      } finally {
        setLoading(false);
      }
    };
  
    const deleteResult = async (subjectId) => {
      try {
        const response = await axios.delete(`${url}mark/students/${StudentData.studentData?._id}/subject/${subjectId}`);
        if (response.status === 200) {
          setToastMessage('Mark deleted successfully');
          setToastIcon("success");
          setShowToast(true);
          fetchResults(selectedExam);
        }
      } catch (err) {
        setToastMessage('Failed to delete mark');
        setToastIcon("wrong");
        setShowToast(true);
      }
    };

    useEffect(() => {
      if (selectedExam) {
        fetchResults(selectedExam);
      }
    }, [selectedExam]);

    const fetchExams = async () => {
      const response = await GetExamsAPI(url);
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        setExams(response.data.exams)
      } else {
        setToastMessage('Failed to fetch exams')
        setToastIcon("wrong")
        setShowToast(true)
      }
    }
  
    useEffect(() => {
      fetchExams();
    }, []);

    // Auto-hide toast after 3 seconds
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
          <h2 className="h2 text-black-300 text-left mb-6">Results</h2>
        
          <div className="mb-4">
            <select
              value={selectedExam}
              onChange={(e) => {
                setSelectedExam(e.target.value)
                const exam = exams.find(exam => exam._id === e.target.value)
                setSelectedExamName(exam?.name)
              }}
              className="w-full md:w-64 p-2 border rounded-lg shadow-sm bg-primary-300 text-black-300 border-lamaSkyLight"
            >
              <option value="">{!exams ? "Loading Exams" : "Select Exam Type"}</option>
              {exams.map((exam) => (
                <option key={exam?._id} value={exam?._id}>
                  {exam.name}
                </option>
              ))}
            </select>
          </div>
          {selectedExam && results.length > 0 && (
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

          {showMarksheet && results.length > 0 ? (
            <StudentMarksheet 
              studentData={StudentData.StudentData.studentData} 
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-black-100 tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center">
                          <Loader className="animate-spin h-8 w-8 text-blue-500 mx-auto" />
                        </td>
                      </tr>
                    ) : !selectedExam ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                          Please select your exam
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                          {error}
                        </td>
                      </tr>
                    ) : results.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                          No results found for the selected exam type
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button onClick={() => deleteResult(result?._id)} className="text-red-600 hover:text-red-900">
                              <Trash className="h-5 w-5" />
                            </button>
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

  export default ExamMarkDetails;