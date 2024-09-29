import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, imgdb } from '../../firebase'; // Import Firebase configuration
import 'tailwindcss/tailwind.css';
import { useNavigate } from 'react-router-dom';

const Register_n = () => {
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nname, setNname] = useState(''); // NGO Name
  const [nrn, setNrn] = useState(''); // NGO Registration Number
  const [phone, setPhone] = useState(''); // Contact Number
  const [address, setAddress] = useState(''); // Address
  const [capacity, setCapacity] = useState(''); // Storage Capacity
  const [misser, setMisser] = useState(''); // Mission and Services
  const [prefDonation, setPrefDonation] = useState(''); // Preferred Donation Type
  const [profileImage, setProfileImage] = useState(null); // Profile Image File
  const [latitude, setLatitude] = useState(null); // Latitude
  const [longitude, setLongitude] = useState(null); // Longitude
  const [errorMessage, setErrorMessage] = useState(null); // Error Message

  const navigate = useNavigate();

  // Geolocation function to get latitude and longitude
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setLatitude(coords.latitude);
            setLongitude(coords.longitude);
            resolve(coords); // Pass coordinates to resolve
          },
          (error) => {
            setErrorMessage('Error retrieving location: ' + error.message);
            reject(error);
          }
        );
      } else {
        setErrorMessage('Geolocation is not supported by this browser.');
        reject(new Error('Geolocation not supported.'));
      }
    });
  };

  // Handler for form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      // Get location coordinates
      const { latitude, longitude } = await getLocation();

      // Firebase Auth: Create User
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const { uid } = user;

      // Upload Profile Image to Firebase Storage
      const imgRef = ref(imgdb, `uploads/images/${Date.now()}-${profileImage.name}`);
      const uploadResult = await uploadBytes(imgRef, profileImage);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      // Save NGO data to Firestore
      const userDoc = doc(db, 'users', uid);
      await setDoc(userDoc, {
        uid,
        Email: email,
        NGO_name: nname,
        Phone: phone,
        address: address,
        capacity: capacity,
        NGO_Reg_No: nrn,
        Mission: misser,
        Preferred_Donation: prefDonation,
        Role: 'NGO',
        Password: password,
        OraganizationProfileImage: downloadURL,
        Latitude: latitude,
        Longitude: longitude,
      });

      alert('NGO Registered Successfully!');
      navigate('/');
      
    } catch (error) {
      console.error('Error registering NGO:', error.message);
      alert('Failed to register NGO');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section - NGO Registration Form */}
      <div className="w-1/2 bg-white flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="text-right mb-4">
            <a href="/login" className="text-sm text-gray-500">
              Already have an account? 
              <span className="text-green-600 ml-1">Login</span>
            </a>
          </div>
          <h1 className="text-3xl font-bold mb-2">Register Your NGO</h1>
          <p className="text-gray-500 mb-6">
            Join us in redistributing surplus food to help those in need.
          </p>

          <form className="space-y-4" onSubmit={handleRegister}>
            {/* NGO Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NGO Name</label>
              <input 
                type="text" 
                placeholder="NGO Name" 
                value={nname} 
                onChange={(e) => setNname(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            {/* NGO Registration Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NGO Registration Number</label>
              <input 
                type="text" 
                placeholder="Registration Number" 
                value={nrn} 
                onChange={(e) => setNrn(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input 
                type="text" 
                placeholder="Contact Number" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            {/* NGO Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NGO Address</label>
              <input 
                type="text" 
                placeholder="NGO Address" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            {/* Capacity to Store Food */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity to Store Food</label>
              <input 
                type="text" 
                placeholder="Capacity (in kg or liters)" 
                value={capacity} 
                onChange={(e) => setCapacity(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            {/* Mission and Service */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mission and Service</label>
              <textarea 
                placeholder="Describe your NGO's mission and services" 
                value={misser} 
                onChange={(e) => setMisser(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                rows="4"
              ></textarea>
            </div>

            {/* Preferred Donation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Donation Type</label>
              <select 
                value={prefDonation} 
                onChange={(e) => setPrefDonation(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="raw">Raw Materials</option>
                <option value="prepared">Surplus Prepared Food</option>
              </select>
            </div>

            {/* Profile/Organization Picture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile/Organization Picture</label>
              <input 
                type="file" 
                onChange={(e) => setProfileImage(e.target.files[0])}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input 
                type="password" 
                placeholder="Confirm Password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-green-600 text-white py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Create NGO Account
            </button>
          </form>
        </div>
      </div>

      {/* Right Section - Info/Illustration */}
      <div className="w-1/2 bg-green-600 text-white flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md text-center">
          <div className="mb-4">
            <div className="bg-green-800 rounded-full w-10 h-10 flex items-center justify-center mx-auto">
              <i className="fas fa-quote-left text-white"></i>
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4">Together We Can Make a Difference</h2>
          <p className="text-gray-200 mb-6">
            "The best way to find yourself is to lose yourself in the service of others." — Mahatma Gandhi
          </p>
          <div className="flex items-center justify-center">
            <img
              src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-RcpoXHkzChYnDbFAyeQ8tamr/user-ehrvabJ3DufsCu8YJ7PqY5gl/img-OugMdjXMs8tyrnybTyr053ao.png"
              alt="Volunteer Profile Picture"
              className="rounded-full mr-3"
              width="40"
              height="40"
            />
            <div>
              <p className="font-semibold">John Smith</p>
              <p className="text-sm text-gray-300">Volunteer, NourishNet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register_n;