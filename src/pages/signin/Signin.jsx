import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import EmailAuth from "./EmailAuth";
import GoogleAuth from "./GoogleAuth";

const Signin = () => {
  const { user, login } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/"); 
  }, [user, navigate]);

  const handleLoginSuccess = (userData) => {
    login(userData);
    navigate("/");
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  const clearError = () => {
    if (error) setError("");
  };

  if (user) return null; 

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Header */}
        <div className="text-center">
          <h1 className="font-bold text-2xl flex flex-wrap justify-center tracking-tight">
            <span className="text-black font-black">WAC</span>
            <span className="text-gray-600">Rooms</span>
          </h1>
          <h2 className="mt-6 text-xl font-medium text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-500">Use webandcrafts account</p>
        </div>
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-2">
            <div className="flex items-center">
              <FiAlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Email Authentication */}
        <div onClick={clearError}>
          <EmailAuth
            onLoginSuccess={handleLoginSuccess}
            onError={handleError}
          />
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Authentication */}
        <div onClick={clearError}>
          <GoogleAuth
            onLoginSuccess={handleLoginSuccess}
            onError={handleError}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
