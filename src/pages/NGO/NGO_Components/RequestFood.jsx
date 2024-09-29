import React, { useEffect } from 'react';

const RequestFood = () => {
    useEffect(() => {
        console.log("RequestFood mounted");
        // Fetch donation data...
    }, []);
    
    return (
        <div className="flex h-screen">
            <div className="w-1/2 bg-cover" style={{ backgroundImage: "url('https://placehold.co/600x800?text=Food+Background')" }}>
                <div className="flex items-center justify-center h-full bg-black bg-opacity-40">
                    <h1 className="text-white font-bold text-4xl">NourishNet</h1>
                </div>
            </div>
            <div className="w-1/2 flex items-center justify-center bg-green-100">
                <div className="w-2/3 bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Request Food</h2>
                    <input 
                        type="text" 
                        placeholder="Food Type (Name)" 
                        className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    <input 
                        type="number" 
                        placeholder="Quantity Needed" 
                        className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    <button 
                        className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold py-2 px-4 rounded-full hover:bg-gradient-to-l"
                        type="button"
                    >
                        Submit Request
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RequestFood;
