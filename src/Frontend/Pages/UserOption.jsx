import React from "react";
import { Link } from "react-router-dom";
import { UserCircle2, GraduationCap, Users } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux'
import { setRole } from '../../Store/slice'
import {useEffect} from "react"
const UserOption = () => {;
  const dispatch = useDispatch()
  useEffect(() => {
      document.title = "Choose Your Option";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-purpleColor animate-bounce mb-4">
        Katlicherra Central School
        </h1>
        <p className="text-black-300 max-w-2xl mx-auto animate-fade-in">
          Welcome to Katlicherra Central School - Your comprehensive educational platform. Choose
          your role to get started and explore a world of learning
          possibilities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <Link
          to="/login"
          onClick={() => dispatch(setRole('principal'))}
          className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex flex-col items-center"
        >
          <UserCircle2 className="w-16 h-16 text-purpleColor group-hover:text-purple-500 transition-colors duration-300" />
          <h2 className="text-xl font-semibold mt-4 text-black">Admin</h2>
          <p className="text-black-300 text-sm mt-2 text-center">
            Manage the entire platform and oversee all operations
          </p>
        </Link>

        <Link
          to="/login"
          onClick={() => dispatch(setRole('teacher'))}
          className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex flex-col items-center"
        >
          <Users className="w-16 h-16 text-purpleColor group-hover:text-purple-500 transition-colors duration-300" />
          <h2 className="text-xl font-semibold mt-4 text-black">Teacher</h2>
          <p className="text-black-300 text-sm mt-2 text-center">
            Create courses, manage classes, and track student progress
          </p>
        </Link>

        <Link
          to="/login"
          onClick={() => dispatch(setRole('student'))}
          className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex flex-col items-center"
        >
          <GraduationCap className="w-16 h-16 text-purpleColor group-hover:text-purple-500 transition-colors duration-300" />
          <h2 className="text-xl font-semibold mt-4 text-black">Student</h2>
          <p className="text-black-300 text-sm mt-2 text-center">
            Access courses, submit assignments, and track your learning journey
          </p>
        </Link>
      </div>
    </div>
  );
};

export default UserOption;
