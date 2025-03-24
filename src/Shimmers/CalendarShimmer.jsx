import React from 'react';

const CalendarShimmer = () => {
  // Generate an array of dates for the shimmer effect
  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 35; i++) {
      dates.push(i);
    }
    return dates;
  };

  // Days of the week header
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-[600px] overflow-hidden animate-pulse">
      {/* Toolbar shimmer */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-16 h-8 bg-gray-200 rounded"></div>
            <div className="w-16 h-8 bg-gray-200 rounded"></div>
            <div className="w-16 h-8 bg-gray-200 rounded"></div>
          </div>
          <div className="w-32 h-6 bg-gray-200 rounded"></div>
          <div className="flex items-center gap-2">
            <div className="w-20 h-8 bg-gray-200 rounded"></div>
            <div className="w-20 h-8 bg-gray-200 rounded"></div>
            <div className="w-20 h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {daysOfWeek.map((day, index) => (
          <div 
            key={index} 
            className="h-8 px-2 py-1 text-center border-r border-gray-200 last:border-r-0 flex items-center justify-center"
          >
            <div className="w-12 h-4 bg-gray-200 rounded mx-auto"></div>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 h-[calc(100%-96px)]">
        {generateDates().map((date) => (
          <div 
            key={date} 
            className="min-h-[80px] border-r border-b border-gray-200 last:border-r-0 p-1 relative"
          >
            {/* Date number */}
            <div className="w-6 h-6 bg-gray-200 rounded mb-2"></div>
            
            {/* Random events - show 0-2 events per cell */}
            {Math.random() > 0.6 && (
              <div className="w-full h-5 bg-gray-200 rounded mb-1"></div>
            )}
            {Math.random() > 0.8 && (
              <div className="w-[80%] h-5 bg-gray-200 rounded"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarShimmer;