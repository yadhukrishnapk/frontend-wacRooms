import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { get } from "../../apiServices/apiServices";
import SplitText from "../../../bits/SplitText";
import LoadingSpinner from "../../Shimmers/LoadingSpinner";
import useSWR from "swr";

const fetcher = (url) => get(url);

const Profile = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const {
    data: userDetails,
    error,
    isLoading,
  } = useSWR(userId ? `/user/${userId}` : null, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 10000,
  });

  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  console.log("User from useAuth:", user);
  console.log("Fetched user details:", userDetails);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600 text-xl border border-red-300 px-6 py-4 rounded">
          Failed to fetch user details
        </div>
      </div>
    );
  }

  const username = userDetails?.name || user?.name || "User";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-16">
      <div className="w-full max-w-md mb-8">
        <SplitText
          text={`Hello, ${username}!`}
          className="text-3xl  text-center text-gray-800 tracking-wide"
          delay={150}
          animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
          animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
          easing="easeOutCubic"
          threshold={0.5}
          rootMargin="-50px"
          onLetterAnimationComplete={handleAnimationComplete}
        />
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-md">
        <h1 className="text-2xl font-light mb-6 pb-4 border-b border-gray-100 tracking-wide">
          Profile
        </h1>
        {userDetails ? (
          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="text-sm uppercase tracking-wider text-gray-500 mb-1">
                Name
              </span>
              <span className="text-lg text-gray-800">
                {userDetails.name || "Not provided"}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm uppercase tracking-wider text-gray-500 mb-1">
                Email
              </span>
              <span className="text-lg text-gray-800">
                {userDetails.email || "Not provided"}
              </span>
            </div>

            {userDetails.avatar ? (
              <div className="flex flex-col items-center pt-4">
                <span className="text-sm uppercase tracking-wider text-gray-500 mb-3">
                  Avatar
                </span>
                <div className="p-1 border border-gray-200 rounded-full">
                  <img
                    src={userDetails.avatar}
                    alt="Profile Photo"
                    className="w-28 h-28 rounded-full object-cover"
                    onError={(e) => (e.target.src = "/default-avatar.png")}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center pt-4">
                <span className="text-sm uppercase tracking-wider text-gray-500 mb-3">
                  Avatar
                </span>
                <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                  <span className="text-gray-400 text-5xl font-light">
                    {username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-2 italic">
                  No avatar available
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">No user details available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
