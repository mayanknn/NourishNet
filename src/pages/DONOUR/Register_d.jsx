import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';
import { auth, db, imgdb } from '../../firebase'; // Import Firebase configurations
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'
const Register_d = () => {
  // State management for all inputs
  const [profileImage, setProfileImage] = useState(null);
  const [organizationName, setOrganizationName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role] = useState('NGO'); // Default role for registration
  const navigate=useNavigate();
  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      // Create the user in Firebase Auth
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const { uid } = user;
      console.log('User ID:', uid);

      // Upload profile image to Firebase Storage
      const imgRef = ref(imgdb, `uploads/images/${Date.now()}-${profileImage.name}`);
      const uploadResult = await uploadBytes(imgRef, profileImage);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      // Store user details in Firestore
      const userDoc = doc(db, 'users', uid);
      await setDoc(userDoc, {
        uid,
        Email: email,
        Organization_name: organizationName,
        Phone: phone,
        address: address,
        Role: "Donor",
        OraganizationProfileImage: downloadURL,
      });

      alert('Donor Account Registered Successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error during registration:', error);
      alert(error.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section - Registration Form */}
      <div className="w-1/2 bg-white flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2">Register Your Organization</h1>
          <p className="text-gray-500 mb-6">
            Join us in redistributing surplus food and making a difference.
          </p>

          <form className="space-y-4" onSubmit={handleRegister}>
            {/* Profile/Organization Picture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile/Organization Picture</label>
              <input 
                type="file" 
                onChange={(e) => setProfileImage(e.target.files[0])} // Update state on file select
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            {/* Organization Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
              <input 
                type="text" 
                value={organizationName} 
                onChange={(e) => setOrganizationName(e.target.value)} // Update state on change
                placeholder="Organization Name" 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} // Update state on change
                placeholder="Phone Number" 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} // Update state on change
                placeholder="Email" 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            {/* Organization Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Address</label>
              <input 
                type="text" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} // Update state on change
                placeholder="Organization Address" 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} // Update state on change
                placeholder="Password" 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} // Update state on change
                placeholder="Confirm Password" 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-green-600 text-white py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Create Account
            </button>
          <div className="text-left mb-4">
            <a href="/login" className="text-sm text-gray-500">
              Already have an account? 
              <span className="text-green-600 ml-1">Login</span>
            </a>
          </div>
          </form>
        </div>
      </div>

      {/* Right Section - Info/Illustration */}
      <div className="w-1/2 bg-green-600 text-white flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md text-center">
          <div className="mb-4">
          <div className="rounded-full w-30 h-30 flex items-center justify-center mx-auto">
              <img src={logo} alt="" style={{backgroundColor:'white',padding:'1.2rem'}} />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4">Empowering Communities</h2>
          <p className="text-gray-200 mb-6">
            "Alone we can do so little; together we can do so much." — Helen Keller
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register_d;
