import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeLink_n = () => {
  const navigate = useNavigate();

  return (
    <div className="text-gray-800 z-5" style={{ marginTop: '5rem' }}>
      {/* Hero Section */}
      <section className="py-8 bg-white shadow-sm rounded-lg z-5 flex justify-around w-full">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center w-full">
            <div className="w-full md:w-61/100">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-blue-600">
                Welcome to NourishNet, NGO Partner!
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                NourishNet connects you with donors to receive essential food resources, allowing you to focus on what matters most: feeding those in need. Manage incoming donations, track volunteer pickups, and create a larger impact in your community.
              </p>
              <a
                className="bg-blue-500 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600"
                onClick={() => navigate('/home_n/manageDonations')}
              >
                Manage Donations
              </a>
            </div>
            <div className="w-full md:w-1/2">
              <img
                style={{ width: '70vh' }}
                src="https://cdn.gencraft.com/prod/user/32a67b65-7ed4-47b0-9817-fc91fcfa35be/3a299197-4304-4802-98cc-2d5b5a7f062e/image/image1_0.jpg?Expires=1727609226&Signature=Opf80ITtFk51xz-ICUn1zU6scJG80OMKjxrxDTjfRBmS2VLLb0IT0AQfrZyIq3XtUZjHzDQ7rpL5ze9jeB6CZol9~zDpfQ-8CtV9yQGAG5Vv8BRRO6A9VbaMMixJDP9HRg7QUc6Uw3ON~Gl2Ca4-M4PzN0tVm1jGiPtlNkQ9UdkfLKsyOoqcfDK8K-2vgTrOHf22Wm1P1zOBQHVkxUS6L4W2xir8N8Ds3LXanAtf7HCVbW8AiQR1O3f0iRVhs1oFL74HbIdibzrPXXyMUDcHMAizkAwSC9FQMyIpBqOPDglpE3m9rlGDaGq0q8QRUExqVpCLOeGceMiIInFxPPzIkQ__&Key-Pair-Id=K3RDDB1TZ8BHT8"
                alt="NGO managing food distribution"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How NourishNet Helps NGOs */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
            How NourishNet Supports Your Mission
          </h2>
          <p className="text-gray-600 mb-8">
            NourishNet provides tools and resources for NGOs to streamline the donation process, track volunteers, and expand their reach. Partner with us to create a network of support for your community.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Manage Donations */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <img
                src="https://img.freepik.com/premium-photo/group-young-volunteers-organizing-donations-their-office_342744-2054.jpg"
                alt="Manage Donations"
                className="w-full h-48 object-cover mb-4 rounded-md"
              />
              <h3 className="text-xl font-semibold mb-2">Manage Donations</h3>
              <p className="text-gray-600">
                Easily manage and approve incoming donations. Monitor the food items and quantities you’ll receive, and ensure a smooth handover from donors.
              </p>
            </div>

            {/* Card 2: Track Volunteer Activity */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <img
                src="https://image.shutterstock.com/image-photo/volunteers-distributing-food-among-poor-260nw-1636743890.jpg"
                alt="Track Volunteer Activity"
                className="w-full h-48 object-cover mb-4 rounded-md"
              />
              <h3 className="text-xl font-semibold mb-2">Track Volunteer Activity</h3>
              <p className="text-gray-600">
                Stay informed about volunteer pickups and deliveries in real-time. Coordinate seamlessly to ensure timely distribution to those in need.
              </p>
            </div>

            {/* Card 3: Monitor Impact */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <img
                src="https://img.freepik.com/premium-photo/portrait-happy-young-woman-pointing-up_74952-2026.jpg"
                alt="Monitor Impact"
                className="w-full h-48 object-cover mb-4 rounded-md"
              />
              <h3 className="text-xl font-semibold mb-2">Monitor Impact</h3>
              <p className="text-gray-600">
                View detailed reports and statistics on the impact of your operations. Highlight success stories and demonstrate the difference you’re making.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
            Ready to Make a Bigger Impact?
          </h2>
          <p className="text-gray-600 mb-8">
            Maximize your reach with NourishNet’s tools and support. Manage donations, coordinate volunteers, and ensure food reaches those who need it most.
          </p>
          <a
            className="bg-blue-500 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600"
            onClick={() => navigate('/home_n/impactReports')}
          >
            View Impact Reports
          </a>
        </div>
      </section>
    </div>
  );
};

export default HomeLink_n;
