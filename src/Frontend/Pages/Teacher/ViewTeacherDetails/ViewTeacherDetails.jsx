  import React, { useState } from 'react';
  import TeacherProfilePage from './ViewTeacherProfile';
//   import ExamMarkDetails from './ViewExamDetails';
  import TeacherAttendance from './ViewAttendanceHistory';
import UnderMaintenance from '../../UnderMaintence'
import TeacherFee from './ViewTeacherFeeHistory'
  const ViewTeacherDetails = (TeacherData) => {
    const [selectedTab, setSelectedTab] = useState(0);

    const tabs = [
      { label: 'Teacher Profile', component: <TeacherProfilePage TeacherData ={TeacherData} /> },
    //   { label: 'Exam Details', component: <ExamMarkDetails TeacherData ={TeacherData}/> },
      { label: 'Attendance', component: <TeacherAttendance  TeacherData ={TeacherData}/> },
      { label: 'Teacher Fee History', component: <TeacherFee TeacherData ={TeacherData}/> }
    ];

    return (
      <div className="w-full p-4 mt-6">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex space-x-4">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setSelectedTab(index)}
                className={`px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out
                  ${selectedTab === index 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-4">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`transform transition-all duration-300 ease-in-out
                ${selectedTab === index 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-8 hidden'}`}
              role="tabpanel"
            >
              {tab.component}
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default ViewTeacherDetails;
