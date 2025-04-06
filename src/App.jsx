import{createBrowserRouter,RouterProvider} from 'react-router-dom'
import './App.css'
import SchoolLandingPage from './Frontend/Pages/LandingPage2'
import UnderMaintenance from './Frontend/Pages/UnderMaintence'
import Nav from './Frontend/Components/Navbar/Navbar'
import RegisterPrincipal from './Frontend/Pages/Principal/RegisterPrincipal'
import Login from './Frontend/Pages/Login'
import UserOption from './Frontend/Pages/UserOption'
import { Provider } from 'react-redux'
import { store } from './Store/store'
import About from './Frontend/Pages/About'
import Test from './Test'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
      path: "/user-options",
      element: < UserOption/> 

    },
    {
      path:'/dashboard',
      element:<Nav path={"/dashboard"}/>
    },
    {
      path:'/mark-attendance',
      element:<Nav path={"/mark-attendance"}/>
    },
    {
      path:'/profile',
      element:<Nav path={"/profile"}/>
    },
    {
      path:'/all-students',
      element:<Nav path={"/all-students"}/>
    },
    {
      path:'/student-promotion',
      element:<Nav path={"/student-promotion"}/>
    },
    {
      path:'/all-teachers',
      element:<Nav path={"/all-teachers"}/>
    },
    {
      path:'/assign-classes-subjects',
      element:<Nav path={"/assign-classes-subjects"}/>
    },
    {
      path:'/register-class',
      element:<Nav path={"/register-class"}/>
    },
    {
      path:'/events',
      element:<Nav path={"/events"}/>
    },
    {
      path:'/add-students',
      element:<Nav path={"/add-students"}/>
    },
    {
      path:'/add-teachers',
      element:<Nav path={"/add-teachers"}/>
    },
    {
      path:'/register-subjects',
      element:<Nav path={"/register-subjects"}/>
    },
    {
      path:'/time-table',
      element:<Nav path={"/time-table"}/>
    },
    {
      path:'/all-exams',
      element:<Nav path={"/all-exams"}/>
    },
    {
      path:'/my-attendance',
      element:<Nav path={"/my-attendance"}/>
    },
    {
      path:'/my-exams',
      element:<Nav path={"/my-exams"}/>
    },
    {
      path:'/my-subjects',
      element:<Nav path={"/my-subjects"}/>
    },
    {
      path:'/my-results',
      element:<Nav path={"/my-results"}/>
    },
    {
      path:'/my-students',
      element:<Nav path={"/my-students"}/>
    },
    {
      path:'/all-classes',
      element:<Nav path={"/all-classes"}/>
    },
    {
      path:'/payment-modes',
      element:<Nav path={"/payment-modes"}/>
    },
    {
      path:'/all-subjects',
      element:<Nav path={"/all-subjects"}/>
    },
    {
      path:'/leaderboard',
      element:<Nav path={"/leaderboard"}/>
    },
    {
      path:'/add-marks',
      element:<Nav path={"/add-marks"}/>
    },
    {
      path:'/id-card',
      element:<Nav path={"/id-card"}/>
    },
    {
      path:'/teacher-id-card',
      element:<Nav path={"/teacher-id-card"}/>
    },
    {
      path:'/teacher-attendance',
      element:<Nav path={"/teacher-attendance"}/>
    },
    {
      path:'/my-time-table',
      element:<Nav path={"/my-time-table"}/>
    },
    {
      path:'/my-results',
      element:<Nav path={"/my-results"}/>
    },
    {
      path:'/my-subjects',
      element:<Nav path={"/my-subjects"}/>
    },
   
    {
      path:'/complaints',
      element:<Nav path={"/complaints"}/>
    },
    {
      path:'/my-complaints',
      element:<Nav path={"/my-complaints"}/>
    },
    {
      path:'/certificate',
      element:<Nav path={"/certificate"}/>
    },
    {
      path:'/id-card',
      element:<Nav path={"/id-card"}/>
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
      element:<Nav path={"/teacher-attendance"}/>

    },
    {
      path:'/class-teacher',
      element:<Nav path={"/class-teacher"}/>

    },
    {
      path:'/all-transactions',
      element:<Nav path={"/all-transactions"}/>

    },
    {
      path:'/student-finance',
      element:<Nav path={"/student-finance"}/>

    },
    {
      path:'/my-dues',
      element:<Nav path={"/my-dues"}/>

    },
    {
      path:'/change-password',
      element:<Nav path={"/change-password"}/>

    },
    {
      path:'/other-expenses',
      element:<Nav path={"/other-expenses"}/>

    },
    {
      path:'/my-attendance-teacher',
      element:<Nav path={"/my-attendance-teacher"}/>

    },
    {
      path:'/grades-upload',
      element:<Nav path={"/grades-upload"}/>

    },
    {
      path:'/student-list-teacher',
      element:<Nav path={"/student-list-teacher"}/>

    },
    {
      path:'/student-leaderboard-teacher',
      element:<Nav path={"/student-leaderboard-teacher"}/>

    },
    {
      path:'/add-marks-student',
      element:<Nav path={"/add-marks-student"}/>

    },
    {
      path:'/student-attendance-teacher',
      element:<Nav path={"/student-attendance-teacher"}/>

    },
    {
      path:'/student-marksheet',
      element:<Nav path={"/student-marksheet"}/>

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
