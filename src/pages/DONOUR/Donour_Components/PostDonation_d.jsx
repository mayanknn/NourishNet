import React, { useState, useEffect } from 'react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase'; // Ensure the Firebase config path is correct
import { useNavigate } from 'react-router-dom';
import poor from '../../../assets/poor.jpeg'
const PostDonation_d = () => {
  const [foodType, setFoodType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [description, setDescription] = useState('');
  const [expiry, setExpiry] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Utility function to generate a random alphanumeric ID
  function randomAlphaNumeric(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  const localUser = localStorage.getItem('userData');
  const userData = JSON.parse(localUser);
  // Load user data from localStorage and set the initial address
  useEffect(() => {
    const localUser = localStorage.getItem('userData');
    const userData = JSON.parse(localUser);
    if (userData && userData.address) {
      setPickupAddress(userData.address); // Set initial address from user data
    }
  }, []);

  // Function to get the current location
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

  // Function to handle the posting of the donation
  const postDonation = async () => {
    // Validation: Check if all required fields are filled
    if (!foodType || !quantity || !pickupAddress || !expiry) {
      setErrorMessage('All fields are required.');
      return;
    }

    try {
      // Get the user's current location
      const location = await getLocation(); // Wait until location is fetched

      // Proceed to post donation if location is successfully retrieved
      const id = randomAlphaNumeric(10); // Generating unique ID for the donation
      const donationref = collection(db, 'donations');
      const donationDoc = doc(donationref, id);
      const localUser = localStorage.getItem('userData');
      const userData = JSON.parse(localUser);
      const currentDate = new Date().toLocaleDateString();
      console.log(location);

      // Create a new donation document in Firestore
      await setDoc(donationDoc, {
        donorid: userData?.uid,
        donor_name: userData?.Organization_name,
        donationid: id,
        FoodType: foodType,
        pickup_status: 'pending',
        status:'pending',
        date: currentDate,
        quantity: quantity,
        LocationLang: location.latitude, // Use location object instead of state
        LocationLong: location.longitude, // Use location object instead of state
        expiry: expiry,
        pickupAddress: pickupAddress,
        description: description,
      });
      console.log(userData.Organization_name);
      localStorage.setItem('LocationDonor', JSON.stringify({donorid: userData?.uid,
        donor_name: userData?.Organization_name,
        donationid: id,
        FoodType: foodType,
        pickup_status: 'pending',
        date: currentDate,
        quantity: quantity,
        LocationLang: location.latitude, // Use location object instead of state
        LocationLong: location.longitude, // Use location object instead of state
        expiry: expiry,
        pickupAddress: pickupAddress,
        description: description}));
      console.log('Donation posted successfully!');
      navigate('/home_d/postDonation_d/allNgos_f');
    } catch (error) {
      console.error('Failed to post donation:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 z-5" style={{marginTop:'5rem',padding:'2rem'}}>
      <div className="bg-white shadow-lg rounded-lg flex overflow-hidden" style={{ width: '900px' }}>
        <div className="w-1/2 p-8">
          <h1 className="text-2xl font-bold mb-4">Post Your Donation</h1>
          <h2 className="text-xl font-medium mb-6">Donation Information</h2>

          {/* Error Message */}
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

          {/* Food Type Input Field */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="food-type">
              Food Type:
            </label>
            <input
              className="w-full border border-gray-300 rounded-md p-4"
              type="text"
              id="food-type"
              name="foodType"
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              placeholder="Enter food type..."
              required
            />
          </div>

          {/* Quantity Input Field */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="quantity">
              Quantity:
            </label>
            <input
              className="w-full border border-gray-300 rounded-md p-4"
              type="number"
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity..."
              required
            />
          </div>

          {/* Pickup Address Input Field */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="pickup-address">
              Pickup Address:
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-4"
              id="pickup-address"
              name="pickupAddress"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              rows="4"
              placeholder="Enter pickup address..."
              required
            ></textarea>
          </div>

          {/* Expiry Date Input Field */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="expiry">
              Expiry Date:
            </label>
            <input
              className="w-full border border-gray-300 rounded-md p-4"
              type="date"
              id="expiry"
              name="expiry"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="Select expiry date..."
              required
            />
          </div>

          {/* Description Input Field */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
              Description:
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-4"
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              placeholder="Add any additional details..."
            ></textarea>
          </div>

          {/* Post Donation Button */}
          <button className="w-full py-2 bg-blue-600 text-white font-medium rounded-md" onClick={postDonation}>
            Post Donation
          </button>
        </div>

        {/* Right Section - Placeholder Image and Text */}
        <div className="w-1/2 relative">
          <img
            src={poor}
            alt="Happy elderly man with glasses smiling in a park"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
            <p className="text-lg font-medium">{userData.Organization_name} - Grateful Donor</p>
            <p className="text-sm mt-2">"Thank you so much for your kindness! Your generous donations light up our lives and help us nourish our community. Together, we’re making dreams come true!"</p>
            <div className="flex mt-2">
              <i className="fas fa-star text-yellow-400"></i>
              <i className="fas fa-star text-yellow-400"></i>
              <i className="fas fa-star text-yellow-400"></i>
              <i className="fas fa-star text-yellow-400"></i>
              <i className="fas fa-star text-yellow-400"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDonation_d;