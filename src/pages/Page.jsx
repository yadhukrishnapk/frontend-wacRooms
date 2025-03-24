// src/pages/MainPage.jsx
import React from 'react';
import Office from '../../bits/Office';

const MainPage = () => {
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

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Office Space
          </h1>
          <div className="mt-2 text-sm text-gray-500 flex items-center justify-center">
            <span className="inline-block w-6 h-px bg-gray-400 mr-2"></span>
            Explore your workspace
            <span className="inline-block w-6 h-px bg-gray-400 ml-2"></span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 hover:shadow-lg transition-shadow duration-300">
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