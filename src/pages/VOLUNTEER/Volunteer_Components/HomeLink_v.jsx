import React from 'react';

const HomeLink_v = () => {
  return (
    <div className="text-gray-800 z-5">
      <section className="py-8 bg-white shadow-sm rounded-lg z-5">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-green-600">
                Welcome to NourishNet, Volunteer!
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Your efforts in collecting and redistributing food play a crucial role in addressing hunger and reducing food waste. From picking up donations to delivering meals to those in need, you make a real impact.
              </p>
              <a href="#manage-tasks" className="bg-green-500 text-white px-6 py-3 rounded-full font-medium hover:bg-green-600">
                Manage Tasks
              </a>
            </div>
            <div className="w-full md:w-1/2">
              <img src="https://via.placeholder.com/600x400" alt="Volunteer delivering food" className="rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Task Breakdown */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
            Your Responsibilities as a Volunteer
          </h2>
          <p className="text-gray-600 mb-8">
            As a volunteer, you ensure safe and timely delivery of donations, maintaining food quality and redistributing it to communities in need. Here's a breakdown of your tasks:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Pickup from Donor */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <img src="https://via.placeholder.com/300x200" alt="Pickup from Donor" className="w-full h-48 object-cover mb-4 rounded-md" />
              <h3 className="text-xl font-semibold mb-2">Pickup from Donor</h3>
              <p className="text-gray-600">
                Collect food donations from registered donors, ensuring that the packaging is intact and the quality meets safety standards right after pickup.
              </p>
            </div>

            {/* Card 2: Deliver to NGO */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <img src="https://via.placeholder.com/300x200" alt="Deliver to NGO" className="w-full h-48 object-cover mb-4 rounded-md" />
              <h3 className="text-xl font-semibold mb-2">Deliver to NGO</h3>
              <p className="text-gray-600">
                Transport the collected food to nearby NGOs, where it will be stored and prepared for redistribution to those in need.
              </p>
            </div>

            {/* Card 3: Redistribution */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <img src="https://via.placeholder.com/300x200" alt="Redistribute Food" className="w-full h-48 object-cover mb-4 rounded-md" />
              <h3 className="text-xl font-semibold mb-2">Redistribute Food</h3>
              <p className="text-gray-600">
                After NGO processing, collect the food and redistribute it to underserved communities, ensuring every meal is delivered with care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
            Ready to Start Volunteering?
          </h2>
          <p className="text-gray-600 mb-8">
            Begin your journey of making a difference by accepting and managing tasks, ensuring the smooth distribution of donations to those who need it most.
          </p>
          <a href="#manage-tasks" className="bg-green-500 text-white px-6 py-3 rounded-full font-medium hover:bg-green-600">
            Get Started
          </a>
        </div>
      </section>
    </div>
  );
};

export default HomeLink_v;
