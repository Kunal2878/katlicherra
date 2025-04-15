import React, { useState } from 'react';
import AddStudentAdvanceFees from './AddStudentAdvanceFee'
import AddStudentFees from './AddStudentFee'
const ViewStudentFeeTabs = (StudentData) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    { label: 'Add Student Fee', component: <AddStudentFees/> },
    { label: 'Advance Pay Options', component: <AddStudentAdvanceFees/> },
      ];

  return (
    <div className="w-full p-4 mt-6">
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex space-x-4">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setSelectedTab(index)}
              className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-300 ease-in-out whitespace-nowrap
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

export default ViewStudentFeeTabs;