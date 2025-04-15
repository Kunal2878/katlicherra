import{createBrowserRouter,RouterProvider} from 'react-router-dom'
import './App.css'
import SchoolLandingPage from './Frontend/Pages/LandingPage2'
import UnderMaintenance from './Frontend/Pages/UnderMaintence'
import Nav from './Frontend/Components/Navbar/Navbar'
import ConfirmationLogout from './Frontend/Components/ConfirmationLogout'
import RegisterPrincipal from './Frontend/Pages/Principal/RegisterPrincipal'
import Login from './Frontend/Pages/Login'
import UserOption from './Frontend/Pages/UserOption'
import { Provider } from 'react-redux'
import { store } from './Store/store'
import About from './Frontend/Pages/About'
import Test from './Test'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <UserOption/>
    },
    {
      path: "/user-options",
      element: <UserOption/>
    },
    {
      path: "/admin-signup",
      element: <RegisterPrincipal/>
    },
    {
      path: "/login",
      element: <Login/>
    },
    
    {
      path:'/dashboard',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/dashboard"}/>
    },
    {
      path:'/mark-attendance',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/mark-attendance"}/>
    },
    {
      path:'/profile',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/profile"}/>
    },
    {
      path:'/all-students',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/all-students"}/>
    },
    {
      path:'/student-promotion',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/student-promotion"}/>
    },
    {
      path:'/all-teachers',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/all-teachers"}/>
    },
    {
      path:'/assign-classes-subjects',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/assign-classes-subjects"}/>
    },
    {
      path:'/delete-classes-subjects',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/delete-classes-subjects"}/>
    },
    {
      path:'/register-class',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/register-class"}/>
    },
    {
      path:'/events',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/events"}/>
    },
    {
      path:'/add-students',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/add-students"}/>
    },
    {
      path:'/add-teachers',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/add-teachers"}/>
    },
    {
      path:'/register-subjects',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/register-subjects"}/>
    },
    {
      path:'/time-table',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/time-table"}/>
    },
    {
      path:'/all-exams',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/all-exams"}/>
    },
    {
      path:'/my-attendance',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/my-attendance"}/>
    },
    {
      path:'/my-exams',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/my-exams"}/>
    },
    {
      path:'/my-subjects',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/my-subjects"}/>
    },
    {
      path:'/my-results',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/my-results"}/>
    },
    {
      path:'/my-students',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/my-students"}/>
    },
    {
      path:'/all-classes',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/all-classes"}/>
    },
    {
      path:'/payment-modes',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/payment-modes"}/>
    },
    {
      path:'/all-subjects',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/all-subjects"}/>
    },
    {
      path:'/leaderboard',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/leaderboard"}/>
    },
    {
      path:'/add-marks',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/add-marks"}/>
    },
    {
      path:'/id-card',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/id-card"}/>
    },
    {
      path:'/teacher-id-card',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/teacher-id-card"}/>
    },
    {
      path:'/teacher-attendance',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/teacher-attendance"}/>
    },
    {
      path:'/teacher-leave-records',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/teacher-leave-records"}/>
    },
    {
      path:'/leave-records',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/leave-records"}/>
    },

    {
      path:'/my-time-table',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/my-time-table"}/>
    },
    {
      path:'/my-results',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/my-results"}/>
    },
    {
      path:'/my-subjects',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/my-subjects"}/>
    },
   
    {
      path:'/complaints',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/complaints"}/>
    },
    {
      path:'/my-complaints',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/my-complaints"}/>
    },
    {
      path:'/certificate',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/certificate"}/>
    },
    {
      path:'/id-card',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/id-card"}/>
    },
    
    {
      path:'/under-maintenance',
      element:<UnderMaintenance/>
    },
    {
      path:'/finance',
      element:<UnderMaintenance/>
    },
    {
      path:'/test',
      element:<Test/>
    },
    {
      path:'/know-more',
      element:<About/>
    },
    {
      path:'/teacher-attendance',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/teacher-attendance"}/>
    },
    {
      path:'/class-teacher',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/class-teacher"}/>
    },
    {
      path:'/all-transactions',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/all-transactions"}/>
    },
    {
      path:'/student-finance',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/student-finance"}/>
    },
    {
      path:'/my-dues',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/my-dues"}/>
    },
    {
      path:'/change-password',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/change-password"}/>
    },
    {
      path:'/other-expenses',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/other-expenses"}/>
    },
    {
      path:'/my-attendance-teacher',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/my-attendance-teacher"}/>
    },
    {
      path:'/grades-upload',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/grades-upload"}/>
    },
    {
      path:'/student-list-teacher',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/student-list-teacher"}/>
    },
    {
      path:'/student-leaderboard-teacher',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/student-leaderboard-teacher"}/>
    },   
    
    {
      path:'/add-marks-student',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/add-marks-student"}/>
    },
    {
      path:'/student-attendance-teacher',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/student-attendance-teacher"}/>
    },
    {
      path:'/student-marksheet',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/student-marksheet"}/>
    },
    {
      path:'/confirm-logout',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/confirm-logout"}/>
    }  ,
    {
      path:'/teacher-finance-data',
      element: !Cookies.get("token") || !Cookies.get("user") ? <UserOption/> : <Nav path={"/teacher-finance-data"}/>
    }  
  
  ])

  return (
    <Provider store={store}>
    <div className='w-full flex flex-col bg overflow-x-hidden'>
      <RouterProvider router={routes} />
      <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
    </div>
    </Provider>
  )
}
export default App
