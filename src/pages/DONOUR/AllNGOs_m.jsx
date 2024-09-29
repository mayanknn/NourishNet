import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AllNGOs_m = () => {
    // Sample NGO data
    const ngoList = [
        { name: 'Helping Hands' },
        { name: 'Food For All' },
        { name: 'Care Givers' },
        { name: 'We Feed' },
        { name: 'Nurture World' },
        { name: 'Meal Support' },
        { name: 'Food Savior' },
        { name: 'Hunger Relief' },
        { name: 'Aid Access' },
        { name: 'Charity Food' }
    ];

    // State to manage selected NGO
    const [selectedNGO, setSelectedNGO] = useState(null);
    const navigate = useNavigate(); // Initialize navigate

    // Handle NGO selection
    const handleRadioChange = (ngoName) => {
        setSelectedNGO(ngoName);
    };

    // Handle submit button click
    const handleSubmit = () => {
        if (selectedNGO) {
            navigate('/home_d/razorpay_d'); // Navigate to the specified route
        } else {
            alert('Please select an NGO before proceeding.'); // Alert if no NGO is selected
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">NGO List Near Me</h1>
            
            <ul className="space-y-4">
                {ngoList.map((ngo, index) => (
                    <li key={index} className="flex items-center p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition">
                        <label className="flex items-center space-x-3">
                            <input
                                type="radio"
                                className="form-radio h-5 w-5 text-green-500"
                                name="ngo"
                                checked={selectedNGO === ngo.name}
                                onChange={() => handleRadioChange(ngo.name)}
                            />
                            <span className="text-lg font-medium text-gray-800">{ngo.name}</span>
                        </label>
                    </li>
                ))}
            </ul>

            {selectedNGO && (
                <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
                    <strong>You selected:</strong> {selectedNGO}
                </div>
            )}

            <button
                onClick={handleSubmit}
                className="mt-6 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
                Submit
            </button>
        </div>
    );
};

export default AllNGOs_m;
