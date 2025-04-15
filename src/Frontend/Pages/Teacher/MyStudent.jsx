import React, { useState, useEffect } from 'react';
import { Search, Trash2, PenSquare, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClass, setSelectedClass] = useState('all');
  const studentsPerPage = 10;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://katlicherra-backend-v2.onrender.com/api/v1/student/class/67adcc61b9b56ef6a16fc907');
        if (response.data.statusCode === 200) {
          setStudents(response.data.data.students);
        } else {
          setError('Failed to fetch students');
        }
      } catch (err) {
        setError('Error connecting to the server');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedClass === 'all' || student.studentClass === selectedClass)
  );

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-danger">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen mt-12">
      <div className="flex flex-col md:flex-row text-gray-600 justify-between items-start md:items-center mb-6 bg-purple-50 p-2">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-semibold mb-2">All Students </h1>
          <div className="flex items-center text-sm ">
            <span className="mr-2">Home /</span>
            <span>Students</span>
          </div>
        </div>

        <Link to="/add-students" className="px-4 py-2 border-2 border-purple-500 text-sm text-purple-500 rounded-lg transition-colors duration-200 transform hover:scale-105">
          + Add Student
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md bg-slate-100 text-gray-600">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={20} />
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-primary-300 text-black-300 border-lamaSkyLight pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
          />
        </div>
        
        <div className="flex gap-4">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="p-2 mr-4 bg-slate-100 text-gray-600 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
          >
            <option value="all">All Classes</option>
            <option value="67adcc61b9b56ef6a16fc907">Class 1</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto text-gray-600 text-xs">
        <table className="w-full min-w-[768px] pb-10">
          <thead className='bg-purple-50'>
            <tr className="border-b">
              <th className="p-4">
                <input type="checkbox" className="rounded bg-white accent-purple-500" />
              </th>
              <th className="p-4 text-left">Student's Name</th>
              <th className="p-4 text-center">Email</th>
              <th className="p-4 text-center">Role</th>
              <th className="p-4 text-center">Class</th>
              <th className="p-4 text-center">Section</th>
              <th className="p-4 text-center">Parent Name</th>
              <th className="p-4 text-center">Parent Contact</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student) => (
              <tr
                key={student._id}
                className="border-b hover:bg-gray-50 transition-colors duration-150 animate-fade-in"
              >
                <td className="p-4">
                  <input type="checkbox" className="rounded bg-white accent-purple-500" />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full overflow-hidden flex flex-row justify-center items-center">
                      <GraduationCap size={20}/>
                    </div>
                    <span className="hover:text-purple-500 transition-colors duration-200">
                      {student.name}
                    </span>
                  </div>
                </td>
                <td className="p-4">{student.email}</td>
                <td className="p-4">{student.role}</td>
                <td className="p-4">{student.studentClass}</td>
                <td className="p-4">{student.section || '-'}</td>
                <td className="p-4">{student.parentName}</td>
                <td className="p-4">{student.parentContact}</td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button className="p-1 hover:text-danger transition-colors duration-200 transform hover:scale-110">
                      <Trash2 size={18} />
                    </button>
                    <button className="p-1 hover:text-purple-500 transition-colors duration-200 transform hover:scale-110">
                      <PenSquare size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex justify-between items-center max-w-screen-xl mx-auto">
          <span className="text-sm text-gray-600">
            Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, filteredStudents.length)} of {filteredStudents.length} entries
          </span>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded transition-all duration-200 transform hover:scale-105 ${
                  currentPage === i + 1
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = document.createElement('style');
styles.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;
document.head.appendChild(styles);

export default MyStudents;