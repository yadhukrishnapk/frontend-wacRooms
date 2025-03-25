import React from 'react';
import { Clock, MapPin, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const OngoingMeetingsSidebar = ({ 
    activeEvents, 
    isVisible, 
    toggleVisibility, 
    isLoading 
  }) => {
    const formatTime = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false // 24-hour format
      });
    };
  
    const getRoomDisplayName = (room) => {
      const roomMap = {
        'room1': "Abin's Room",
        'room2': "Jilu's Room",
        'room3': "TV Room"
      };
      return roomMap[room.toLowerCase()] || room;
    };

  return (
    <div className={`fixed top-1/2 right-0 transform -translate-y-1/2 z-20 
      w-72 bg-black text-white rounded-l-2xl shadow-2xl 
      transition-all duration-300 ease-in-out 
      ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>
      {/* Pull Tab */}
      <button 
        onClick={toggleVisibility}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full 
        bg-black text-white p-2 rounded-l-lg focus:outline-none"
      >
        {isVisible ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>

      {isLoading ? (
        <div className="p-6 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      ) : activeEvents.length > 0 ? (
        <div className="p-6">
          <div className="flex items-center mb-4 border-b border-gray-700 pb-2">
            <Clock className="mr-2 w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold">Ongoing Meetings</h2>
          </div>
          
          {activeEvents.map((event) => (
            <div 
              key={event._id} 
              className="mb-4 pb-4 border-b border-gray-800 last:border-b-0 last:pb-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium mb-1">{event.title}</h3>
                  <div className="flex items-center text-xs text-gray-400">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{getRoomDisplayName(event.room)}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {formatTime(event.start)} - {formatTime(event.end)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-gray-400">
          No ongoing meetings
        </div>
      )}
    </div>
  );
};

export default OngoingMeetingsSidebar;