import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser ,setShowLogoutConfirm} from "../../../Store/slice";
import Sidebar from "./Sidebar";
import{PerformanceDashboard,Events,StudentAttendanceSystem,ProfilePage,
  TeacherDetails,StudentDetails,AssignClassSub,DeleteClassSub,RegisterClass,AddStudents,
  RegisterSubjects,UploadTimeTable,AllExams,MyAttendance,MyExams,MyResults,MySubjects,
    MyStudents,AllClasses,PaymentMethodSelector,LeaderBoard,UnderMaintenance,AllComplaints,StudentComplaints,
    CertificateGenerator,IDCardGenerator,TeacherAttendanceSystem,AllSubjects,MakeClassTeacher
    ,AllTransactions,MyTimeTable, PromoteStudents,OtherExpenses,ClassStudentFees, 
    MyDues,PasswordChange, TeacherAttendance,AddMark,TeachersStudentDetails,
    TeachersStudentLeaderBoard,TeachersStudentAddMarks,
    TeachersStudentAttendanceSystem,TeacherStudentMarksheet,ConfirmationLogout,  AllLeaveDetails,
      TeacherLeaves,TeacherFinance} from "../../Pages/index" 
    
import {
  Home,
  User,
  Users,
  BookOpen,
  Calendar,
  ChevronDown,
  X,
  Award,
  FileText,
  Clock,
  School,
  GraduationCap,
  LogOut,
  ChevronRight,
  IndianRupee,
  ShieldAlert,Hand, IdCard
} from "lucide-react";


const themeColors = {
  admin: "bg-purpleColor",
  //   teacher: 'bg-purple-600',
  //   student: 'bg-green-600'
};

const NavBar = ({ user, onMenuClick , sidebarOpen}) => {
  

  return (
    // <nav className="w-full fixed top-0 flex justify-between items-center z-40 bg-accent-100 bg-opacity-10 backdrop-blur-md shadow-sm px-6 py-4
    // ">
    <nav className={`
      w-full fixed top-0 flex justify-between items-center z-40 
      bg-accent-100 bg-opacity-10 backdrop-blur-md shadow-sm px-6 py-4
      transition-all duration-300 ease-in-out
      ${sidebarOpen ? 'lg:w-[calc(100%-18rem)] lg:ml-auto' : 'w-full'}
    `}>
      <div className="w-full flex flex-row  justify-between items-center">
        {/* Left side */}

        <div className="flex items-center space-x-3 gap-4">
          {!sidebarOpen && (
            <button
              onClick={onMenuClick}
              className=" ml-6 rounded-md  transition-colors cursor-pointer"
            >
              <ChevronRight size={24} className="text-black" />
            </button>
          )}        </div>

        <div className="flex flex-row items-center space-x-4 ">
        <Link to="/profile" className="rounded-full p-1 hover:bg-gray-100 border-2  border-purpleColor">
                    <User size={24} className="text-gray-700" />
                  </Link>
        
          
                  <div className="flex flex-col items-end mr-4">
                    <span className="text-lg font-semibold text-black-300">{user?.name}</span>
                    <span className="text-sm text-black-100">{user?.role}</span>
                  </div>
        </div>
      </div>
    </nav>
  );
};




const Nav = ({ children, path }) => {
  const showLogoutConfirm = useSelector((state) => state.userData.showLogoutConfirm)  
  const dispatch = useDispatch();
  const user =
    JSON?.parse(Cookies.get("user" || "student" || "teacher")) || "{}";
  if (user !== null || user !== undefined) {
    dispatch(setUser(user));
  }
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="w-full flex flex-col overflow-auto custom-scrollbar">
      <Sidebar
        isOpen={sidebarOpen}
        role={user.role}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      
      {/* Navbar - should not shift on large screens */}
      <div className={`
        w-full transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'lg:w-[calc(100%-18rem)]' : 'w-full'} 
        lg:ml-auto
      `}>
        <NavBar user={user} onMenuClick={() => setSidebarOpen(!sidebarOpen)}   sidebarOpen={sidebarOpen} />
      </div>
      
      {/* Content area - should contract rather than shift */}
      <div className={`
        w-full min-h-screen mt-5 pt-16
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'lg:w-[calc(100%-18rem)] lg:ml-auto' : 'w-full'}
        ${showLogoutConfirm ? 'blur-sm' : ''}
      `}>


        {path === "/dashboard" && <PerformanceDashboard />}
        {path === "/mark-attendance" && <StudentAttendanceSystem />}
        {path === "/profile" && <ProfilePage />}
        {path === "/all-students" && <StudentDetails />}
        {path === "/all-teachers" && <TeacherDetails />}
        {path === "/assign-classes-subjects" && <AssignClassSub />}
        {path === "/delete-classes-subjects" && <DeleteClassSub />}
        {path === "/events" && <Events />}
        {path === "/register-class" && <RegisterClass />}
        {path === "/add-students" && <AddStudents />}
        {path === "/add-teachers" && <AddTeachers />}
        {path === "/time-table" && <UploadTimeTable />}
        {path === "/all-exams" && <AllExams />}
        {path === "/my-attendance" && <MyAttendance />}
        {path === "/my-exams" && <UnderMaintenance />}
        {path === "/my-subjects" && <MySubjects />}
        {path === "/my-results" && <MyResults />}
        {path === "/my-students" && <MyStudents />}
        {path === "/all-classes" && <AllClasses />}
        {path === "/payment-modes" && <PaymentMethodSelector />}
        {path === "/all-subjects" && <AllSubjects />}
        {path === "/leaderboard" && <LeaderBoard />}
        {path === "/add-marks" && <LeaderBoard />}
        {path === "/my-time-table" && <MyTimeTable/>}
        {path === "/finance" && <UnderMaintenance />}
        {path === "/teacher-id-card" && <UnderMaintenance />}
        {path === "/complaints" && <AllComplaints/>}
        {path === "/my-complaints" && <StudentComplaints/>}
        {path === "/certificate" && <CertificateGenerator/>}
        {path === "/id-card" && <IDCardGenerator/>}
        {path === "/teacher-attendance" && <TeacherAttendanceSystem/>}
        {path === "/class-teacher" && <MakeClassTeacher/>}
        {path === "/all-transactions" && <AllTransactions/>}
        {path === "/student-promotion" && <PromoteStudents/>}
        {path === "/other-expenses" && <OtherExpenses/>}
        {path === "/student-finance" && <ClassStudentFees/>}
        {path === "/my-dues" && <MyDues/>}
        {path === "/change-password" && <PasswordChange/>}
        {path === "/my-attendance-teacher" && <TeacherAttendance/>}
        {path === "/grades-upload" && <AddMark/>}
        {path === "/student-list-teacher" && <TeachersStudentDetails/>}
        {path === "/student-leaderboard-teacher" && <TeachersStudentLeaderBoard/>}
        {path === "/add-marks-student" && <TeachersStudentAddMarks/>}
        {path === "/student-attendance-teacher" && <TeachersStudentAttendanceSystem/>}
        {path === "/student-marksheet" && <TeacherStudentMarksheet/>}
        {path === "/leave-records" && <AllLeaveDetails/>}
        {path === "/teacher-leave-records" && <TeacherLeaves/>}
        {path === "/teacher-finance-data" && <TeacherFinance/>}

      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <ConfirmationLogout />
        </div>
      )}

      <main
        className={`
        pt-16
        transition-all duration-300
        ${sidebarOpen ? 'lg:w-[calc(100%-18rem)] lg:ml-auto' : 'w-full'}
        ${showLogoutConfirm ? 'blur-sm' : ''}
      `}
      >
        {children}
      </main>
    </div>
  );
};
export default Nav;
