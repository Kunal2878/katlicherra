import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Cookies from "js-cookie"
import { School2, ChevronDown, Check, School, BookOpen, User, FileText, Calendar } from 'lucide-react'
import {setClassData} from '../../../Store/slice'
import {GetClasses, GetAllClassesAPI,GetStudentByClassAPI, AddStudentTransactionAPI} from '../../../service/api'
import {useSelector, useDispatch} from 'react-redux'
import Toast from '../../Components/Toast'

const AddStudentFees = () => {
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastIcon, setToastIcon] = useState('')
  const classes = useSelector((state) => state.userData.ClassData);
  const dispatch = useDispatch();

  // Dropdown states
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false)
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false)
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  
  // Selected display names
  const [selectedClassName, setSelectedClassName] = useState('')
  const [selectedStudentName, setSelectedStudentName] = useState('')
  const [selectedStatusName, setSelectedStatusName] = useState('')

  // Months array
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ]

  // Status options
  const statusOptions = ["paid", "not paid"]

  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const url = import.meta.env.VITE_API_BASE_URL
  const token = Cookies.get('token')

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass)
    }
  }, [selectedClass])

  const fetchClasses = async () => {
    const response = await GetAllClassesAPI(url);
    if (response.status === 200 || response.status === 204 || response.status === 201) {
      dispatch(setClassData(response.data.classes));
    } else {
      setToastMessage('Failed to fetch classes')
      setToastIcon("wrong")
      setShowToast(true)
    }
  }

  const fetchStudents = async (classId) => {
    const response = await GetStudentByClassAPI(url, classId);
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      setStudents(response.data.students)
    } else {
      setToastMessage('Failed to fetch students')
      setToastIcon("wrong")
      setShowToast(true)
    }
  }

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

  const selectMonth = (month) => {
    setSelectedMonth(month)
    setIsMonthDropdownOpen(false)
  }

  const selectStatus = (status) => {
    setSelectedStatus(status)
    setSelectedStatusName(status)
    setIsStatusDropdownOpen(false)
  }

  const validateForm = () => {
    if (!selectedClass) {
      setToastMessage('Please select a class')
      setToastIcon("wrong")
      setShowToast(true)
      return false
    }
    if (!selectedStudent) {
      setToastMessage('Please select a student')
      setToastIcon("wrong")
      setShowToast(true)
      return false
    }
    if (!selectedMonth) {
      setToastMessage('Please select a month')
      setToastIcon("wrong")
      setShowToast(true)
      return false
    }
    if (!selectedStatus) {
      setToastMessage('Please select a payment status')
      setToastIcon("wrong")
      setShowToast(true)
      return false
    }
    return true
  }

  const onSubmit = async () => {
    if (!validateForm()) return

    try {
      setLoading(true)
      
      const feeData = {
        student: selectedStudent,
        month: selectedMonth,
        status: selectedStatus
      }
      
      console.log(feeData)
      const response = await AddStudentTransactionAPI(url, feeData, token)

      if (response.status === 201 || response.status === 200 || response.status === 204) {
        setToastMessage('Fee added successfully!')
        setToastIcon("right")
        setShowToast(true)
        
        // Reset form
        setSelectedClass('')
        setSelectedClassName('')
        setSelectedStudent('')
        setSelectedStudentName('')
        setSelectedMonth('')
        setSelectedStatus('')
        setSelectedStatusName('')
      } else {
        setToastMessage('Failed to add fee')
        setToastIcon("wrong")
        setShowToast(true)
      }
    } catch (error) {
      console.error('Error adding fee:', error)
      setToastMessage('Failed to add fee')
      setToastIcon("wrong")
      setShowToast(true)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen p-4 w-full">
      <div className="min-h-full max-w-3xl flex items-center justify-center p-4">
        {showToast && <div className="fixed"><Toast message={toastMessage} iconName={toastIcon} /></div>}
        <div className="h-full w-full space-y-8 bg-white">
          <div className="text-left">
            <h2 className="h2 text-black mt-5 flex flex-col items-start">Add Student Fee</h2>
          </div>

          <div className="mt-[32px] space-y-6 mb-[16px]">
            {/* Class Selection */}
            <div className="relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
              <div className="relative bg-transparent border-2 border-black-200 text-black-300 rounded-lg focus:outline">
                <button
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

            {/* Student Selection */}
            <div className="relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
              <div className="relative bg-transparent border-2 border-black-200 text-black-300 rounded-lg focus:outline">
                <button
                  type="button"
                  onClick={() => setIsStudentDropdownOpen(!isStudentDropdownOpen)}
                  disabled={!selectedClass}
                  className={`w-full flex items-center justify-between px-2 py-1.5 md:py-2 border rounded-lg bg-white text-sm md:text-base ${!selectedClass ? 'opacity-70 cursor-not-allowed' : ''}`}
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

            {/* Month Selection */}
            <div className="relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
              <div className="relative bg-transparent border-2 border-black-200 text-black-300 rounded-lg focus:outline">
                <button
                  type="button"
                  onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                  disabled={!selectedStudent}
                  className={`w-full flex items-center justify-between px-2 py-1.5 md:py-2 border rounded-lg bg-white text-sm md:text-base ${!selectedStudent ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2 text-danger" />
                    <span className="h5 text-black">
                      {selectedMonth || "Select Month"}
                    </span>
                  </div>
                  <ChevronDown size={24} className="text-black" />
                </button>
                {isMonthDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {months.map((month) => (
                      <div
                        key={month}
                        onClick={() => selectMonth(month)}
                        className="flex items-center px-2 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 cursor-pointer text-black-300 text-sm md:text-base"
                      >
                        <div
                          className={`w-3 h-3 md:w-4 md:h-4 border rounded mr-2 flex items-center justify-center ${
                            selectedMonth === month
                              ? "bg-purple-500 text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedMonth === month && (
                            <Check className="w-2 h-2 md:w-3 md:h-3 text-black-300" />
                          )}
                        </div>
                        {month}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Status Selection */}
            <div className="relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
              <div className="relative bg-transparent border-2 border-black-200 text-black-300 rounded-lg focus:outline">
                <button
                  type="button"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  disabled={!selectedMonth}
                  className={`w-full flex items-center justify-between px-2 py-1.5 md:py-2 border rounded-lg bg-white text-sm md:text-base ${!selectedMonth ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 md:w-5 md:h-5 mr-2 text-danger" />
                    <span className="h5 text-black">
                      {selectedStatusName || "Select Payment Status"}
                    </span>
                  </div>
                  <ChevronDown size={24} className="text-black" />
                </button>
                {isStatusDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {statusOptions.map((status) => (
                      <div
                        key={status}
                        onClick={() => selectStatus(status)}
                        className="flex items-center px-2 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 cursor-pointer text-black-300 text-sm md:text-base"
                      >
                        <div
                          className={`w-3 h-3 md:w-4 md:h-4 border rounded mr-2 flex items-center justify-center ${
                            selectedStatus === status
                              ? "bg-purple-500 text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedStatus === status && (
                            <Check className="w-2 h-2 md:w-3 md:h-3 text-black-300" />
                          )}
                        </div>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

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
                    Add Fee
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

export default AddStudentFees