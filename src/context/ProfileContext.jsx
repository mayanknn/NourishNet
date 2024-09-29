// src/context/ProfileContext.js
import React, { createContext, useContext, useState } from 'react';

// Create Context
const ProfileContext = createContext();

// Create Provider Component
export const ProfileProvider = ({ children }) => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <ProfileContext.Provider value={{ showProfile, setShowProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook to use the Profile Context
export const useProfile = () => {
  return useContext(ProfileContext);
};
