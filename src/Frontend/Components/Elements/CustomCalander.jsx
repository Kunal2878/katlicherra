
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CustomCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const today = new Date();

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Get days of previous month for padding
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  // Days of week headers
  const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  // Month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Select a date
  const handleDateClick = (day) => {
    setSelectedDate(new Date(currentYear, currentMonth, day));
  };

  // Check if a date is today
  const isToday = (day) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  // Check if a date is selected
  const isSelected = (day) => {
    return (
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear()
    );
  };

  // Generate calendar days
  const renderDays = () => {
    const days = [];
    
    // Adjust for Monday as first day of week
    let startDay = firstDayOfMonth - 1;
    if (startDay === -1) startDay = 6; // If Sunday, move to end of week

    // Add previous month days
    for (let i = startDay; i > 0; i--) {
      const prevDay = prevMonthDays - i + 1;
      days.push(
        <div key={`prev-${prevDay}`} className="text-center py-2">
          <span className="text-gray-400">{prevDay}</span>
        </div>
      );
    }

    // Add current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div key={day} className="text-center py-2">
          <div 
            onClick={() => handleDateClick(day)}
            className={`relative inline-block cursor-pointer ${isSelected(day) ? "font-medium" : ""}`}
          >
           
            <span className={`${isToday(day) ? "bg-blue-100 px-2 py-1 rounded-md text-blue-500 " : isSelected(day) ? "text-blue-500" : "text-black-300"} font-bold`}>
              {day}
            </span>
            {isToday(day) && (
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500"></div>
            )}
          </div>
        </div>
      );
    }
    // Add next month days
    const totalDaysShown = days.length;
    const remainingCells = 42 - totalDaysShown; // 6 rows of 7 days
    
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <div key={`next-${i}`} className="text-center py-2">
          <span className="text-gray-400">{i}</span>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="rounded-lg p-4">
      {/* Header with month/year and navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={prevMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5 text-gray-500" />
        </button>

        <div className="font-medium text-center text-gray-700">
          {months[currentMonth]} {currentYear}
        </div>

        <button
          onClick={nextMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronRight className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {weekdays.map((day) => (
          <div key={day} className="text-center text-xs text-gray-400 font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">{renderDays()}</div>
    </div>
  );
};

export default CustomCalendar;