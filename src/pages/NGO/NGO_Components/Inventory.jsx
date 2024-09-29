import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase'; // Ensure correct Firebase configuration import
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import NutritionImpactAnalyzer from './NutritionImpactAnalyzer'; // Adjust the path as necessary

function Inventory() {
    const [inventoryData, setInventoryData] = useState([]);
    const [userData, setUserData] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null); // State for selected item
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

    useEffect(() => {
        const localUser = localStorage.getItem('userData');
        if (localUser) {
            setUserData(JSON.parse(localUser));
        }
    }, []);

    useEffect(() => {
        const fetchInventory = async () => {
            if (!userData || !userData.uid) return; // Ensure userData is available

            try {
                const inventoryRef = collection(db, 'inventory');
                const inventoryQuery = query(
                    inventoryRef,
                    where('ngoId', '==', userData.uid) // Query to filter by ngoId
                );

                const snapshot = await getDocs(inventoryQuery);
                const inventoryItems = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setInventoryData(inventoryItems);
            } catch (error) {
                console.error('Error fetching inventory data: ', error);
            }
        };

        fetchInventory();
    }, [userData]);

    const handleQualityCheck = async (id, isApproved) => {
        if (!isApproved) {
            if (window.confirm("This food can't be donated as quality is not good. Do you want to delete it?")) {
                try {
                    await deleteDoc(doc(db, 'inventory', id));
                    setInventoryData(prevData => prevData.filter(item => item.id !== id));
                } catch (error) {
                    console.error('Error deleting item: ', error);
                }
            }
            return;
        }

        try {
            const itemDoc = doc(db, 'inventory', id);
            await updateDoc(itemDoc, { QualityCheck: 'Approved' });
            setInventoryData(prevData => 
                prevData.map(item => 
                    item.id === id ? { ...item, QualityCheck: 'Approved' } : item
                )
            );
        } catch (error) {
            console.error('Error updating quality check: ', error);
        }
    };

    const handleDistribute = async (id) => {
        if (window.confirm("This food will be redistributed to the poor people. Do you want to proceed?")) {
            try {
                await deleteDoc(doc(db, 'inventory', id));
                setInventoryData(prevData => prevData.filter(item => item.id !== id));
                alert("Food has been successfully redistributed!");
            } catch (error) {
                console.error('Error deleting item after distribution: ', error);
            }
        }
    };

    // Function to open the nutrition assessment modal
    const openNutritionModal = (foodType, quantity) => {
        setSelectedItem({ foodType, quantity });
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeNutritionModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null); // Reset selected item when closing
    };

    return (
        <>
            {inventoryData.length > 0 ? (
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2">NGO Name</th>
                            <th className="border border-gray-300 p-2">Food Type</th>
                            <th className="border border-gray-300 p-2">Expiry Date</th>
                            <th className="border border-gray-300 p-2">Quantity</th>
                            <th className="border border-gray-300 p-2">Nutritional Assessment</th>
                            <th className="border border-gray-300 p-2">Quality Check</th>
                            <th className="border border-gray-300 p-2">Distribute</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventoryData.map(item => (
                            <tr key={item.id}>
                                <td className="border border-gray-300 p-2">{item.ngoName}</td>
                                <td className="border border-gray-300 p-2">{item.FoodType}</td>
                                <td className="border border-gray-300 p-2">{item.ExpiryDate}</td>
                                <td className="border border-gray-300 p-2">{item.Quantity}</td>
                                <td className="border border-gray-300 p-2">
                                    <button
                                        onClick={() => openNutritionModal(item.FoodType, item.Quantity)} // Open modal with food type and quantity
                                        className="px-2 rounded bg-blue-500 text-white"
                                    >
                                        View
                                    </button>
                                </td>
                                <td className="border border-gray-300 p-2 flex space-x-2">
                                    <button 
                                        onClick={() => handleQualityCheck(item.id, true)} 
                                        className={`px-2 rounded ${item.QualityCheck === 'Approved' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                                        disabled={item.QualityCheck === 'Approved' || item.QualityCheck === 'Rejected'}
                                    >
                                        ✔️
                                    </button>
                                    <button 
                                        onClick={() => handleQualityCheck(item.id, false)} 
                                        className={`px-2 rounded ${item.QualityCheck === 'Rejected' ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                                        disabled={item.QualityCheck === 'Approved' || item.QualityCheck === 'Rejected'}
                                    >
                                        ❌
                                    </button>
                                </td>
                                <td className="border border-gray-300 p-2">
                                    <button 
                                        onClick={() => handleDistribute(item.id)} 
                                        className={`bg-blue-500 text-white px-4 rounded ${item.QualityCheck !== 'Approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={item.QualityCheck !== 'Approved'}
                                    >
                                        Distribute
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-md text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-12 h-12 mx-auto text-gray-500 mb-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M3 3h18v18H3V3z" />
                            <path d="M9 9l6 6M9 15l6-6" />
                        </svg>
                        <h2 className="text-xl font-semibold text-gray-700">No Inventory Records Found</h2>
                        <p className="text-gray-500 mt-2">It looks like there are no items in your inventory. Please check back later or add some items.</p>
                    </div>
                </div>
            )}

            {/* Nutrition Impact Analyzer Modal */}
            {isModalOpen && (
                
                    <div className="bg-white rounded-lg p-4 max-w-md w-full">
                        <button onClick={closeNutritionModal} style={{backgroundColor:'red',color:'white',position:'relative',top:'5rem',zIndex:'10',borderRadius:'1rem',padding:'0.5rem',left:'1rem'}}>
                            CLOSE
                        </button>
                        <NutritionImpactAnalyzer 
                            foodType={selectedItem.foodType} 
                            quantity={selectedItem.quantity} 
                        />
                    </div>
                
            )}
        </>
    );
}

export default Inventory;
