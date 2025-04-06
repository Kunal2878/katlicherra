import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Cookies from "js-cookie"
import { ChevronDown, Check,  BookOpen, User, FileText } from 'lucide-react'
import {setClassData} from '../../../Store/slice'
import {GetStudentByClassAPI,GetSubjectByClassAPI,GetExamsAPI,AddMarkStudentAPI} from '../../../service/api'
import {useSelector, useDispatch} from 'react-redux'
import Toast from '../../Components/Toast'

const TeachersStudentAddMarks = () => {
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [exams, setExams] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedExam, setSelectedExam] = useState('')
  const [selectedStudent, setSelectedStudent] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastIcon, setToastIcon] = useState('')
  const dispatch = useDispatch();

  // Dropdown states
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false)
  const [isExamDropdownOpen, setIsExamDropdownOpen] = useState(false)
  
  // Selected display names
  const [selectedStudentName, setSelectedStudentName] = useState('')
  const [selectedExamName, setSelectedExamName] = useState('')
  
  // Subject marks
  const [subjectMarks, setSubjectMarks] = useState([])

  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const url = import.meta.env.VITE_API_BASE_URL
  const token = Cookies.get('token')
  const user = useSelector((state) => state.userData.user);


useEffect(() => {
    if (user?.classTeacher) {
        fetchStudents()
        fetchSubjects()
        fetchExams()
    }
  }, [])

  useEffect(() => {
    if (subjects?.length > 0) {
      // Initialize subject marks array
      const initialSubjectMarks = subjects?.map(subject => ({
        subject: subject._id,
        subjectName: subject.name,
        marksObtained: '',
        maxMarks: ''
      }))
      setSubjectMarks(initialSubjectMarks)
    }
  }, [subjects])

  const fetchStudents = async () => {
    const response = await GetStudentByClassAPI(url, user?.classTeacher);
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      setStudents(response.data.students)
    } else {
      setToastMessage('Failed to fetch students')
      setToastIcon("wrong")
      setShowToast(true)
    }
  }

  const fetchSubjects = async () => {
    const response = await GetSubjectByClassAPI(url, user?.classTeacher);
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      setSubjects(response.data)
    } else {
      setToastMessage('Failed to fetch subjects')
      setToastIcon("wrong")
      setShowToast(true)
    }
  }

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

  const handleSubjectMarksChange = (index, field, value) => {
    const updatedMarks = [...subjectMarks]
    updatedMarks[index][field] = value
    setSubjectMarks(updatedMarks)
  }

  const validateForm = () => {

    if (!selectedStudent) {
      setToastMessage('Please select a student')
      setToastIcon("wrong")
      setShowToast(true)
      return false
    }
    if (!selectedExam) {
      setToastMessage('Please select an exam')
      setToastIcon("wrong")
      setShowToast(true)
      return false
    }

    // Check if at least one subject has marks
    const hasMarks = subjectMarks.some(
      mark => mark.marksObtained !== '' && mark.maxMarks !== ''
    )
    if (!hasMarks) {
      setToastMessage('Please enter marks for at least one subject')
      setToastIcon("wrong")
      setShowToast(true)
      return false
    }

    return true
  }

  const onSubmit = async () => {
    if (!validateForm()) return


      setLoading(true)
      
      // Filter out subjects with empty marks
      const validMarks = subjectMarks.filter(
        mark => mark.marksObtained !== '' && mark.maxMarks !== ''
      )
      
      // Format marks for API
      const formattedMarks = validMarks?.map(mark => ({
        subject: mark.subject,
        marksObtained: parseFloat(mark.marksObtained),
        maxMarks: parseFloat(mark.maxMarks)
      }))
      
      const markData = {
        student: selectedStudent,
        exam: selectedExam,
        studentClass: user?.classTeacher,
        marks: formattedMarks
      }

      const response = await AddMarkStudentAPI(url,markData, token)

      if (response.status === 201 || response.status === 200 || response.status === 200) {
        setToastMessage(response.message)
        setToastIcon("right")
        setShowToast(true)
        
        // Reset form

      } 
      else {
          setToastMessage(response.message)
          setToastIcon("wrong")
          setShowToast(true)
        }
        setSelectedClass('')
        setSelectedStudent('')
        setSelectedStudentName('')
        setSelectedExam('')
        setSelectedExamName('')
        setSubjectMarks([])

      setLoading(false)

  }
  return (
    <div className="min-h-screen p-6 w-full">
      <div className="min-h-full max-w-3xl flex items-center justify-center p-4">
        {showToast && <div className="fixed"><Toast message={toastMessage} iconName={toastIcon} /></div>}
        <div className="h-full w-full space-y-8 bg-white p-4">
          <div className="text-left">
            <h2 className="h2 text-black mt-5 flex flex-col items-start">Add Student Marks</h2>
          </div>

          <div className="mt-[32px] space-y-6 mb-[16px]">

            {/* Student Selection */}
            <div className="relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
              <div className="relative bg-transparent border-2 border-black-200 text-black-300 rounded-lg focus:outline">
                <button
                  type="button"
                  onClick={() => setIsStudentDropdownOpen(!isStudentDropdownOpen)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 md:py-2 border rounded-lg bg-white text-sm md:text-base`}
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

            {/* Exam Selection */}
            <div className="relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
              <div className="relative bg-transparent border-2 border-black-200 text-black-300 :focus-outline rounded-lg focus:outline">
                <button
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

            {/* Subject Marks */}
            {subjects?.length > 0 && (
              <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto mt-6 custom-scrollbar">
                <span className=" h5  px-2 md:px-3 text-sm md:text-base font-medium text-black-300  mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-danger" />
                 Add Subject Marks
                </span>
                
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {subjectMarks?.map((subjectMark, index) => (
                    <div key={subjectMark.subject} className=" text-black-300  p-4 rounded-lg border border-black-200">
                      <div className="font-medium text-base mb-3">{subjectMark.subjectName}</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-black-300 mb-1">Marks Obtained</label>
                          <input
                            type="number"
                            value={subjectMark.marksObtained}
                            onChange={(e) => handleSubjectMarksChange(index, 'marksObtained', e.target.value)}
                            className="w-full px-3 py-2 bg-transparent border-2 border-black-200 text-black-300 focus:outline rounded-md "
                            step="0.1"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-black-300 mb-1">Max Marks</label>
                          <input
                            type="number"
                            value={subjectMark.maxMarks}
                            onChange={(e) => handleSubjectMarksChange(index, 'maxMarks', e.target.value)}
                            className="w-full px-3 py-2  bg-transparent border-2 border-black-200 text-black-300 focus:outline rounded-md "
                            step="0.1"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto mt-8">
              <button
                type="button"
                onClick={onSubmit}
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-success-500 text-white focus:outline-none hover:scale-105 transition duration-200"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    Add Marks
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeachersStudentAddMarks