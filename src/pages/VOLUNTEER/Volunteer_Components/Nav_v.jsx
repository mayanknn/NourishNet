import React, { useState } from 'react';
import logo from '../../../assets/logo.png'; // Assuming the logo is located in the assets folder
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../../context/ProfileContext'; // Import the Profile context

const Nav_v = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { setShowProfile } = useProfile(); // Get the function to update profile visibility
  const navigate = useNavigate();

  // Logout logic
  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/login');
    alert('You have been logged out successfully.');
  };

  return (
    <header className="bg-white shadow-sm relative z-50"> {/* Ensure header has a high z-index */}
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center">
          <img 
            alt="NourishNet Logo" 
            className="h-10 w-10" 
            height="50" 
            src={logo} 
            width="50" 
          />
          <div className="ml-3">
            <h1 className="text-xl font-semibold text-gray-800">NourishNet</h1>
            <p className="text-sm text-gray-500">Nurturing Lives</p>
          </div>
        </div>

        <nav className="flex items-center space-x-6">
          <a 
            className="text-gray-600 hover:text-gray-800 cursor-pointer" 
            onClick={() => navigate('/home_v/homeLink_v')}
          >
            Home
          </a>

          <a 
            className="text-gray-600 hover:text-gray-800 cursor-pointer" 
            onClick={() => navigate('/home_v/aboutLink_v')}
          >
            About
          </a>

          {/* <a 
            className="text-gray-600 hover:text-gray-800 cursor-pointer" 
            onClick={() => navigate('/home_v/assignedTasks_v')}
          >
            Assigned Tasks
          </a> */}

          <a 
            className="text-gray-600 hover:text-gray-800 cursor-pointer" 
            onClick={() => navigate('/home_v/manageTasks_v')}
          >
            Accept & Manage Task
          </a>

          <a 
            className="text-gray-600 hover:text-gray-800 cursor-pointer" 
            onClick={() => navigate('/home_v/history_v')}
          >
            History
          </a>

          {/* Profile link updated to use context */}
          <a 
            className="text-gray-600 hover:text-gray-800 cursor-pointer" 
            onClick={() => setShowProfile(true)} // Set profile visibility to true
          >
            Profile
          </a>

          <a 
            className="text-gray-600 hover:text-gray-800 cursor-pointer" 
            onClick={handleLogout}
          >
            Logout
          </a>

        </nav>
      </div>
    </header>
  );
};

export default Nav_v;
