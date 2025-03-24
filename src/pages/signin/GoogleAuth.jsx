import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { post } from "../../apiServices/apiServices";

const GoogleAuth = ({ onLoginSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        // Keep axios for external Google API call
        const userInfoResponse = await axios.get(
          "https://www.googleapis.com/oauth2/v1/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
              Accept: "application/json",
            },
          }
        );
        
        // Use apiServices for backend call
        const backendRes = await post("/auth/google-login", 
          { googleUser: userInfoResponse.data },
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        if (backendRes.user) {
          onLoginSuccess(backendRes.user);
        } else {
          onError("Google login successful but user data is missing");
        }
      }catch (err) {
        if (err.response) {
          onError(err.response.data.message || "Google login failed");
          console.error('Server error during Google login:', err.response.data);
        } else if (err.request) {
          onError("Network error: Could not reach the server");
          console.error("Request error during Google login:", err.request);
        } else {
          onError("An unexpected error occurred during Google login");
          console.error("Google login error:", err.message);
        }
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google Login Error:", error);
      onError("Failed to authenticate with Google");
      setLoading(false);
    },
  });

  return (
    <button
      type="button"
      onClick={() => !loading && googleLogin()}
      disabled={loading}
      className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-none shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5 mr-2 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <FcGoogle className="h-5 w-5 mr-2" />
      )}
      Sign in with Google
    </button>
  );
};

export default GoogleAuth;