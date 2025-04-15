import { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { useSelector } from "react-redux";
import Toast from '../../Components/Toast';
import { GetSubjectByClassAPI } from '../../../service/api';

const MySubjects = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState("");
  
  const url = import.meta.env.VITE_API_BASE_URL;
  const user = useSelector((state) => state.userData.user);
  
  const fetchSubjects = async () => {
    setLoading(true);
    setError(null);

    const response = await GetSubjectByClassAPI(url, user.studentClass);

    if (response.status === 200 || response.status === 204 || response.status === 201) {
      setSubjects(response.data);
      console.log(response.data);
    } else {
      setError('Subjects not available');
      setToastMessage(response.message);
      setToastIcon("wrong");
      setShowToast(true);
    }

    setLoading(false);
  };
  
  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      {showToast && (
        <div className="fixed z-100">
          <Toast message={toastMessage} iconName={toastIcon} />
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <h2 className="h2 text-left font-bold text-black-300 mb-6">My Subjects</h2>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mt-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="animate-spin h-8 w-8 text-purpleColor" />
            </div>
          ) : error ? (
            <div className="text-center p-6 text-black-200">
              {error}
            </div>
          ) : subjects.length > 0 ? (
            <div className="space-y-4 p-4">
              {subjects.map((subject, index) => (
                <div 
                  key={subject._id} 
                  className={`p-4 rounded-lg text-left ${
                    index % 3 === 0
                      ? "bg-lamaPurpleLight"
                      : index % 3 === 1
                      ? "bg-lamaYellowLight"
                      : "bg-lamaSkyLight"
                  }`}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{subject.name}</h3>
                  <div className="text-gray-600">
                    <p className="mb-2"><span className="font-medium">Syllabus:</span> {subject.syllabus}</p>
                    
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 text-black-200">
              No subjects available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MySubjects;