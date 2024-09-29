import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';
import { getFirestore, collection, query, getDocs, where, doc, updateDoc } from 'firebase/firestore'; // Added doc, updateDoc
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase'; // Assuming you have a firebase configuration file
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'

const auth = getAuth(app);
const db = getFirestore(app);
const userRef = collection(db, 'users'); // Replace 'users' with your Firestore collection name

const Login = () => {
  // State hooks for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Login handler function
  const check = async (event) => {
    event.preventDefault(); // Prevent the form from submitting

    try {
      // Authenticate user with Firebase
      const result = await signInWithEmailAndPassword(auth, email, password);
      

      // Fetch user role from Firestore based on email
      const querySnapshot = await getDocs(query(userRef, where('Email', '==', email)));
      if (!querySnapshot.empty) {
        const queryData = querySnapshot.docs[0].data();
        const userId = querySnapshot.docs[0].id;

        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify(queryData));
        alert('Login Successful');
        // Navigate based on user role
        if (queryData.Role === 'Donor') {
          navigate('/home_d');
        } else if (queryData.Role === 'NGO') {
          navigate('/home_n');
        } else if (queryData.Role === 'Volunteer') {
          // Update volunteer status to "online"
          const volunteerRef = doc(db, 'users', userId); // Reference the volunteer's document
          await updateDoc(volunteerRef, { status: 'online' }); // Update status to online

          console.log('Volunteer status updated to online');
          navigate('/home_v');
        }
      }
      else{
        alert("User not found");
      }
    } catch (error) {
      console.error('Error logging in: ', error);
      alert('Login Failed');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
      <div className="w-1/2 bg-white flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          
          <h1 className="text-3xl font-bold mb-2">Welcome Back to NourishNet</h1>
          <p className="text-gray-500 mb-6">
            Join us in redistributing surplus food to nourish lives. Let's make a positive impact together.
          </p>
          <form onSubmit={check}>
            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Setting email state
                placeholder="example@gmail.com"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Setting password state
                placeholder="6+ strong characters"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Sign In
            </button>
          </form>

          {/* Social Media Login Options */}
          <div className="text-left mb-4 mt-4">
            <a href="#" className="text-sm text-gray-500">
              Don't have an account?
              <span className="text-green-600 ml-1" onClick={() => navigate('/')}>Sign Up</span>
            </a>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration/Quote */}
      <div className="w-1/2 bg-green-600 text-white flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md text-center">
          <div className="mb-4">
            <div className="rounded-full w-30 h-30 flex items-center justify-center mx-auto">
              <img src={logo} alt="" style={{backgroundColor:'white',padding:'1.2rem'}} />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4">Together We Can Make a Difference</h2>
          <p className="text-gray-200 mb-6">
            "The best way to find yourself is to lose yourself in the service of others." — Mahatma Gandhi
          </p>
          
        </div>
      </div>
    </div>
  );
};

export default Login;
