import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import MainPage from '../pages/Page';
import Signin from '../pages/signin/Signin';
import Register from '../pages/register/Register';
import ScheduleTime from '../pages/ScheduleTime/ScheduleTime';
import RoomPage from '../pages/rooms/RoomPage/RoomPage';
import EventListHome from '../pages/EventsList/EventListHome';
import Profile from '../pages/profile/Profile';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Private Routes */}
      <Route path="/" element={<PrivateRoute><MainPage /></PrivateRoute>} />
      <Route path="/room/:roomId" element={<PrivateRoute><RoomPage /></PrivateRoute>} />
      <Route path="/:room/createSchedule" element={<PrivateRoute><ScheduleTime /></PrivateRoute>} />
      <Route path='/eventsList' element={<PrivateRoute><EventListHome /></PrivateRoute>} />
      <Route path="*" element={<PrivateRoute><Profile /></PrivateRoute>} />
      
      {/* Public Routes */}
      <Route path="/signin" element={<Signin />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AppRoutes;
