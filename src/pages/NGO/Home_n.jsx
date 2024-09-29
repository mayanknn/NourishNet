import React from 'react';
import Nav_n from './NGO_Components/Nav_n';
import { useProfile } from '../../context/ProfileContext';
import { Outlet } from 'react-router-dom';
import Profile_d from '../DONOUR/Donour_Components/Profile_d';
import Profile_n from './NGO_Components/Profile_n';

function Home_n() {
  const { showProfile } = useProfile(); 
  return (
    
    <>
    <Nav_n/>
    <div className="container mx-auto py-6 px-4">
        {showProfile && <Profile_n />} {/* Render Profile_d conditionally */}
      </div>
    </>
  );
}

export default Home_n;
