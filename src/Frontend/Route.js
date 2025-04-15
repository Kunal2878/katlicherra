    // Principal endpoints
    export const SignupPrincipal = 'principal/register'
    export const LoginPrincipal = 'principal/login'
    export const Accept_RejectLeaveRequest = 'principal/accept-teachers-leave'
    export const DeleteLeaveRequest = 'teacher/delete-teacher-leave'
    export const GetAllLeaves = 'principal/get-teachers-leave'
    export const AcceptRejectPayReq = 'principal/update-payment-request'
    export const GetTeacherExpense = 'principal/get-teacher-expense'
    

    // Teacher endpoints
    export const SignupTeacher = 'teacher/register'
    export const LoginTeacher = 'teacher/login'
    export const GetAllTeacher = 'teacher/all-teachers'
    export const MarkTeacherAttendance = 'teacher/attendance/mark'
    export const GetTeacherAttendance = 'teacher/getattendancehistory'
    export const GetAllTeacherCount = 'teacher'
    export const AssignClassSubject = 'teacher/assign-classes-and-subjects'
    export const GetTeacherByID = 'teacher'
    export const PasswordChange = 'teacher/change-password'
    export const GetAllTeachers = 'teacher/all-teachers/no-pagination'
    export const SendLeave = 'teacher/send-leave-request'
    export const GetAllLeaveTeacher = 'teacher/get-all-leaves'
    export const SendAdvPayReq = 'teacher/send-adv-pay-req'
    export const DeleteTeacher = "principal/delete-teacher"

    // Student endpoints
    export const SignupStudent = 'student/register'
    export const LoginStudent = 'student/login'
    export const GetAllStudent = 'student/getallstudents'
    export const GetStudentByID = "student/getstudentbyid"
    export const GetAllStudentCount = 'student/getallstudentcount'
    export const GetLeaderBoard = 'mark/leaderboard'
    export const AddMarkStudent = 'mark/add-mark'
    export const UpdateStudent = 'student/update-student'
    export const GetStudentAttendanceByID = 'student-attendance//students'
    export const AddStudentTransaction = 'student/fee-payment/pay-fee'
    export const GetClassFeeTransaction='student/fee-payment/history/class'
    export const GetStudentFeeTransaction ='student/fee-payment/history/student'
    export const GetGenderRatio = "student/gender-ratio"
    export const ImposeFine = "student/fee-payment/impose-fine"
    export const DeleteStudent = "principal/delete-students"
    

    // Class endpoints
    export const CreateClass = 'class/register'
    export const GetAllClass = 'class/all-classes'
    export const GetStudentByClass = "student/getstudentbyclassid"
    export const UpdateClassDetails ='class/update-class'
    export const GetAllClasses = 'class/all-classes/no-pagination'
    export const DeleteClass = 'class/delete-class'
    
    



// Subject endpoints
    export const CreateSubject = 'subject/register'
    export const GetAllSubjects = 'subject/getAllSubjects'
    export const GetSubjectByClass = 'subject/getsubjectsbyclass'

// Exam endpoints

export const CreateExam = 'principal/create-exam'
export const GetAllExams = 'principal/getallexams'
export const UploadExamTimeTable = 'principal/upload-exam-timetable'
export const DeleteExam = 'principal/delete-exam'

// Events
export const CreateEvent = 'event/create-event'
export const DeleteEvent = 'event/delete-events'
export const GetAllEvents = 'event/getallevents'

// Announcements
export const CreateAnnouncement = 'announcement/create-announcement'
export const DeleteAnnouncement = 'announcement/delete-announcement'
export const GetAllAnnouncements = 'announcement/getallannouncements'
//Complaints
export const CreateComplaint = 'student-complain/create-complaint'
export const GetAllComplaints= 'student-complain/getallcomplaints'
export const DeleteComplaint= 'student-complain/delete-complaint'
//KhataBook
export const AddTransaction = 'teacher/payment-records'
export const GetTransactionsByTeacher = 'teacher/payment-records/teacher'
export const FilterTransaction = 'teacher/payment-records/teachers'

//Other Expenses
export const AddOtherExpense = 'principal/expenses/add'
export const GetOtherExpense= 'principal/expenses/getAllExpenses'
export const DeleteOtherExpenseByID='principal/expenses/delete'



