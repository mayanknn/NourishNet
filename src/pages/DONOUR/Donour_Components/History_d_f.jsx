import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase'; // Adjust the path as needed
import { collection, query, where, getDocs } from 'firebase/firestore';

function History_d_f() {
  const [donations, setDonations] = useState([]);
  
  useEffect(() => {
    const fetchDonations = async () => {
      const donorId = localStorage.getItem('userData')
        ? JSON.parse(localStorage.getItem('userData')).uid
        : null;

      if (!donorId) return;

      try {
        const donationsRef = collection(db, 'donations'); // Replace with your actual collection name
        const q = query(donationsRef, where('donorid', '==', donorId), where('status', '==', 'Completed'));
        const snapshot = await getDocs(q);

        const donationsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDonations(donationsData);
      } catch (error) {
        console.error('Error fetching donations: ', error);
      }
    };

    fetchDonations();
  }, []);

  return (
    <>
      <h1>Food Donations</h1>
      {donations.length === 0 ? (
        <p>No completed donations found.</p>
      ) : (
        <ul>
          {donations.map(donation => (
            <li key={donation.id} className="mb-4 p-4 border rounded-lg shadow">
              <h2 className="font-bold">NGO Name: {donation.ngoAssigned_name || 'Unknown NGO'}</h2>
              <p>Quantity {donation.quantity || 'N/A'}</p>
              <p>Status: {donation.status}</p>
              <p>Food name: {donation.FoodType || 'No description available'}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default History_d_f;
