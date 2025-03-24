import React from "react";

const ShimmerEffect = () => {
  return (
    <div className="animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] h-full w-full rounded-md"></div>
  );
};

const LoadingCalendar = () => {
  return (
    <div className="bg-white border border-black">
      {/* Shimmer toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-6 bg-white border-b border-black">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="w-6 h-6 mr-2"><ShimmerEffect /></div>
          <div className="h-8 w-48"><ShimmerEffect /></div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="h-10 w-20 border border-gray-200"><ShimmerEffect /></div>
          <div className="h-10 w-20"><ShimmerEffect /></div>
          <div className="h-10 w-40"><ShimmerEffect /></div>
          <div className="h-10 w-28"><ShimmerEffect /></div>
        </div>
      </div>

      {/* Shimmer calendar grid */}
      <div className="min-h-screen">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 p-4">
          {Array(7).fill(0).map((_, i) => (
            <div key={`header-${i}`} className="h-8"><ShimmerEffect /></div>
          ))}
        </div>
        
        {/* Calendar cells */}
        <div className="grid grid-cols-7 gap-1 p-4">
          {Array(35).fill(0).map((_, i) => (
            <div key={`cell-${i}`} className="h-24 border border-gray-100 p-2">
              <div className="h-6 w-6 mb-2 rounded-full"><ShimmerEffect /></div>
              {/* Random event placeholders */}
              {Math.random() > 0.7 && (
                <div className="h-5 w-4/5 mt-2"><ShimmerEffect /></div>
              )}
              {Math.random() > 0.8 && (
                <div className="h-5 w-3/5 mt-2"><ShimmerEffect /></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingCalendar;