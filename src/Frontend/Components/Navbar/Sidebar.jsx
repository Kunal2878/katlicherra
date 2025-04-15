
import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom"
import { useDispatch } from "react-redux";
import { setShowLogoutConfirm} from "../../../Store/slice";
import {katlicherra} from '../../../assets/index'
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
const Sidebar = ({ isOpen, role, onMenuClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const [expandedMenus, setExpandedMenus] = useState({});
  const dispatch = useDispatch()
  const themeColors = {
    admin: "bg-purpleColor",
    //   teacher: 'bg-purple-600',
    //   student: 'bg-green-600'
  };
  useEffect(() => {
    setMenuOpen(isOpen);
  }, [isOpen]);
  
  const menuItems = {
    admin: [
      { icon: Home, label: "Home", id: "home", path: "/dashboard" },
      {
        icon: GraduationCap,
        label: "Student Details",
        id: "students",
        submenu: [
          { label: "Student List", id: "all-students", path: "/all-students" },
            {
            label: " Student Leaderboard",
            id: "leaderboard",
            path: "/leaderboard",
          },
            {
            label: " Student Promotion",
            id: "student-promotion",
            path: "/student-promotion",
          },
         
        ],
      },
      { icon:IdCard,
        label: "Card Management",
        id:"card-management",
        submenu:[
          { label: "Student ID Card", id: "id-card", path: "/id-card" },
          { label: "Teacher ID Card", id: "teacher-id-card", path: "/teacher-id-card" },
          { label: "Certificate", id: "certificate", path: "/certificate" },
        ]

      },

      { icon:Hand,
        label:"Attendance",
        id:"attendance",
        submenu:[
          {
           label: "Student Attendance",
           id: "student-attendance",
           path: "/mark-attendance",
         },
          {
           label: "Teacher Attendance",
           id: "teacher-attendance",
           path: "/teacher-attendance",
         },
         
         {
           label: "Leave Records",
           id: "leave-records",
           path: "/leave-records",
         },

        ]

      },

      {
        icon:IndianRupee,
        label:'Accounting',
        id:'accounting',
        submenu:[
          {
            label: "Student Finance",
            id: "student-finance",
            path: "/student-finance",
          },
          {
            label: "Teacher Finance",
            id: "all-transactions",
            path: "/all-transactions",
          },
          {
            label: "Other Expenses",
            id: "other-expenses",
            path: "/other-expenses",
          },
        ]

      },


    
      {
        icon: School,
        label: "Academic",
        id: "academic",
        submenu: [
          {
            label: "All Classes",
            id: "all-classes",
            path: "/all-classes",
          },
           {
        icon: Clock,
        label: "Time table",
        id: "time-table",
        path: "/time-table",
      },
          { label: "Make Class Teacher", id: "class-teacher", path: "/class-teacher" },
         
          {
            label: "Assign classes-Subjects",
            id: "assign-classes-subjects",
            path: "/assign-classes-subjects",
          },
          {
            label: "Delete classes-Subjects",
            id: "delete-classes-subjects",
            path: "/delete-classes-subjects",
          },
            { label: "All Subjects", id: "all-subjects", path: "/all-subjects" },
         
        ],
      },

        {
        icon: Users,
        label: "Teachers",
        id: "teachers",
        submenu: [
          { label: "All Teachers", id: "all-teachers", path: "/all-teachers" },
        
         
        ],
      },
  
      {
        icon: FileText,
        label: "Exam",
        id: "exam",
        submenu: [
          { label: "Grades Upload", id: "grades-upload", path: "/grades-upload" },
          { label: "All Exams", id: "all-exams", path: "/all-exams" }
        ],
      },
     
      {
        icon: ShieldAlert,
        label: "Complaints",
        id: "complaints",
        path: "/complaints",
      },
      { icon: Calendar, label: "Events and Announcements", id: "events", path: "/events" },
      // { icon: IndianRupee, label: "Finance", id: "finance", path: "/finance" },
    ],




    teacher: [
      { icon: Home, label: "Dashboard", id: "dashboard", path: "/dashboard" },
      { icon: Users, label: "Student Details", id: "student-details",
        submenu: [
          {
            label: "Student List",
            id: "student-list-teacher",
            path: "/student-list-teacher",
          },
          {
            label: "Student Leaderboard",
            id: "student-leaderboard-teacher",
            path: "/student-leaderboard-teacher",
          },
        ]


      },
      
      {icon: Hand, label: "Attendance",id:"attendance-teacher",

        submenu:[
          {
            label: "Student Attendance",
            id: "student-attendance-teacher",
            path: "/student-attendance-teacher",
          },
          {
            label: "My Attendance",
            id: "my-attendance-teacher",
            path: "/my-attendance-teacher",
          },

          {
            label: "Leave Records",
            id: "teacher-leave-records",
            path: "/teacher-leave-records",
          },
        ]
      },
      { icon: Calendar, label: "Teacher Finance", id: "teacher-finance-data", path: "/teacher-finance-data" },
      
      // { icon: IdCard, label: "Student Marksheet", id: "student-marksheet", path: "/student-marksheet" },
      { icon: Calendar, label: "Events", id: "events", path: "/events" },
      { icon: FileText, label: "Exams", id: "exams", path: "/all-exams",
        submenu:[
          {

            label: "All Exams",
            id: "all-exams",
            path: "/all-exams",
          },
          {

            label: "Grades Upload",
            id: "add-marks-student",
            path: "/add-marks-student",
          }
        ]

       },
  
    ],







    student: [
      { icon: Home, label: "Dashboard", id: "dashboard", path: "/dashboard" },
      {
        icon: BookOpen,
        label: "My Subjects",
        id: "my-subjects",
        path: "/my-subjects",
      },
      {
        icon: Calendar,
        label: "My Attendance",
        id: "my-attendance",
        path: "/my-attendance",
      },
      {
        icon: Clock,
        label: "My Time Table",
        id: "my-time-table",
        path: "/my-time-table",
      },
      // { icon: FileText, label: "My Exams", id: "my-exams", path: "/my-exams" },
      { icon: Award, label: "Exam Results", id: "results", path: "/my-results" },
      { icon: ShieldAlert, label: "My Complaints", id: "complaints", path: "/my-complaints" },
      { icon: IndianRupee, label: "My Dues", id: "my-dues", path: "/my-dues" },
    ],
  };


  const toggleSubmenu = (id) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <aside
      className={`text-black
      fixed left-0 top-0 h-screen w-72 pb-14
      bg-white transform transition-transform duration-300 ease-in-out
      sidebar
      ${isOpen ? "translate-x-0 " : "-translate-x-full"}
      overflow-y-scroll
      z-50
    custom-scrollbar
    `}
    >
      <div className="px-4 mt-4 flex items-center justify-between">
        <Link to="/" className="h4 font-medium text-black gap-2 flex flex-row items-center">
        
        <img src={katlicherra} alt="Katlicherra Central School Logo" className="size-8 rounded-full" />
        
          Katlicherra Central School
        </Link>
        <button onClick={onMenuClick}>
          <span>
            <X size={24} />
          </span>
        </button>
      </div>

      <nav className="sidebar-nav p-4">
        {/* Menu Section */}
        <div className="mb-4">
          <h3 className="text-left text-gray-500 text-sm font-medium tracking-wider px-4 mb-2">Menu</h3>
          <ul className="ml-3 flex flex-1 flex-col gap-2">
            {menuItems[
              role === "principal"
                ? "admin"
                : role === "teacher"
                ? "teacher"
                : "student"
            ].map((item) => (
              <li key={item.id}>
                {item.submenu ? (
                  <button
                    onClick={() => toggleSubmenu(item.id)}
                    className={`
                    w-full flex items-center space-x-3 px-4 py-2 rounded-lg mb-1
                    transition-colors duration-200
                    ${
                      activeItem === item.id
                        ? "bg-purpleColor text-white"
                        : "text-black"
                    }
                    ${themeColors[role]?.hover}
                  `}
                  >
                    <item.icon size={20} />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown
                      size={20}
                      className={`transform transition-transform duration-200 
                      ${expandedMenus[item.id] ? "rotate-180" : ""}`}
                    />
                  </button>
                ) : (
                  <Link to={item.path || "/"}>
                    <button
                      onClick={() => setActiveItem(item.id)}
                      className={`
                      w-full flex items-center space-x-3 px-4 py-2 rounded-lg mb-1
                      transition-colors duration-200
                      ${
                        activeItem === item.id
                          ? "bg-purpleColor text-white"
                          : "text-black"
                      }
                      ${themeColors[role]?.hover}
                    `}
                    >
                      <item.icon size={20} />
                      <span className="flex-1 text-left">{item.label}</span>
                    </button>
                  </Link>
                )}

                {/* Submenu */}
                {item.submenu && (
                  <div
                    className={`
                  pl-12 space-y-1
                  transform transition-all duration-200 ease-in-out
                  ${
                    expandedMenus[item.id]
                      ? "max-h-50 opacity-100 pb-4"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }
                `}
                  >
                    {item.submenu.map((subItem) => (
                      <Link key={subItem.id} to={subItem.path}>
                        <button
                          onClick={() => setActiveItem(subItem.id)}
                          className={`
                          w-full text-left py-2 px-4 rounded-lg
                          transition-colors duration-200
                          ${
                            activeItem === subItem.id
                              ? "bg-purpleColor text-white"
                              : "text-black"
                          }
                          ${themeColors[role]?.hover}
                        `}
                        >
                          {subItem.label}
                        </button>
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

{/* Logout Confirmation Modal */}








        {/* Others Section */}
        <div className="mt-8">
          <h3 className="text-left text-gray-500 text-sm font-medium  tracking-wider px-4 mb-2">Others</h3>
          <ul className="ml-3 flex flex-col gap-2">
            <li>
              <Link to="/profile">
                <button
                  onClick={() => setActiveItem("profile")}
                  className={`
                  w-full flex items-center space-x-3 px-4 py-2 rounded-lg mb-1
                  transition-colors duration-200
                  ${activeItem === "profile" ? "bg-purpleColor text-white" : "text-black"}
                `}
                >
                  <User size={20} />
                  <span className="flex-1 text-left">Profile</span>
                </button>
              </Link>
            </li>
            <li>

              <button
              onClick={() => dispatch(setShowLogoutConfirm(true))}
                className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg mb-1 text-black hover:bg-gray-100"
              >
                <LogOut size={20} />
                <span className="flex-1 text-left text-danger">Logout</span>
              </button>            </li>

          {
            (role==='teacher'|| role === 'student') && (
              <li>
              <Link to="/change-password">
                <button
                  onClick={() => setActiveItem("change-password")}
                  className={`
                  w-full flex items-center space-x-3 px-4 py-2 rounded-lg mb-1
                  transition-colors duration-200
                  ${activeItem === "change-password" ? "bg-purpleColor text-white" : "text-black"}
                `}
                >
                  <User size={20} />
                  <span className="flex-1 text-left">Change password</span>
                </button>
              </Link>
            </li>
            )
          }

                    </ul>
        </div>
      </nav>
    </aside>
  );
};
export default Sidebar