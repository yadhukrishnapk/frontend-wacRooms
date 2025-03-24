import { useState } from "react";
import { useNavigate } from "react-router-dom";

const darkenColor = (hex, percent) => {
  let color = hex.startsWith("#") ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
};

const Office = ({
  size = 1,
  rooms = [],
  className = "",
}) => {
  const navigate = useNavigate();
  const [showRooms, setShowRooms] = useState(false);
  const [hoveredRoom, setHoveredRoom] = useState(null);

  // B&W Theme Colors
  const buildingColor = "#1F2937"; // Dark gray
  const buildingDarkColor = "#111827"; // Even darker gray
  const roofColor = "#111827"; // Same as building dark
  const windowColor = "#E5E7EB"; // Light gray for windows
  const doorknobColor = "#D1D5DB"; // Gray for doorknob

  const handleOfficeClick = () => {
    setShowRooms((prev) => !prev);
  };

  const handleRoomClick = (room, index) => {
    if (room && room.path) {
      navigate(room.path);
    }
  };

  const getRoomPosition = (index) => {
    if (index === 0) return "translate(-190%, -190%)";
    if (index === 1) return "translate(50%, -290%)";
    if (index === 2) return "translate(290%, -190%)";
    return "";
  };

  // Scale style
  const scaleStyle = { transform: `scale(${size})` };

  return (
    <div style={scaleStyle} className={className}>
      <div
        className={`group relative transition-all duration-300 ease-in-out cursor-pointer ${
          !showRooms ? "hover:-translate-y-2" : ""
        }`}
        onClick={handleOfficeClick}
      >
        {/* Office Building */}
        <div className="relative w-[160px] h-[130px]">
          {/* Building Shadow */}
          <div
            className="absolute w-[180px] h-[10px] -bottom-6 left-1/2 -translate-x-1/2 rounded-full opacity-20 blur-sm z-10"
            style={{ backgroundColor: "#000000" }}
          ></div>

          {/* Roof */}
          <div
            className="absolute w-[180px] h-[45px] -top-10 -left-[10px] z-30"
            style={{
              backgroundColor: roofColor,
              clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
            }}
          ></div>

          {/* Building Main Body */}
          <div
            className="absolute w-full h-full rounded-md z-20"
            style={{ backgroundColor: buildingColor }}
          >
            {/* Door */}
            <div
              className="absolute bottom-0 left-1/2 w-[30px] h-[50px] -translate-x-1/2 rounded-t-md z-30"
              style={{ backgroundColor: buildingDarkColor }}
            >
              <div
                className="absolute top-1/2 right-2 w-[5px] h-[5px] rounded-full"
                style={{ backgroundColor: doorknobColor }}
              ></div>
            </div>

            {/* Windows Row 1 */}
            <div className="absolute top-[15px] left-0 w-full flex justify-around px-6">
              <div className="w-[25px] h-[25px] rounded-sm bg-gray-200 border border-gray-300"></div>
              <div className="w-[25px] h-[25px] rounded-sm bg-gray-200 border border-gray-300"></div>
              <div className="w-[25px] h-[25px] rounded-sm bg-gray-200 border border-gray-300"></div>
            </div>

            {/* Windows Row 2 */}
            <div className="absolute top-[55px] left-0 w-full flex justify-around px-6">
              <div className="w-[25px] h-[25px] rounded-sm bg-gray-200 border border-gray-300"></div>
              <div className="w-[25px] h-[25px] rounded-sm bg-gray-200 border border-gray-300"></div>
              <div className="w-[25px] h-[25px] rounded-sm bg-gray-200 border border-gray-300"></div>
            </div>
          </div>

          {/* Rooms */}
          {rooms.map((room, i) => {
            const isHovered = hoveredRoom === i;
            
            return (
              <div
                key={i}
                className={`absolute z-40 w-[80px] h-[60px] transition-all duration-300 ease-in-out ${
                  showRooms ? "opacity-100" : "opacity-0 pointer-events-none"
                } ${isHovered ? "scale-110" : ""}`}
                style={{
                  transform: showRooms ? getRoomPosition(i) : "translate(0, 0)",
                  backgroundColor: "#1F2937", // Dark gray for all rooms (B&W theme)
                  borderRadius: "6px",
                  boxShadow: isHovered 
                    ? "0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)" 
                    : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoomClick(room, i);
                }}
                onMouseEnter={() => setHoveredRoom(i)}
                onMouseLeave={() => setHoveredRoom(null)}
              >
                {/* Room door */}
                <div
                  className="absolute bottom-0 left-1/2 w-[20px] h-[30px] -translate-x-1/2 rounded-t-sm"
                  style={{ backgroundColor: "#111827" }}
                ></div>
                
                {/* Room window */}
                <div
                  className="absolute top-[10px] left-1/2 w-[30px] h-[15px] -translate-x-1/2 rounded-sm bg-gray-200 border border-gray-300"
                ></div>
                
                {/* Room label */}
                <div className="absolute -bottom-7 left-0 w-full text-center text-xs font-medium text-gray-200 bg-gray-800 py-1 rounded-sm">
                  {room?.label || `Room ${i+1}`}
                </div>
              </div>
            );
          })}
        </div>

        {/* Indicator for clickable state */}
        <div 
          className={`absolute -bottom-12 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full transition-opacity duration-300 ${
            showRooms ? "opacity-0" : "opacity-100"
          }`}
        >
          Click to explore
        </div>
      </div>
    </div>
  );
};

export default Office;