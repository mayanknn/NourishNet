import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import { doc, updateDoc } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../firebase';
import logo from '../assets/logo.png';
import RoutingMap from './DONOUR/Donour_Components/RoutingMap';

const Home = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.Role === 'Donor') {
          navigate('/Home_d');
        } else if (user.Role === 'NGO') {
          navigate('/Home_n');
        }
        else if (user.Role === 'Volunteer') {
          const volunteerId = user.uid; // Get the volunteer ID from userData

          // Reference to the volunteer's document in Firestore
          const volunteerRef = doc(db, 'users', volunteerId);

          // Update the status to 'online'
          updateDoc(volunteerRef, {
            status: 'online', // Set status to "online"
          })
            .then(() => {
              console.log('Volunteer status updated to online');
              navigate('/Home_v'); // Navigate to the volunteer home page
            })
            .catch((error) => {
              console.error('Error updating volunteer status:', error);
            });
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, [navigate]);

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to the login page
  };

  return (
    <div className="bg-gray-100">
      <header className="flex justify-between items-center p-4 bg-white shadow-md" style={{ position: 'fixed', top: '0', zIndex: '1', width: '100vw' }}>
        <div className="flex items-center">
          <img
            alt="NourishNet Logo"
            className="h-20"
            src={logo}

          />
          <span className="ml-2 text-xl font-semibold text-green-800">NourishNet</span>
        </div>
        <button
          className="bg-green-700 px-6 py-3 rounded-full text-white"
          onClick={handleLoginClick} // Attach the click handler here
        >
          Login
        </button>
      </header>
      <main className="relative" style={{position:'relative',top:'10vh'}}>
        <video autoPlay className="w-full h-screen object-cover" loop muted>
          <source src="https://firebasestorage.googleapis.com/v0/b/ngos-ef983.appspot.com/o/meals-mission-desktop.mp4?alt=media&token=54fc7d9c-b558-4665-84a7-4733ceac7cc0" type="video/mp4" />
        </video>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-4xl font-bold">NourishNet: Reducing Waste, Nourishing Lives</h1>
          <p className="mt-4 text-lg">
            Join us in redistributing surplus food to those who need it most.
            <br />
            Be part of the solution today!
          </p>
          <div className="mt-8 flex space-x-4">
            <button className="bg-green-700 px-6 py-3 rounded-full" onClick={() => navigate('/register_d')}>Join As Donor</button>
            <button className="bg-orange-600 px-6 py-3 rounded-full" onClick={() => navigate('/register_n')}>Join As NGO</button>
            <button className="bg-orange-600 px-6 py-3 rounded-full" onClick={() => navigate('/register_v')}>Join As Volunteer</button>
          </div>
        </div>
      </main>
      <h1 style={{
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    padding: '20px',
    background: 'linear-gradient(to right, #2980B9, #6DD5ED)',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    margin: '10rem auto'
}}>
    Explore our curated list of NGOs making a positive impact, where your contributions can uplift communities and drive meaningful change.
</h1>
      <div style={{width:'40vw',height:'40vw',overflow:'hidden',margin:'auto',marginTop:'1rem',border:'2px solid black',borderRadius:'2rem'}}>
      
      <RoutingMap/>

      </div>
    </div>
  );
};

export default Home;
