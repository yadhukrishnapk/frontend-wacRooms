import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import useWebSocket from '../../hooks/useWebSocket';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
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

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    setDropdownOpen(false);
    logout(null);
    navigate('/signin');
  };

  const notificationCount = notifications.length;
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white border-b border-gray-200 py-5 sticky top-0 z-50 shadow-sm">
      <div className="flex justify-between items-center max-w-6xl mx-auto px-6">
        <Link to="/" className="transition-transform hover:scale-105 duration-300">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap tracking-tight">
            <span className="text-black font-black">WAC</span>
            <span className="text-gray-500">Rooms</span>
          </h1>
        </Link>

        <nav className="flex items-center">
          <ul className="flex gap-8 items-center">
            <Link to="/">
              <li className={`hidden sm:inline text-sm uppercase tracking-wide font-medium transition-all px-2 py-1 ${
                isActive('/') 
                  ? 'text-black border-b-2 border-black' 
                  : 'text-gray-600 hover:text-black hover:border-b-2 hover:border-gray-300'
              }`}>
                Home
              </li>
            </Link>
            <Link to="/eventsList">
              <li className={`hidden sm:inline text-sm uppercase tracking-wide font-medium transition-all px-2 py-1 ${
                isActive('/eventsList') 
                  ? 'text-black border-b-2 border-black' 
                  : 'text-gray-600 hover:text-black hover:border-b-2 hover:border-gray-300'
              }`}>
                Events
              </li>
            </Link>

            {user && (
              <div className="relative" ref={notificationDropdownRef}>
                <button 
                  onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                  className="p-2 group relative transition-transform hover:scale-110 focus:outline-none"
                  aria-label="Notifications"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 group-hover:text-black transition-colors" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium animate-pulse">
                      {notificationCount}
                    </span>
                  )}
                </button>

                {notificationDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 shadow-lg rounded-md z-20 py-2 px-3 max-h-96 overflow-y-auto transform transition-all duration-200 ease-out">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-2">
                      <h3 className="font-semibold text-sm">Notifications</h3>

                    </div>
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className="py-3 border-b border-gray-100 last:border-b-0 text-sm text-gray-900 hover:bg-gray-50 px-2 rounded transition-colors"
                        >
                          <div className="font-medium flex items-center gap-2">
                            {notification.type === "event_start" ? (
                              <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                            ) : (
                              <span className="w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                            )}
                            {notification.type === "event_start" ? "Event Started" : "Upcoming Event"}
                          </div>
                          <div className="mt-1 text-gray-600 pl-4">{notification.message}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-600 py-4 text-center">No notifications</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="text-gray-800 hover:text-black font-medium text-sm tracking-wide group flex items-center gap-2 focus:outline-none"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold uppercase">
                    {user.email.charAt(0)}
                  </div>
                  <span className="hidden sm:inline border-b border-transparent group-hover:border-black transition-colors pb-1">
                    {user.email.split('@')[0]}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 shadow-lg rounded-md z-10 transform transition-all duration-200 ease-out">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="font-medium text-sm">{user.email.split('@')[0]}</div>
                      <div className="text-xs text-gray-500 truncate">{user.email}</div>
                    </div>
                    <Link to="/profile">
                      <div className="px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 cursor-pointer flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        User Profile
                      </div>
                    </Link>
                    <div 
                      onClick={handleSignOut}
                      className="px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 border-t border-gray-100 cursor-pointer flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/signin">
                <li className="bg-black text-white px-5 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors rounded-sm hover:shadow-md">
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