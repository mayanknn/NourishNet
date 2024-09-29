import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, setDoc } from 'firebase/firestore'; // Correct imports

const AllNGOs_f = () => {
    const [ngoList, setNgoList] = useState([]);
    const [selectedNGOs, setSelectedNGOs] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [distances, setDistances] = useState([]);

    // Fetch user's location from local storage and define it as the start point
    const LocationDonor = JSON.parse(localStorage.getItem('LocationDonor'));
    const userLocation = { lat: LocationDonor?.LocationLang, lng: LocationDonor?.LocationLong };
    const userId = LocationDonor?.donationid;

    useEffect(() => {
        const fetchNGOs = async () => {
            try {
                const ngosRef = collection(db, 'users');
                const ngosQuery = query(ngosRef, where('Role', '==', 'NGO'));
                const snapshot = await getDocs(ngosQuery);
                const ngosData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setNgoList(ngosData);
                calculateDistances(ngosData);
            } catch (error) {
                console.error("Error fetching NGOs: ", error);
            }
        };
        fetchNGOs();
    }, []);

    const calculateDistances = (ngosData) => {
        const distancesData = ngosData.map((ngo) => {
            const distance = haversine(userLocation, { lat: ngo.Latitude, lng: ngo.Longitude });
            return { id: ngo.uid, name: ngo.NGO_name, distance, coordinates: { lat: ngo.Latitude, lng: ngo.Longitude } };
        });
        distancesData.sort((a, b) => a.distance - b.distance);
        setDistances(distancesData);
    };

    const haversine = (coord1, coord2) => {
        const R = 6371;
        const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
        const dLon = (coord2.lng - coord1.lng) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(coord1.lat * (Math.PI / 180)) * Math.cos(coord2.lat * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const handleCheckboxChange = (ngo) => {
        if (selectedNGOs.find(selected => selected.id === ngo.id)) {
            setSelectedNGOs(selectedNGOs.filter(selected => selected.id !== ngo.id));
        } else {
            setSelectedNGOs([...selectedNGOs, { id: ngo.id, name: ngo.name }]);
        }
    };

    const handleSelectAll = () => {
        if (!selectAll) {
            setSelectedNGOs(distances.map(ngo => ({ id: ngo.id, name: ngo.name })));
        } else {
            setSelectedNGOs([]);
        }
        setSelectAll(!selectAll);
    };

    const updateUserNGOs = async () => {
        if (userId && selectedNGOs.length > 0) {
            try {
                const userRef = doc(db, 'donations', userId);
                await updateDoc(userRef, {
                    NGOs: selectedNGOs
                });
                console.log("User NGOs updated successfully");
                function randomAlphaNumeric(length) {
                    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    let result = '';
                    for (let i = 0; i < length; i++) {
                      result += chars.charAt(Math.floor(Math.random() * chars.length));
                    }
                    return result;
                  }
                // Create donation requests for each selected NGO
                console.log(selectedNGOs);
                for (let ngo of selectedNGOs) {
                    const id = randomAlphaNumeric(10); // Generating unique ID for the donation
                    const donationRequestsRef = collection(db, 'donationRequests');
                    const donationRequestDoc  = doc(donationRequestsRef,id);
                    const localUser = localStorage.getItem('userData');
                    const userData = JSON.parse(localUser);
                    await setDoc(donationRequestDoc, {
                        donorId:userData.uid,
                        donorLocation: userData.address,
                        donationid:LocationDonor.donationid,
                        donorfoodname:LocationDonor.FoodType,
                        expiry:LocationDonor.expiry,
                        ngoId: ngo.id,
                        donationQty:LocationDonor.quantity,
                        donationdesc:LocationDonor.description,
                        status: 'Pending', // Add status field to track the donation request
                        requestDate: new Date().toISOString(),
                        id:id // Record the request date
                    });
                }

                console.log("Donation requests added successfully.");
            } catch (error) {
                console.error("Error updating user NGOs or creating donation requests: ", error);
            }
        } else {
            console.warn("User ID is not defined or no NGOs selected.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-700">Start Point (Your Location)</h2>
                <p className="text-gray-600">Latitude: {userLocation.lat}</p>
                <p className="text-gray-600">Longitude: {userLocation.lng}</p>
            </div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">NGO List Near Me</h1>
                <div>
                    <label className="inline-flex items-center">
                        <input type="checkbox" className="form-checkbox h-5 w-5 text-green-500" checked={selectAll} onChange={handleSelectAll} />
                        <span className="ml-2 text-gray-700">Select All</span>
                    </label>
                </div>
            </div>
            <ul className="space-y-4">
                {distances.map((ngo) => (
                    <li key={ngo.id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition">
                        <label className="flex items-center space-x-3">
                            <input type="checkbox" className="form-checkbox h-5 w-5 text-green-500" checked={selectedNGOs.find(selected => selected.id === ngo.id) !== undefined} onChange={() => handleCheckboxChange(ngo)} />
                            <span className="text-lg font-medium text-gray-800">{ngo.name}</span>
                        </label>
                        <div className="flex flex-col items-end">
                            <span className="text-sm text-gray-500">{ngo.distance.toFixed(2)} km away</span>
                            <span className="text-xs text-gray-500">Latitude: {ngo.coordinates.lat}</span>
                            <span className="text-xs text-gray-500">Longitude: {ngo.coordinates.lng}</span>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="mt-4">
                <button onClick={updateUserNGOs} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Update Selected NGOs
                </button>
            </div>
            <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-700">Selected NGOs:</h2>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg shadow-sm">
                    {selectedNGOs.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-700">
                            {selectedNGOs.map((ngo, index) => (
                                <li key={index}>{ngo.name} (ID: {ngo.id})</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No NGOs selected.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllNGOs_f;
