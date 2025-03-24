import { useEffect, useState } from 'react';
import { FiInfo, FiX, FiCopy, FiCheck } from 'react-icons/fi';

const CredentialsTourPopup = ({ onClose, onUseCredentials }) => {
  const [visible, setVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [copyStatus, setCopyStatus] = useState({
    email: false,
    password: false
  });

  const defaultCredentials = {
    email: "test3@gmail.com",
    password: "yadhu"
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose && onClose();
    }, 300);
  };

  const handleUseCredentials = () => {
    onUseCredentials && onUseCredentials(defaultCredentials);
    handleClose();
  };

  const handleCopyItem = (item, value) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopyStatus(prev => ({ ...prev, [item]: true }));
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [item]: false }));
      }, 2000);
    });
  };

  if (!visible) return null;

  // Mobile version of popup
  if (isMobile) {
    return (
      <div className="fixed bottom-4 left-4 right-4 bg-white border border-gray-200 shadow-lg rounded-md p-4 z-50 animate-slideUp">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <FiInfo className="h-5 w-5 text-black mr-2" />
            <h3 className="text-sm font-medium">Demo Credentials</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-600">
          <p>If you don't want to use Google to sign in, you can use these demo credentials:</p>
          <div className="mt-2 bg-gray-50 p-2 rounded border border-gray-200">
            <div className="flex justify-between items-center mb-1">
              <p><span className="font-medium">Email:</span> {defaultCredentials.email}</p>
              <button 
                className="text-xs text-gray-500 hover:text-black transition-colors p-1"
                onClick={() => handleCopyItem('email', defaultCredentials.email)}
                aria-label="Copy email"
              >
                {copyStatus.email ? <FiCheck className="h-3 w-3 text-green-500" /> : <FiCopy className="h-3 w-3" />}
              </button>
            </div>
            <div className="flex justify-between items-center">
              <p><span className="font-medium">Password:</span> {defaultCredentials.password}</p>
              <button 
                className="text-xs text-gray-500 hover:text-black transition-colors p-1"
                onClick={() => handleCopyItem('password', defaultCredentials.password)}
                aria-label="Copy password"
              >
                {copyStatus.password ? <FiCheck className="h-3 w-3 text-green-500" /> : <FiCopy className="h-3 w-3" />}
              </button>
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <button 
              className="text-xs text-black hover:text-gray-700 font-medium flex items-center border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors"
              onClick={handleUseCredentials}
            >
              Use these credentials
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop version of popup - positioned mid-left
  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 md:w-64 w-60 bg-white border border-gray-200 shadow-lg rounded-md p-4 z-50 animate-fadeInLeft">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <FiInfo className="h-5 w-5 text-black mr-2" />
          <h3 className="text-sm font-medium">Demo Credentials</h3>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <FiX className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-2 text-xs text-gray-600">
        <p>If you don't want to use Google to sign in, you can use these demo credentials:</p>
        <div className="mt-2 bg-gray-50 p-2 rounded border border-gray-200">
          <div className="flex justify-between items-center mb-1.5">
            <p><span className="font-medium">Email:</span> {defaultCredentials.email}</p>
            <button 
              className="text-xs text-gray-500 hover:text-black transition-colors p-1"
              onClick={() => handleCopyItem('email', defaultCredentials.email)}
              aria-label="Copy email"
              title="Copy email"
            >
              {copyStatus.email ? <FiCheck className="h-3 w-3 text-green-500" /> : <FiCopy className="h-3 w-3" />}
            </button>
          </div>
          <div className="flex justify-between items-center">
            <p><span className="font-medium">Password:</span> {defaultCredentials.password}</p>
            <button 
              className="text-xs text-gray-500 hover:text-black transition-colors p-1"
              onClick={() => handleCopyItem('password', defaultCredentials.password)}
              aria-label="Copy password"
              title="Copy password"
            >
              {copyStatus.password ? <FiCheck className="h-3 w-3 text-green-500" /> : <FiCopy className="h-3 w-3" />}
            </button>
          </div>
        </div>
        <div className="flex justify-center mt-3">
          <button 
            className="text-xs text-black hover:text-gray-700 font-medium flex items-center border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors"
            onClick={handleUseCredentials}
          >
            Use these credentials
          </button>
        </div>
      </div>
    </div>
  );
};

export default CredentialsTourPopup;