import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, query, where, getDocs, setDoc, doc, updateDoc, getDoc } from 'firebase/firestore';

const VolunteersAvailable = ({ donation, onVolunteerAssigned }) => {
    const [volunteerList, setVolunteerList] = useState([]);
    const [distancesVolunteer, setDistancesVolunteer] = useState([]);
    const [donationData, setDonationData] = useState(null); // State for donation data

    const LocationDonor = JSON.parse(localStorage.getItem('LocationDonor'));
    const userLocation = { lat: LocationDonor?.LocationLang, lng: LocationDonor?.LocationLong };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const volunteersRef = collection(db, 'users');
                const volunteersQuery = query(
                    volunteersRef,
                    where('Role', '==', 'Volunteer'),
                    where('status', '==', 'online'),
                    where('work_status', '==', 'free')
                );

                const snapshotVolunteer = await getDocs(volunteersQuery);
                const volunteersData = snapshotVolunteer.docs.map(doc => ({
                    id: doc.id,
                    FullName: doc.data().FullName,
                    Latitude: doc.data().Latitude,
                    Longitude: doc.data().Longitude,
                    work_status: doc.data().work_status,
                    status: doc.data().status,
                }));
                setVolunteerList(volunteersData);
                calculateDistances(volunteersData);
            } catch (error) {
                console.error("Error fetching volunteers: ", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchDonationData = async () => {
            try {
                const donationDocRef = doc(db, 'donations', donation.donationid);
                const donationSnapshot = await getDoc(donationDocRef);
                
                if (donationSnapshot.exists()) {
                    setDonationData(donationSnapshot.data());
                } else {
                    console.log("No such donation document!");
                }
            } catch (error) {
                console.error("Error fetching donation data: ", error);
            }
        };

        fetchDonationData();
    }, [donation.donationid]); // Run this effect when the donation ID changes

    const calculateDistances = (volunteersData) => {
        const distancesData = volunteersData.map((entry) => {
            const distance = haversine(userLocation, { lat: entry.Latitude, lng: entry.Longitude });
            return { id: entry.id, name: entry.FullName, distance, coordinates: { lat: entry.Latitude, lng: entry.Longitude }, status: entry.status, work_status: entry.work_status };
        });

        distancesData.sort((a, b) => a.distance - b.distance);
        setDistancesVolunteer(distancesData);
    };

    const haversine = (coord1, coord2) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
        const dLon = (coord2.lng - coord1.lng) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(coord1.lat * (Math.PI / 180)) * Math.cos(coord2.lat * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    const handleVolunteerAssignment = async (volunteerId) => {
        if (!donationData) {
            console.error("Donation data is not available.");
            return;
        }

        console.log(`Volunteer ${volunteerId} assigned to donation ID ${donation.donationid}`);

        // Update the volunteer's work status to 'Busy'
        const volunteerDocRef = doc(db, 'users', volunteerId);
        await updateDoc(volunteerDocRef, { work_status: 'Busy' });

        function randomAlphaNumeric(length) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        }

        const id = randomAlphaNumeric(10);
        // Create a new task document in the tasks collection
        const tasksRef = collection(db, 'tasks');
        const taskdoc = doc(tasksRef, id); // Generate a unique task ID

        const lat = donationData?.LocationLang;
        const lon = donationData?.LocationLong;
        const taskLocationLink = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
        
        console.log("Task Location Link: ", taskLocationLink);

        await setDoc(taskdoc, {
            taskId: id,
            taskNeed: donation.donationdesc, // Use the appropriate field from donation
            taskType: 'In-Progress',
            volunteerId: volunteerId,
            volunteerName: volunteerList.find(volunteer => volunteer.id === volunteerId)?.FullName,
            location: taskLocationLink,
            latitude: donationData.LocationLang,
            longitude: donationData.LocationLong,
            donationId: donation.donationid // Link to the donation
        });

        

        // Call the parent function to update donation status
        onVolunteerAssigned(donation.donationid);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Volunteer List Near Me</h2>
            {donationData && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Donation Details:</h3>
                    <p>Description: {donationData.donationdesc}</p>
                    <p>Location: {donationData.LocationLang}, {donationData.LocationLong}</p>
                </div>
            )}
            <ul className="space-y-4">
                {distancesVolunteer.length > 0 ? (
                    distancesVolunteer.map((volunteer) => (
                        <li key={volunteer.id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
                            <span className="text-lg font-medium text-gray-800">{volunteer.name}</span>
                            <span className="text-sm text-gray-500">{volunteer.distance.toFixed(2)} km away</span>
                            <span className="text-sm text-gray-500">Status: {volunteer.status} | Work: {volunteer.work_status}</span>
                            <button
                                onClick={() => handleVolunteerAssignment(volunteer.id)}
                                className="bg-blue-500 text-white font-bold py-1 px-4 rounded"
                            >
                                Assign
                            </button>
                        </li>
                    ))
                ) : (
                    <li className="text-center text-gray-500">No available volunteers found.</li>
                )}
            </ul>
        </div>
    );
};

export default VolunteersAvailable;
 