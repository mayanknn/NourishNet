import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase'; // Ensure correct Firebase configuration import
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const DonationRequests = () => {
    const [donationData, setDonationData] = useState([]);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Retrieve user data from localStorage and set it in state
        const localUser = localStorage.getItem('userData');
        if (localUser) {
            setUserData(JSON.parse(localUser));
        }
    }, []);

    useEffect(() => {
        // Run the donation fetch only when userData is available and has a valid UID
        if (!userData || !userData.uid) return;

        const fetchDonations = async () => {
            try {
                const donationsRef = collection(db, 'donationRequests');
                // Query with two conditions: status = 'Pending' and ngoId = userData.uid
                const pendingDonationsQuery = query(
                    donationsRef,
                    where('status', '==', 'Pending'),
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

    // Function to handle updating the status to "Approved" and deleting non-approved related documents
    const handleApprove = async (id, donationid) => {
        try {
            console.log(donationid);
            // 1. Update the status of the approved document in the "donationRequests" collection
            const donationDoc = doc(db, 'donationRequests', id);
            await updateDoc(donationDoc, { status: 'Approved' });

            // 2. Fetch all documents with the same `donationid`
            const donationsRef = collection(db, 'donationRequests');
            const relatedDonationsQuery = query(
                donationsRef,
                where('donationid', '==', donationid)
            );

            const relatedSnapshot = await getDocs(relatedDonationsQuery);

            // 3. Delete only the documents that are not "Approved"
            const deletePromises = relatedSnapshot.docs
                .filter(doc => doc.data().status !== 'Approved')
                .map(relatedDoc => deleteDoc(doc(db, 'donationRequests', relatedDoc.id)));

            await Promise.all(deletePromises);

            // 4. Update the "donations" collection with `ngoAssigned` field
            const donationRef = doc(db, 'donations', donationid); // Assuming `donationid` is the document ID in `donations`
            await updateDoc(donationRef, { ngoAssigned: userData.uid,ngoAssigned_name:userData.NGO_name});

            // 5. Update the state to reflect the changes, keeping the approved donation intact
            setDonationData((prevData) =>
                prevData.map(donation =>
                    donation.donationid === donationid
                        ? { ...donation, status: 'Approved' }  // Update status of the approved donation in the state
                        : donation
                ).filter(donation => donation.status !== 'Pending')  // Remove only non-approved donations from the list
            );
        } catch (error) {
            console.error('Error approving donation: ', error);
        }
    };

    // Function to handle updating the status to "Rejected"
    const handleReject = async (id) => {
        try {
            const donationDoc = doc(db, 'donationRequests', id);
            await updateDoc(donationDoc, { status: 'Rejected' });

            // Update the state to remove the rejected donation from the list
            setDonationData((prevData) => prevData.filter(donation => donation.id !== id));
        } catch (error) {
            console.error('Error rejecting donation: ', error);
        }
    };

    return (
        <div className="p-4 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {donationData.length > 0 ? (
                donationData.map((donation, index) => (
                    <div key={index} className="p-4 bg-white rounded-xl shadow-md space-y-4">
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
                                {/* "Tick" button to approve donation */}
                                <button
                                    onClick={() => handleApprove(donation.id, donation.donationid)}
                                    className="bg-green-500 text-white font-bold py-2 px-4 rounded"
                                >
                                    Tick
                                </button>

                                {/* "Wrong" button to reject donation */}
                                <button
                                    onClick={() => handleReject(donation.id)}
                                    className="bg-red-500 text-white font-bold py-2 px-4 rounded"
                                >
                                    Wrong
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-3 text-center text-gray-500">No pending donations found.</div>
            )}
        </div>
    );
};

export default DonationRequests;
