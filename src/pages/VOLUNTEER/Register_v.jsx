import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, imgdb } from '../../firebase'; // Import Firebase services as configured in your project
import { useNavigate } from 'react-router-dom';

const Register_v = () => {
  // State Hooks for Form Fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const navigate=useNavigate();
  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Create a new user in Firebase Authentication
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const { uid } = user;

      // Upload the profile image to Firebase Storage
      const imgRef = ref(imgdb, `uploads/images/${Date.now()}-${profileImage.name}`);
      const uploadResult = await uploadBytes(imgRef, profileImage);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      // Store user data in Firestore
      const userDoc = doc(db, "users", uid);
      await setDoc(userDoc, {
        uid,
        Email: email,
        FullName: fullName,
        Phone: phone,
        Address: address,
        Role: "Volunteer",
        ProfileImage: downloadURL,
        status:'offline',
        work_status:'free',
      });

      alert("Volunteer Account Registered successfully!");
      navigate('/');
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Error creating account. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section - Volunteer Registration Form */}
      <div className="w-1/2 bg-white flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="text-right mb-4">
            <a href="/login" className="text-sm text-gray-500">
              Already have an account? 
              <span className="text-green-600 ml-1">Login</span>
            </a>
          </div>
          <h1 className="text-3xl font-bold mb-2">Register as a Volunteer</h1>
          <p className="text-gray-500 mb-6">
            Join us in redistributing surplus food and helping those in need.
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
              <input 
                type="file" 
                onChange={(e) => setProfileImage(e.target.files[0])}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                required
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                placeholder="Full Name" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                type="text" 
                placeholder="Phone Number" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                required
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
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input 
                type="text" 
                placeholder="Address" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                required
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
                required
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
                required
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-green-600 text-white py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              CREATE ACCOUNT
            </button>
          </form>

          <p className="mt-4">
            By signing up, you agree to the Terms of Service and Privacy Policy.
          </p>
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
        </div>
      </div>
    </div>
  );
};

export default Register_v;
