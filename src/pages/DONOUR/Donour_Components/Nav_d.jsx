import React, { useState } from 'react';
import logo from '../../../assets/logo.png'; // Assuming the logo is located in the assets folder
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../../context/ProfileContext'; // Import the Profile context

const Nav_d = () => {
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
    <header className="bg-white shadow-sm relative z-50" style={{position:'fixed',top:'0',left:'0',width:'100vw'}}> {/* Ensure header has a high z-index */}
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
            className="text-gray-600 hover:text-gray-800" 
            onClick={() => navigate('/home_d/homeLink_d')}
            href="#"
          >
            Home
          </a>

          <a 
            className="text-gray-600 hover:text-gray-800" 
            onClick={() => navigate('/home_d/aboutLink_d')}
            href="#"
          >
            About
          </a>

          <a className="text-gray-600 hover:text-gray-800" onClick={()=>navigate('/home_d/claimed_d')}>
            Claimed / Active Donations
          </a>

          <a className="text-gray-600 hover:text-gray-800" onClick={()=>navigate('/home_d/history_d')}>
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

          <div 
            className="relative" 
            onMouseEnter={() => setIsDropdownOpen(true)} 
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <a className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center cursor-pointer">
              <i className="fas fa-heart mr-2"></i>
              Donate
            </a>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-0 w-48 bg-white rounded-md shadow-lg py-2 z-50"> {/* Ensure dropdown has a high z-index */}
                <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={()=>navigate('/home_d/postDonation_d')}>
                  Surplus Food or Raw Material
                </a>
                <a onClick={()=>navigate('/home_d/razorpay_d')} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Money
                </a>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Nav_d;
