import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import useWebSocket from '../../hooks/useWebSocket';

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const notifications = useWebSocket();

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
    if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
      setNotificationDropdownOpen(false);
    }
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('mousedown', handleClickOutside);
  }

  const handleSignOut = () => {
    setDropdownOpen(false);
    logout(null);
    navigate('/signin');
    document.removeEventListener('mousedown', handleClickOutside);
  };

  const notificationCount = notifications.length;

  return (
    <header className="bg-white border-b border-gray-100 py-4 relative">
      <div className="flex justify-between items-center max-w-6xl mx-auto px-6">
        <Link to="/" className="transition-transform hover:scale-105">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap tracking-tight">
            <span className="text-black font-black">WAC</span>
            <span className="text-gray-500">Rooms</span>
          </h1>
        </Link>

        <nav>
          <ul className="flex gap-8 items-center">
            <Link to="/">
              <li className="hidden sm:inline text-gray-800 hover:text-black font-medium transition-colors text-sm uppercase tracking-wide">
                Home
              </li>
            </Link>
            <Link to="/eventsList">
              <li className="hidden sm:inline text-gray-800 hover:text-black font-medium transition-colors text-sm uppercase tracking-wide">
                Events
              </li>
            </Link>

            {/* Notification Bell */}
            {user && (
              <div className="relative" ref={notificationDropdownRef}>
                <button 
                  onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                  className="p-2 group relative"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800 group-hover:text-black transition-colors" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                      {notificationCount}
                    </span>
                  )}
                </button>

                {notificationDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-md rounded-sm z-20 py-2 px-3 max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className="py-2 border-b border-gray-100 last:border-b-0 text-sm text-gray-900"
                        >
                          <div className="font-medium">
                            {notification.type === "event_start" ? "Event Started" : "Upcoming Event"}
                          </div>
                          <div className="mt-1 text-gray-600">{notification.message}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-600">No notifications</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="text-gray-800 hover:text-black font-medium text-sm tracking-wide border-b border-gray-300 hover:border-black transition-colors pb-1 flex items-center"
                >
                  {user.email}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-sm z-10">
                    <Link to="/profile">
                      <div className="px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 cursor-pointer">
                        User Profile
                      </div>
                    </Link>
                    <div 
                      onClick={handleSignOut}
                      className="px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 border-t border-gray-100 cursor-pointer"
                    >
                      Sign out
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/signin">
                <li className="bg-black text-white px-5 py-2 text-sm font-medium hover:bg-gray-800 transition-colors">
                  Sign in
                </li>
              </Link>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}