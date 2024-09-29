import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { db } from '../../../firebase'; // Adjust the import path as needed
import { collection, getDocs, query, where } from 'firebase/firestore';

// Icon URLs
const currentLocationIcon = 'data:image/png;base64,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'; // Current location icon
const ngoIcon = 'data:image/png;base64,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'; // NGO icon

const RoutingMap = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const [ngosData, setNgosData] = useState([]);
    const [currentLocation, setCurrentLocation] = useState([0, 0]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchNGOs = async () => {
            try {
                const ngosRef = collection(db, 'users');
                const q = query(ngosRef, where('Role', '==', 'NGO'));
                const snapshot = await getDocs(q);
                const ngos = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setNgosData(ngos);
            } catch (error) {
                console.error("Error fetching NGOs: ", error);
            }
        };

        fetchNGOs();
    }, []);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    setCurrentLocation([latitude, longitude]);
                    setErrorMessage('');
                },
                (error) => {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            setErrorMessage("User denied the request for Geolocation.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            setErrorMessage("Location information is unavailable.");
                            break;
                        case error.TIMEOUT:
                            setErrorMessage("The request to get user location timed out.");
                            break;
                        case error.UNKNOWN_ERROR:
                            setErrorMessage("An unknown error occurred.");
                            break;
                        default:
                            setErrorMessage("An unexpected error occurred.");
                    }
                    setCurrentLocation([0, 0]); // Reset to default if there's an error
                }
            );
        } else {
            setErrorMessage("Geolocation is not supported by this browser.");
            setCurrentLocation([0, 0]);
        }
    };

    useEffect(() => {
        getLocation(); // Get user's current location on mount

        if (mapRef.current || ngosData.length === 0) return;

        // Initialize map with user's current location or first NGO location
        const initialView = currentLocation[0] !== 0 ? currentLocation : [ngosData[0]?.Latitude || 0, ngosData[0]?.Longitude || 0];
        const map = L.map(mapContainerRef.current).setView(initialView, 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);

        // Marker for the current location
        if (currentLocation[0] !== 0) {
            L.marker(currentLocation, {
                icon: L.icon({
                    iconUrl: currentLocationIcon,
                    iconSize: [30, 30],
                    iconAnchor: [15, 30],
                }),
            }).addTo(map).bindTooltip("Current Location", {
                permanent: false,
                sticky: true,
            });
        }

        // Add markers for NGOs
        ngosData.forEach(ngo => {
            const marker = L.marker([ngo.Latitude, ngo.Longitude], {
                icon: L.icon({
                    iconUrl: ngoIcon,
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                }),
            }).addTo(map);

            // Bind tooltip with NGO info
            marker.bindTooltip(`<strong>${ngo.NGO_name}</strong><br>${ngo.Mission}`, {
                permanent: false,
                sticky: true,
            });
        });

        mapRef.current = map;

    }, [ngosData, currentLocation]); // Update map when NGOs or location change

    return (
        <div>
            <div ref={mapContainerRef} style={{ height: '100vh' }} />
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        </div>
    );
};

export default RoutingMap;
