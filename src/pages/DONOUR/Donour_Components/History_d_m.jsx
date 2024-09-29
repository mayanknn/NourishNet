import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase'; // Adjust the path as needed
import { collection, getDocs } from 'firebase/firestore';

function History_d_m() {
    const [donationHistory, setDonationHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDonationHistory = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'donationCashHistory'));
                const historyData = [];

                querySnapshot.forEach((doc) => {
                    historyData.push({ id: doc.id, ...doc.data() });
                });

                setDonationHistory(historyData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDonationHistory();
    }, []);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (error) {
        return <h2>Error: {error}</h2>;
    }

    return (
        <div>
            <h1>Cash Donation History</h1>
            <ul>
                {donationHistory.map((donation) => (
                    <li key={donation.id}>
                        Donor Name: {donation.donorname} | Amount: {donation.amount} | NGO: {donation.ngoname} | Date: {donation.createdAt}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default History_d_m;
