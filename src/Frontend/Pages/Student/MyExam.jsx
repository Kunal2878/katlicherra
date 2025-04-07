  import { useState, useEffect } from 'react';
  import { Loader, Calendar, Clock, BookOpen, FileText,AlertCircle } from 'lucide-react';
  import axios from 'axios';

  const MyExams = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchExams = async () => {
        try {
          const response = await axios.get('/api/student/exams');
          setExams(response.data?.exams || []);
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch exams');
          setLoading(false);
        }
      };
      fetchExams();
    }, []);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-purpleColor" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center">
           <div className="text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4" />
            <p className="text-xl">No exams available</p>
          </div>
        </div>
      );
    }

    if (!Array.isArray(exams) || exams.length === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4" />
            <p className="text-xl">No exams available</p>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Exams</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold mb-4">{exam.title}</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span>{exam.date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>{exam.duration} minutes</span>
                </div>
                <div className="mt-4">
                  <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300">
                    Start Exam
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default MyExams;