import React from 'react';

const History_v = () => {
  const deliveries = [
    {
      id: 1,
      items: 'Bread',
      date: '30 September',
      time: '12:00 AM',
      ngo: 'XYZ Hotel'
    },
    {
      id: 2,
      items: 'Milk',
      date: '1 October',
      time: '2:00 PM',
      ngo: 'ABC Store'
    },
    {
      id: 3,
      items: 'Vegetables and Fruits',
      date: '2 October',
      time: '1:30 PM',
      ngo: 'Healthy Community NGO'
    },
    // Add more deliveries here
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Delivery History</h1>

      <div className="space-y-4">
        {deliveries.map((delivery) => (
          <div key={delivery.id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
            <div className="flex-grow">
              <p className="text-lg font-semibold text-gray-700">
                {delivery.items} delivered to {delivery.ngo}
              </p>
              <p className="text-sm text-gray-500">
                {delivery.time} on {delivery.date}
              </p>
            </div>
            <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History_v;
