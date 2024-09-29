// src/Home_d.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Nav_d from './Donour_Components/Nav_d';
import Profile_d from './Donour_Components/Profile_d'; // Import your Profile component
import { useProfile } from '../../context/ProfileContext'; // Import the Profile context
import HomeLink_d from './Donour_Components/HomeLink_d';

function Home_d() {
  const { showProfile } = useProfile(); // Get the profile visibility state

  return (
    <>
      <Nav_d />
        
      
      <div className="container mx-auto py-6 px-4">
        {showProfile && <Profile_d />} {/* Render Profile_d conditionally */}
        <Outlet />
      </div>
    </>
  );
}

export default Home_d;
