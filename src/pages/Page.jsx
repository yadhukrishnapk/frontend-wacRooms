import React, { useState, useEffect } from 'react';
import Office from '../../bits/Office';
import { get } from '../apiServices/apiServices';
import OngoingMeetingsSidebar from '../componets/OnGoingMeetSidebar/OngoingMeetingSidebar';

const MainPage = () => {
  const [activeEvents, setActiveEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const rooms = [
    {
      label: "Abin's Room",
      path: "/room/room1",
    },
    {
      label: "Jilu's Room",
      path: "/room/room2",
    },
    {
      label: "TV Room", 
      path: "/room/room3",
    }
  ];

  const toggleSidebarVisibility = () => {
    if (!isSidebarVisible && activeEvents.length === 0) {
      fetchActiveEvents();
    }
    setIsSidebarVisible(!isSidebarVisible);
  };

  const fetchActiveEvents = async () => {
    setIsLoading(true);
    try {
      const response = await get('/event/check-active');
      if (response.activeEvents) {
        setActiveEvents(response.activeEvents);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch active events:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-white flex items-center justify-center p-6">
      <OngoingMeetingsSidebar
        activeEvents={activeEvents} 
        isVisible={isSidebarVisible}
        toggleVisibility={toggleSidebarVisibility}
        isLoading={isLoading}
      />

      <div className="w-full max-w-2xl relative z-10">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Office Space
          </h1>
          <div className="mt-2 text-sm text-gray-600 flex items-center justify-center">
            <span className="inline-block w-6 h-px bg-gray-300 mr-2"></span>
            Explore your workspace
            <span className="inline-block w-6 h-px bg-gray-300 ml-2"></span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-12 
            hover:shadow-xl transition-all duration-300 ease-in-out 
            transform hover:-translate-y-1">
            <Office 
              size={1.5} 
              rooms={rooms}
              className="transition-all duration-200" 
            />
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-xs text-gray-400 flex items-center justify-center">
            <span className="inline-block w-4 h-px bg-gray-300 mr-2"></span>
            Click on the office to navigate
            <span className="inline-block w-4 h-px bg-gray-300 ml-2"></span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainPage;