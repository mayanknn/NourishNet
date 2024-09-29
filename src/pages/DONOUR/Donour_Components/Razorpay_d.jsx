import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { db } from '../../../firebase'; // Adjust the path as needed
import { collection, getDocs, query, where, addDoc, setDoc, doc } from 'firebase/firestore';

const Razorpay_d = () => {
  const [ngoList, setNgoList] = useState([]);
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [amount, setAmount] = useState(100);
  const [responseId, setResponseId] = useState("");
  const [responseState, setResponseState] = useState(null);

  const navigate = useNavigate();

  // Fetch NGOs from Firestore
  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const ngosRef = collection(db, 'users');
        const q = query(ngosRef, where('Role', '==', 'NGO'));
        const snapshot = await getDocs(q);
        const ngosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNgoList(ngosData);
      } catch (error) {
        console.error("Error fetching NGOs: ", error);
      }
    };

    fetchNGOs();
  }, []);

  function randomAlphaNumeric(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  // Function to create donation history
  const createDonationHistory = async () => {
    const donorId = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).uid : null;
    const donorName = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).Organization_name : null;

    if (!donorId || !donorName || !selectedNGO) return;

    try {
      const id = randomAlphaNumeric(10);
      const currentDate = new Date().toLocaleDateString();
      const donationHistoryRef = collection(db, 'donationCashHistory');
      const donationHistoryDoc = doc(donationHistoryRef,id)
      await setDoc(donationHistoryDoc, {
        donorid: donorId,
        cashid:id,
        donorname: donorName,
        ngoid: selectedNGO.id, // Assuming `selectedNGO` has an `id` property
        ngoname: selectedNGO.NGO_name,
        transactionid: responseId,
        amount: amount,
        createdAt: currentDate,
      });
      console.log("Donation history created successfully");
    } catch (error) {
      console.error("Error creating donation history: ", error);
    }
  };

  // Monitor changes to responseId and create donation history
  useEffect(() => {
    if (responseId) {
      createDonationHistory();
    }
  }, [responseId]);

  const handleRadioChange = (ngo) => {
    setSelectedNGO(ngo);
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createRazorpayOrder = async () => {
    try {
      const response = await axios.post(
        "https://razorpay-node-2m6m.onrender.com/orders",
        {
          amount: amount * 100,
          currency: "INR",
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      handleRazorpayScreen(response.data.amount);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const handleRazorpayScreen = async (amount) => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Error loading Razorpay script");
      return;
    }

    const options = {
      key: 'rzp_test_GcZZFDPP0jHtC4',
      amount: amount,
      currency: 'INR',
      name: selectedNGO?.NGO_name || "NGO", // Update name based on selected NGO
      description: "Donation to NGO",
      image: "https://papayacoders.com/demo.png",
      handler: (response) => setResponseId(response.razorpay_payment_id),
      prefill: { name: "Donor Name", email: "donor@example.com" },
      theme: { color: "#F4C430" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const paymentFetch = async (e) => {
    e.preventDefault();
    const paymentId = e.target.paymentId.value;

    try {
      const response = await axios.get(`http://localhost:5000/payment/${paymentId}`);
      setResponseState(response.data);
    } catch (error) {
      console.error("Error fetching payment:", error);
      alert("Error fetching payment details. Please check the Payment ID.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">NGO List Near Me</h1>

      <ul className="space-y-4">
        {ngoList.map((ngo, index) => (
          <li key={index} className="flex items-center p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-green-500"
                name="ngo"
                checked={selectedNGO?.NGO_name === ngo.NGO_name} // Ensure you're accessing the correct property
                onChange={() => handleRadioChange(ngo)}
              />
              <span className="text-lg font-medium text-gray-800">{ngo.NGO_name}</span>
            </label>
          </li>
        ))}
      </ul>

      {selectedNGO && (
        <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
          <strong>You selected:</strong> {selectedNGO.NGO_name}
        </div>
      )}

      <div className="mt-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border border-gray-300 rounded p-2"
          placeholder="Enter Amount"
          required
        />
        <button
          onClick={createRazorpayOrder}
          className={`ml-2 text-white font-bold py-2 px-4 rounded ${
            selectedNGO && amount > 0 ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={!selectedNGO || amount <= 0}
        >
          Donate
        </button>
      </div>
    </div>
  );
};

export default Razorpay_d;
