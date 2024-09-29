import React, { useEffect } from 'react';
import Nav_v from './Volunteer_Components/Nav_v';
import { useProfile } from '../../context/ProfileContext';
import { Outlet } from 'react-router-dom';
import Profile_d from '../DONOUR/Donour_Components/Profile_d';
import { doc, updateDoc, getDoc } from 'firebase/firestore'; // Import Firestore
import { db } from '../../firebase'; // Your Firebase config
import Profile_v from './Volunteer_Components/Profile_v';

function Home_v() {
  const { showProfile } = useProfile();

  // Get volunteer data from localStorage
  const userData = JSON.parse(localStorage.getItem('userData'));
  const volunteerId = userData?.uid;

  // Function to get the volunteer's current location
  const fetchCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          // Update the Firestore database with current latitude and longitude
          await updateVolunteerLocation(volunteerId, latitude, longitude);
        },
        (error) => {
          console.error('Error fetching location:', error);
        }
      );
    } else {
      console.log('Geolocation is not available in this browser.');
    }
  };

  // Function to update the volunteer's location in Firestore
  const updateVolunteerLocation = async (volunteerId, latitude, longitude) => {
    try {
      const volunteerRef = doc(db, 'users', volunteerId);
      await updateDoc(volunteerRef, {
        Latitude: latitude,
        Longitude: longitude,
      });
      console.log('Volunteer location updated successfully!');
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  // Check if donation exists and volunteer is online
  const checkDonationAndStatus = async () => {
    try {
      // const donationRef = doc(db, 'donations', volunteerId); // Assuming you store donations under 'donations' collection
      // const donationSnapshot = await getDoc(donationRef);

      const volunteerRef = doc(db, 'users', volunteerId); // Reference to volunteer in 'users' collection
      const volunteerSnapshot = await getDoc(volunteerRef);

      if ( volunteerSnapshot.exists()) {
        const volunteerData = volunteerSnapshot.data();
        const status = volunteerData?.status; // Assuming volunteer status is stored in 'status'

        if (status === "online") {
          fetchCurrentLocation(); // Fetch and update location only if volunteer is online
        } else {
          console.log('Volunteer is offline.');
        }
      } else {
        console.log('No donation found or volunteer does not exist.');
      }
    } catch (error) {
      console.error('Error checking donation or volunteer status:', error);
    }
  };

  // Fetch the location when the component mounts, only if conditions are met

useEffect(() => {
  // Check if volunteerId exists before starting the interval
  if (volunteerId) {
    // Create an interval that calls checkDonationAndStatus every 10 seconds
    const intervalId = setInterval(() => {
      checkDonationAndStatus();
    }, 10000); // 10000 milliseconds = 10 seconds

    // Clean up the interval when the component unmounts or volunteerId changes
    return () => clearInterval(intervalId);
  }
}, [volunteerId]); // Dependencies array


  return (
    <>
      <Nav_v />

      <div className="container mx-auto py-6 px-4">
        {showProfile && <Profile_v />} {/* Render Profile_d conditionally */}
        <Outlet />
      </div>
    </>
  );
}

export default Home_v;
