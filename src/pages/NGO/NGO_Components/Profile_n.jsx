import React, { useEffect, useState } from 'react';
import { useProfile } from '../../../context/ProfileContext'; // Assuming you have a context for profile state
import { IoCloseSharp } from "react-icons/io5";

const Profile_n = () => {
    const { showProfile, setShowProfile } = useProfile(); // Destructure to get profile state
    const [userData, setUserData] = useState(null); // State to hold user data

    // Close profile function
    const handleClose = () => {
        setShowProfile(false);
    };

    // Load user data from localStorage when component mounts
    useEffect(() => {
        const localUser = localStorage.getItem('userData');
        if (localUser) {
            setUserData(JSON.parse(localUser));
        }
    }, []);

    return (
        // Profile container with fixed positioning
        <div 
            className={`fixed top-20 right-0 h-55 w-80 bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 z-50 border-4 ${showProfile ? 'translate-x-0' : 'translate-x-full'}`}
        >
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-500 to-teal-400 p-6 text-white relative">
                <button onClick={handleClose} className="absolute top-4 right-4">
                    <IoCloseSharp />
                </button>
                
                <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                        <img 
                            src={userData?.OraganizationProfileImage || "https://placehold.co/100x100"} // Use profile picture from user data or default placeholder
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="ml-4">
                        <h1 className="text-xl font-bold">{userData?.NGO_name || "Donor Name"}</h1>
                        <p className="text-sm">{userData?.Email || "Email Address"}</p>
                    </div>
                </div>
            </div>

            {/* Profile Details */}
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center">
                        <i className="fas fa-phone"></i>
                    </div>
                    <div className="ml-4">
                        <p className="text-gray-500 text-sm">Phone Number</p>
                        <p className="text-gray-900 font-medium">{userData?.Phone || "+1-000-000-0000"}</p>
                    </div>
                </div>

                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-100 text-green-500 rounded-full flex items-center justify-center">
                        <i className="fas fa-home"></i>
                    </div>
                    <div className="ml-4">
                        <p className="text-gray-500 text-sm">Address</p>
                        <p className="text-gray-900 font-medium">{userData?.address || "123 Nourish Lane, City"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile_n;
