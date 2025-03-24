import React from "react";
import moment from "moment";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
} from "lucide-react";

const CustomToolbar = ({ 
  date, 
  view, 
  goToPrevious, 
  goToNext, 
  goToToday, 
  handleViewChange, 
  openModal 
}) => {
  const handleScheduleClick = () => {
    const now = new Date();
    const oneHourLater = moment(now).add(1, 'hour').toDate();
    openModal({
      start: now,
      end: oneHourLater
    });
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center p-6 bg-white border-b border-black">
      <div className="flex items-center mb-4 sm:mb-0">
        <CalendarIcon className="w-6 h-6 mr-2 text-black" />
        <h2 className="text-2xl font-normal text-black tracking-tight">
          {moment(date).format(view === "day" ? "MMMM D, YYYY" : "MMMM YYYY").toUpperCase()}
        </h2>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex border border-black">
          <button
            onClick={goToPrevious}
            className="p-2 hover:bg-black hover:text-white transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="p-2 border-l border-black hover:bg-black hover:text-white transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={goToToday}
          className="px-4 py-2 text-xs uppercase tracking-wider border border-black hover:bg-black hover:text-white transition-colors"
        >
          Today
        </button>

        <div className="flex border border-black">
          {["day", "week", "month"].map((viewOption, index) => (
            <button
              key={viewOption}
              onClick={() => handleViewChange(viewOption)}
              className={`px-3 py-2 text-xs uppercase tracking-wider transition-colors ${
                view === viewOption
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              } ${index > 0 ? "border-l border-black" : ""}`}
            >
              {viewOption}
            </button>
          ))}
        </div>

        <button 
          onClick={handleScheduleClick}
          className="flex items-center px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" />
          <span className="text-xs uppercase tracking-wider">Schedule</span>
        </button>
      </div>
    </div>
  );
};

export default CustomToolbar;