import React from 'react';
import { useProfile } from '../../context/ProfileContext';
import { Outlet } from 'react-router-dom';
import Profile_d from '../DONOUR/Donour_Components/Profile_d';
import Nav_a from './ADMIN_Components/Nav_a';

function Home_a() {
  const { showProfile } = useProfile(); 
  return (
    
    <>
    <Nav_a/>
    <div className="container mx-auto py-6 px-4">
        {showProfile && <Profile_d />} {/* Render Profile_d conditionally */}

      </div>
    </>
  );
}

export default Home_a;