

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Cookies from "js-cookie"
import { 
  ChevronDown, 
  Check, 
  School, 
  BookOpen, 
  User, 
  FileText, 
  GraduationCap, 
  Trophy 
} from 'lucide-react'
import { setClassData, setIsLeaderBoardUpdate } from '../../../Store/slice'
import { 
  GetStudentByClassAPI, 
  GetSubjectByClassAPI, 
  GetExamsAPI, 
  AddMarkStudentAPI, 
  GetAllClassesAPI 
} from '../../../service/api'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

const AddMark = () => {
  // Loading and error states
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [exams, setExams] = useState([])

  // Selection states
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedExam, setSelectedExam] = useState('')
  const [selectedStudent, setSelectedStudent] = useState('')

  // Dropdown visibility states
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false)
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false)
  const [isExamDropdownOpen, setIsExamDropdownOpen] = useState(false)

  // Display name states
  const [selectedClassName, setSelectedClassName] = useState('')
  const [selectedStudentName, setSelectedStudentName] = useState('')
  const [selectedExamName, setSelectedExamName] = useState('')

  // Subject marks
  const [subjectMarks, setSubjectMarks] = useState([])
  
  // Form validation state
  const [isFormValid, setIsFormValid] = useState(false)

  // Toast and notification states
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('')

  // Redux hooks
  const classes = useSelector((state) => state.userData.ClassData)
  const dispatch = useDispatch()

  // Form hook
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm()

  // Environment and authentication
  const url = import.meta.env.VITE_API_BASE_URL
  const token = Cookies.get('token')

  // Color schemes for subject cards
  const cardColors = [
    { bg: 'bg-gradient-to-br from-purpleColor to-blue-700', border: 'border-blue-200', label: 'text-white', status: 'Incomplete' },
    { bg: 'bg-gradient-to-br from-red-400 to-blue-700', border: 'border-green-200', label: 'text-white', status: 'Completed' },
    { bg: 'bg-gradient-to-br from-cyan-500 to-blue-700', border: 'border-purple-200', label: 'text-white', status: 'Incomplete' },
  ]

  // Fetch initial data
  useEffect(() => {
    const initializeFetch = async () => {
      await fetchClasses()
      await fetchExams()
    }
    initializeFetch()
  }, [])

  // Fetch students and subjects when class is selected
  useEffect(() => {
    if (selectedClass) {
      const fetchClassData = async () => {
        await fetchStudents(selectedClass)
        await fetchSubjects(selectedClass)
      }
      fetchClassData()
    }
  }, [selectedClass])

  // Initialize subject marks when subjects are loaded
  useEffect(() => {
    if (subjects?.length > 0) {
      const initialSubjectMarks = subjects.map(subject => ({
        subject: subject._id,
        subjectName: subject.name,
        marksObtained: '',
        maxMarks: '100'
      }))
      setSubjectMarks(initialSubjectMarks)
      setIsFormValid(false)
    }
  }, [subjects])

  // Check form validity whenever subject marks change
  useEffect(() => {
    checkFormValidity()
  }, [subjectMarks, selectedClass, selectedStudent, selectedExam])

  // Toast notification effect
  useEffect(() => {
    if (showToast) {
      toast[toastType](toastMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      setShowToast(false)
    }
  }, [showToast, toastMessage, toastType])

  // Fetch methods
  const fetchClasses = async () => {
    try {
      const response = await GetAllClassesAPI(url)
      if (response.status === 200 || response.status === 204 || response.status === 201) {
        dispatch(setClassData(response.data.classes))
      } else {
        setShowToast(true)
        setToastMessage(response.message || 'Failed to fetch classes')
        setToastType("error")
      }
    } catch (error) {
      setShowToast(true)
      setToastMessage('Error fetching classes')
      setToastType("error")
    }
  }

  const fetchStudents = async (classId) => {
    setStudents([])
    try {
      const response = await GetStudentByClassAPI(url, classId)
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        setStudents(response.data.students)
      } else {
        setShowToast(true)
        setToastMessage(response.message || 'Failed to fetch students')
        setToastType("error")
      }
    } catch (error) {
      setShowToast(true)
      setToastMessage('Error fetching students')
      setToastType("error")
    }
  }

  const fetchSubjects = async (classId) => {
    setSubjects([])
    try {
      const response = await GetSubjectByClassAPI(url, classId)
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        setSubjects(response.data)
      } else {
        setShowToast(true)
        setToastMessage(response.message || 'Failed to fetch subjects')
        setToastType("error")
      }
    } catch (error) {
      setShowToast(true)
      setToastMessage('Error fetching subjects')
      setToastType("error")
    }
  }

  const fetchExams = async () => {
    try {
      const response = await GetExamsAPI(url)
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        setExams(response.data.exams)
      } else {
        setShowToast(true)
        setToastMessage(response.message || 'Failed to fetch exams')
        setToastType("error")
      }
    } catch (error) {
      setShowToast(true)
      setToastMessage('Error fetching exams')
      setToastType("error")
    }
  }

  // Selection methods
  const selectClass = (classItem) => {
    setSelectedClass(classItem._id)
    setSelectedClassName(classItem.className)
    setIsClassDropdownOpen(false)
  }

  const selectStudent = (student) => {
    setSelectedStudent(student._id)
    setSelectedStudentName(student.name)
    setIsStudentDropdownOpen(false)
  }

  const selectExam = (exam) => {
    setSelectedExam(exam._id)
    setSelectedExamName(exam.name)
    setIsExamDropdownOpen(false)
  }

  // Marks handling methods
  const handleSubjectMarksChange = (index, field, value) => {
    const updatedMarks = [...subjectMarks]
    updatedMarks[index][field] = value
    setSubjectMarks(updatedMarks)
  }

  // Check if all form fields are valid
  const checkFormValidity = () => {
    // Check if class, student, and exam are selected
    if (!selectedClass || !selectedStudent || !selectedExam || subjects.length === 0) {
      setIsFormValid(false)
      return
    }
    
    // Check if all subjects have marks entered
    const allSubjectsHaveMarks = subjectMarks.every(
      mark => mark.marksObtained !== '' && 
              mark.marksObtained !== undefined && 
              mark.maxMarks !== '' && 
              mark.maxMarks !== undefined
    )
    
    setIsFormValid(allSubjectsHaveMarks)
  }

  // Form validation and submission
  const validateForm = () => {
    if (!selectedClass) {
      setShowToast(true)
      setToastMessage('Please select a class')
      setToastType("error")
      return false
    }
    if (!selectedStudent) {
      setShowToast(true)
      setToastMessage('Please select a student')
      setToastType("error")
      return false
    }
    if (!selectedExam) {
      setShowToast(true)
      setToastMessage('Please select an exam')
      setToastType("error")
      return false
    }

    // Check if all subjects have marks
    const allSubjectsHaveMarks = subjectMarks.every(
      mark => mark.marksObtained !== '' && mark.maxMarks !== ''
    )
    
    if (!allSubjectsHaveMarks) {
      setShowToast(true)
      setToastMessage('Please enter marks for all subjects')
      setToastType("error")
      return false
    }

    return true
  }

  const onSubmit = async () => {
    if (!validateForm()) return

    try {
      setLoading(true)
      
      const formattedMarks = subjectMarks.map(mark => ({
        subject: mark.subject,
        marksObtained: parseFloat(mark.marksObtained),
        maxMarks: parseFloat(mark.maxMarks)
      }))
      
      const markData = {
        student: selectedStudent,
        exam: selectedExam,
        studentClass: selectedClass,
        marks: formattedMarks
      }

      const response = await AddMarkStudentAPI(url, markData, token)

      if (response.status === 201 || response.status === 200) {
        setShowToast(true)
        setToastMessage(response.message || 'Marks added successfully')
        setToastType("success")

        // Reset form
        setSelectedClass('')
        setSelectedClassName('')
        setSelectedStudent('')
        setSelectedStudentName('')
        setSelectedExam('')
        setSelectedExamName('')
        setSubjectMarks([])
        setIsFormValid(false)

        dispatch(setIsLeaderBoardUpdate(true))
      } else {
        setShowToast(true)
        setToastMessage(response.message || 'Failed to add marks')
        setToastType("error")
      }
    } catch (error) {
      setShowToast(true)
      setToastMessage(error.response?.data?.message || 'Failed to add marks')
      setToastType("error")
    } finally {
      setLoading(false)
    }
  }

  // Helper to determine if mark is entered
  const isMarkEntered = (index) => {
    return subjectMarks[index]?.marksObtained !== '' && subjectMarks[index]?.marksObtained !== undefined
  }

  // Helper to get status label
  const getStatusLabel = (index) => {
    return isMarkEntered(index) ? 'Completed' : 'Incomplete'
  }

  // Helper to get status color
  const getStatusColor = (index) => {
    return isMarkEntered(index) ? 'text-green-500' : 'text-danger'
  }

  return (
    <div className="min-h-screen w-full  justify-center sm:px-16 px-6 sm:py-16 py-10">
      <div className="flex flex-col md:flex-row text-black justify-between items-start md:items-center mb-[32px] p-2">
        <div className="mb-4 md:mb-0 text-left">
          <h2 className="h2 mb-2 text-left">Grades Upload</h2>
          <div className="flex items-center subtitle-2 text-left">
            <span className="text-left">Exam / </span>
            <span className="text-left">Grades Upload</span>
          </div>
        </div>
      </div>

      <div className="min-h-full w-full flex flex-col items-center justify-center p-4">
        <div className="h-full max-w-4xl space-y-10 bg-white p-4">
          <div className="text-left">
            <h2 className="h2 text-black mt-5 flex flex-col items-start">Upload Grades</h2>
          </div>

          <div className="mt-[32px] space-y-6 mb-[16px]">
            {/* Class Dropdown */}
            <div className="relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
              <label htmlFor="class-select" className="h5 text-sm md:text-base font-medium text-black-300 text-left">
                Select Class
              </label>
              <div className="relative bg-transparent border-2 border-black-200 text-black-300 rounded-lg focus:outline">
                <button
                  id="class-select"
                  type="button"
                  onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
                  className="w-full flex items-center justify-between px-2 py-1.5 md:py-2 border rounded-lg bg-white text-sm md:text-base"
                >
                  <div className="flex items-center">
                    <School className="w-4 h-4 md:w-5 md:h-5 mr-2 text-danger" />
                    <span className="h5 text-black">
                      {selectedClassName || "Select Class"}
                    </span>
                  </div>
                  <ChevronDown size={24} className="text-black" />
                </button>
                {isClassDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {classes?.map((classItem) => (
                      <div
                        key={classItem._id}
                        onClick={() => selectClass(classItem)}
                        className="flex items-center px-2 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 cursor-pointer text-black-300 text-sm md:text-base"
                      >
                        <div
                          className={`w-3 h-3 md:w-4 md:h-4 border rounded mr-2 flex items-center justify-center ${
                            selectedClass === classItem._id
                              ? "bg-purple-500 text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedClass === classItem._id && (
                            <Check className="w-2 h-2 md:w-3 md:h-3 text-black-300" />
                          )}
                        </div>
                        {classItem.className}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Student Dropdown */}
            <div className="relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
              <label htmlFor="student-select" className="h5 text-sm md:text-base font-medium text-black-300">
                Select Student
              </label>
              <div className="relative bg-transparent border-2 border-black-200 text-black-300 rounded-lg focus:outline">
                <button
                  id="student-select"
                  type="button"
                  onClick={() => setIsStudentDropdownOpen(!isStudentDropdownOpen)}
                  disabled={!selectedClass}
                  className={`w-full flex items-center justify-between px-2 py-1.5 md:py-2 border rounded-lg bg-white text-sm md:text-base ${!selectedClass ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center">
                    <User className="w-4 h-4 md:w-5 md:h-5 mr-2 text-danger" />
                    <span className="h5 text-black">
                      {selectedStudentName || "Select Student"}
                    </span>
                  </div>
                  <ChevronDown size={24} className="text-black" />
                </button>
                {isStudentDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {students?.map((student) => (
                      <div
                        key={student._id}
                        onClick={() => selectStudent(student)}
                        className="flex items-center px-2 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 cursor-pointer text-black-300 text-sm md:text-base"
                      >
                        <div
                          className={`w-3 h-3 md:w-4 md:h-4 border rounded mr-2 flex items-center justify-center ${
                            selectedStudent === student._id
                              ? "bg-purple-500 text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedStudent === student._id && (
                            <Check className="w-2 h-2 md:w-3 md:h-3 text-black-300" />
                          )}
                        </div>
                        {student.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Exam Dropdown */}
            <div className="relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
              <label htmlFor="exam-select" className="h5 text-sm md:text-base font-medium text-black-300">
                Select Exam
              </label>
              <div className="relative bg-transparent border-2 border-black-200 text-black-300 rounded-lg focus:outline">
                <button
                  id="exam-select"
                  type="button"
                  onClick={() => setIsExamDropdownOpen(!isExamDropdownOpen)}
                  className="w-full flex items-center justify-between px-2 py-1.5 md:py-2 border rounded-lg bg-white text-sm md:text-base"
                >
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 md:w-5 md:h-5 mr-2 text-danger" />
                    <span className="h5 text-black">
                      {selectedExamName || "Select Exam"}
                    </span>
                  </div>
                  <ChevronDown size={24} className="text-black" />
                </button>
                {isExamDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {exams?.map((exam) => (
                      <div
                        key={exam._id}
                        onClick={() => selectExam(exam)}
                        className="flex items-center px-2 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 cursor-pointer text-black-300 text-sm md:text-base"
                      >
                        <div
                          className={`w-3 h-3 md:w-4 md:h-4 border rounded mr-2 flex items-center justify-center ${
                            selectedExam === exam._id
                              ? "bg-purple-500 text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedExam === exam._id && (
                            <Check className="w-2 h-2 md:w-3 md:h-3 text-black-300" />
                          )}
                        </div>
                        {exam.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto mt-8">
              <button
                type="button"
                onClick={onSubmit}
                disabled={loading || !isFormValid}
                className={`w-full flex items-center justify-center py-3 px-4 rounded-lg ${
                  isFormValid ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'
                } text-white focus:outline-none transition duration-200`}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  "Add Grades"
                )}
              </button>
              
              {selectedClass && subjects?.length > 0 && !isFormValid && (
                <p className="text-danger text-sm mt-2 text-center">
                  Please enter marks for all subjects to enable submission
                </p>
              )}
            </div>
          </div>
        </div>

        {selectedClass && subjects?.length > 0 && (
          <div className="w-full mx-auto mt-8">
            <h3 className="text-black font-medium mb-4 text-left">Your Added Grades:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject, index) => (
                <div 
                  key={subject._id} 
                  className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow-lg relative"
                >
                  <div className="px-4 py-4 flex items-start justify-between">
                    <div>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full ${subjectMarks[index]?.marksObtained ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                        <h4 className="text-gray-300 font-medium text-sm truncate">{subject.name}</h4>
                      </div>
                      <p className="text-gray-400 text-xs mt-1">Subject</p>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${subjectMarks[index]?.marksObtained ? 'bg-green-500 bg-opacity-20 text-green-400' : 'bg-red-500 bg-opacity-20 text-red-400'}`}>
                      {subjectMarks[index]?.marksObtained ? 'Completed' : 'Incomplete'}
                    </div>
                  </div>
                  
                  <div className="px-4 py-2">
                    <div className="mb-2">
                      <label className="text-gray-400 text-xs block mb-1">
                        Marks Obtained
                      </label>
                      <input
                        type="number"
                        value={subjectMarks[index]?.marksObtained || ''}
                        onChange={(e) => {
                          const value = e.target.value === '' ? '' : Number(e.target.value)
                          const maxMarks = subjectMarks[index]?.maxMarks || 100
                          if (value === '' || (value <= maxMarks && value >= 0)) {
                            handleSubjectMarksChange(index, 'marksObtained', value)
                          }
                        }}
                        className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purpleColor"
                        step="1"
                        min="0"
                        max={subjectMarks[index]?.maxMarks || 100}
                        placeholder="Enter marks"
                      />
                    </div>
                    
                    <div>
                      <label className="text-gray-400 text-xs block mb-1">
                        Max Marks
                      </label>
                      <input
                        type="number"
                        value={subjectMarks[index]?.maxMarks || 100}
                        onChange={(e) => {
                          const value = Number(e.target.value)
                          if (value >= 0 && value <= 100) {
                            handleSubjectMarksChange(index, 'maxMarks', value || 100)
                          }
                        }}
                        className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purpleColor"
                        step="1"
                        min="0"
                        max="100"
                        placeholder="Max marks"
                      />
                    </div>                     
                  </div>                   
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AddMark