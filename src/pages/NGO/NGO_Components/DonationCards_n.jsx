import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase'; // Ensure correct Firebase configuration import
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import VolunteersAvailable from './VolunteersAvailable_n'; // Adjust the import path as necessary

const DonationCards_n = () => {
    const [donationData, setDonationData] = useState([]);
    const [userData, setUserData] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup visibility
    const [selectedDonation, setSelectedDonation] = useState(null); // To store selected donation details

    useEffect(() => {
        const localUser = localStorage.getItem('userData');
        if (localUser) {
            setUserData(JSON.parse(localUser));
        }
    }, []);

    useEffect(() => {
        if (!userData || !userData.uid) return;

        const fetchDonations = async () => {
            try {
                const donationsRef = collection(db, 'donationRequests');
                const pendingDonationsQuery = query(
                    donationsRef,
                    where('status', '==', 'Approved'),
                    where('ngoId', '==', userData.uid)
                );

                const snapshot = await getDocs(pendingDonationsQuery);
                const donations = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setDonationData(donations);
            } catch (error) {
                console.error("Error fetching donation data: ", error);
            }
        };

        fetchDonations();
    }, [userData]);

    const handleOpenPopup = async (id) => {
        const selectedDonation = donationData.find(donation => donation.id === id);
        setSelectedDonation(selectedDonation);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedDonation(null); // Reset the selected donation
    };

    const handleVolunteerAssigned = async (id) => {
        try {
            const donationDoc = doc(db, 'donations', id);
            await updateDoc(donationDoc, { status: 'Pickup' }); // Change status to 'Assigned'
            setDonationData((prevData) => prevData.map(donation => 
                donation.id === id ? { ...donation, status: 'Assigned' } : donation
            ));
        } catch (error) {
            console.error('Error updating donation status: ', error);
        }
    };

    return (
        <div className="p-4 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {donationData.length > 0 ? (
                donationData.map((donation) => (
                    <div key={donation.id} className="p-4 bg-white rounded-xl shadow-md space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-xl font-bold">{donation.donorfoodname}</h1>
                            </div>
                            <div className="text-gray-500">
                                <i className="fas fa-map-marker-alt"></i> {donation.donorLocation}
                            </div>
                        </div>
                        <div className="text-gray-500">
                            <span>{donation.quantity}</span> - <span>Best Before: {donation.expiry}</span>
                        </div>
                        <div className="text-gray-700">
                            <p>{donation.donationdesc}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="w-full flex justify-end space-x-2">
                                <button
                                    onClick={() => handleOpenPopup(donation.id)}
                                    className="bg-green-500 text-white font-bold py-2 px-4 rounded"
                                >
                                    Assign Volunteers
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-3 text-center text-gray-500">No pending donations found.</div>
            )}

            {/* Popup for VolunteersAvailable */}
            {isPopupOpen && selectedDonation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 relative max-w-4xl w-full">
                        <button onClick={handleClosePopup} className="absolute top-2 right-2 text-gray-500">
                            &times;
                        </button>
                        <VolunteersAvailable 
                            donation={selectedDonation} 
                            onVolunteerAssigned={handleVolunteerAssigned} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonationCards_n;
