import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend } from 'chart.js';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase'; // Adjust the import path if necessary

// Register the required components for Pie chart
ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

const AdminGraphs = () => {
    const [donationData, setDonationData] = useState([]);
    const [distributionData, setDistributionData] = useState([]);
    const [nutritionalData, setNutritionalData] = useState(null);
    const [userData, setUserData] = useState([]);
    const [error, setError] = useState('');

    // Fetch data from Firestore and other simulated data
    useEffect(() => {
        const fetchData = async () => {
            // Fetch donation data from Firestore
            const donationCollection = collection(db, 'donationCashHistory');
            try {
                const querySnapshot = await getDocs(donationCollection);
                const donationHistory = [];

                // Loop through the Firestore documents and extract necessary fields
                querySnapshot.forEach((doc) => {
                    const donation = doc.data();
                    donationHistory.push({
                        month: donation.createdAt, // assuming createdAt stores month in a readable format
                        totalDonations: donation.amount,
                    });
                });
                
                setDonationData(donationHistory); // Update state with fetched donation data
            } catch (error) {
                setError('Error fetching donation data');
                console.error('Error fetching donation history:', error);
            }

            // Fetch inventory data
            const inventoryCollection = collection(db, 'inventory');
            try {
                const querySnapshot = await getDocs(inventoryCollection);
                const inventoryData = {};
                
                // Loop through each document in the 'inventory' collection
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const { ngoName, Quantity } = data;

                    // If the NGO already exists in the inventoryData, add the quantity
                    if (inventoryData[ngoName]) {
                        inventoryData[ngoName] += parseInt(Quantity, 10); // Accumulate quantity
                    } else {
                        inventoryData[ngoName] = parseInt(Quantity, 10); // Initialize quantity
                    }
                });

                // Convert the aggregated data to an array format for distributionData
                const distributionArray = Object.entries(inventoryData).map(([name, value]) => ({
                    name,
                    value,
                }));

                setDistributionData(distributionArray); // Update state with aggregated distribution data
            } catch (error) {
                setError('Error fetching inventory data');
                console.error('Error fetching inventory data:', error);
            }

            // Fetch user data
            const usersCollection = collection(db, 'users');
            try {
                const querySnapshot = await getDocs(usersCollection);
                const userCounts = { NGOs: 0, Donors: 0, Volunteers: 0 }; // Initialize counts for each Role
                
                // Loop through each document in the 'users' collection
                querySnapshot.forEach((doc) => {
                    const user = doc.data();
                    const { Role } = user; // Assuming each user document has a 'Role' field

                    // Increment the count based on the user's Role
                    if (Role === 'NGO') {
                        userCounts.NGOs += 1;
                    } else if (Role === 'Donor') {
                        userCounts.Donors += 1;
                    } else if (Role === 'Volunteer') {
                        userCounts.Volunteers += 1;
                    }
                });

                // Convert the userCounts object to an array format for userData
                const userArray = Object.entries(userCounts).map(([type, count]) => ({
                    type,
                    count,
                }));

                setUserData(userArray); // Update state with aggregated user data
            } catch (error) {
                setError('Error fetching user data');
                console.error('Error fetching user data:', error);
            }

            // Simulated fetch for nutritional data
            const nutrition = {
                labels: ['Proteins', 'Fats', 'Carbs'],
                datasets: [{
                    data: [300, 200, 500],
                    backgroundColor: ['#8884d8', '#82ca9d', '#ffc658'],
                }],
            };
            setNutritionalData(nutrition);
        };

        fetchData();
    }, []);

    // Render Total Donations Over Time Line Chart
    const renderDonationLineChart = () => (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={donationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalDonations" stroke="#4CAF50" />
            </LineChart>
        </ResponsiveContainer>
    );

    // Render Food Distribution by NGO Bar Chart
    const renderDistributionBarChart = () => (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#4CAF50" />
            </BarChart>
        </ResponsiveContainer>
    );

    // Render User Distribution Bar Chart
    const renderUserDistributionBarChart = () => (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#4CAF50" />
            </BarChart>
        </ResponsiveContainer>
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-6">
            <h1 className="text-3xl text-white mb-6">Admin Data Visualization</h1>
            <div className="my-8 w-full">
                <h2 className="text-2xl text-white mb-4">Total Donations Over Time</h2>
                {renderDonationLineChart()}
            </div>
            <div className="my-8 w-full">
                <h2 className="text-2xl text-white mb-4">Food Distribution by NGO</h2>
                {renderDistributionBarChart()}
            </div>
            <div className="my-8 w-full">
                <h2 className="text-2xl text-white mb-4">User Distribution</h2>
                {renderUserDistributionBarChart()}
            </div>
            {error && <p className="text-red-500 text-lg">{error}</p>}
        </div>
    );
};

export default AdminGraphs;
