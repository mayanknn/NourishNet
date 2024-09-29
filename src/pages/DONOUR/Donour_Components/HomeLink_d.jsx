import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeLink_d = () => {
  const navigate=useNavigate();
  return (
    <div className="text-gray-800 z-5" style={{marginTop:'5rem'}}>
      <section className="py-8 bg-white shadow-sm rounded-lg z-5 flex justify-around w-full">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="flex flex-col md:flex-row items-center w-full">
            <div className="w-full md:w-61/100">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-green-600">
                Welcome to NourishNet, Donor!
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Your contributions help provide essential food resources to those in need. Together, we can reduce food waste and fight hunger. Explore opportunities to donate, check your donation history, and learn more about how your contributions make a difference.
              </p>
              <a className="bg-green-500 text-white px-6 py-3 rounded-full font-medium hover:bg-green-600" onClick={()=>navigate('/home_d/postDonation_d')}>
                Donate Now
              </a>
            </div>
            <div className="w-full md:w-1/2">
              <img style={{ width: '70vh' }} src="https://cdn.gencraft.com/prod/user/f001fc9e-9a16-4881-839d-2287c3015825/73250d10-7907-4b04-8b3b-c2a638c4df5b/image/image1_0.jpg?Expires=1727609226&Signature=HH-Nw0sz9tDkhX8NmWOh0F2xjmsrV82Lojfix1~xAkT5xEJnmrIfvrRXXoLWSe8Mev-I-bXILuTneVPw6glmodgu6YUtC0-EAy0BHmYm9rYbtfvgoYg4yOF0kHDs-yVZhEpkeUoQBwqfxaQ~STOJLEyDSydfmEdUnqIKDa~YWnc7Y1x3F-wxAtPSwJjm6DMQXK7rL~VEEcoSLKh6vOj-3sxta26npR6daOGqhsSMKHWHBZ-22bvsTzNwRyRobOzJ4ruIH3abbui81Eblr~L9PuUR33lNSEWOxNl3Y-~eCN2WYP9uaLYMqP-US2i6uITzAPCiB8151R4kawceshkNEg__&Key-Pair-Id=K3RDDB1TZ8BHT8" alt="Helping hands with food donation" className="rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* How Donations Help */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
            How Your Donations Make a Difference
          </h2>
          <p className="text-gray-600 mb-8">
            Every donation contributes to feeding vulnerable communities. Whether it’s surplus food or a financial contribution, your generosity has a tangible impact. Our mission is to provide healthy meals and essential supplies to people in need.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <img src="https://media.istockphoto.com/id/1224414210/vector/food-donation-and-charity.jpg?s=612x612&w=0&k=20&c=Zwz7H7M1-8d23Zpgz127eAaypBznKeGm05dXe80WzHs=" alt="Food Donation" className="w-full h-48 object-cover mb-4 rounded-md" />
              <h3 className="text-xl font-semibold mb-2">Food Donation</h3>
              <p className="text-gray-600">
                Donate surplus food that can be redistributed to those in need. Help us reduce food waste and provide nourishing meals.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <img src="https://c8.alamy.com/comp/W3WW2F/donation-box-with-money-W3WW2F.jpg" alt="Monetary Donation" className="w-full h-48 object-cover mb-4 rounded-md" />
              <h3 className="text-xl font-semibold mb-2">Monetary Donation</h3>
              <p className="text-gray-600">
                Your financial support helps us in distributing food, managing logistics, and expanding our outreach to underserved communities.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzx-k4JT146ymTRVaUBCwRJGHMdzLl_IFy_g&s" alt="Volunteer Support" className="w-full h-48 object-cover mb-4 rounded-md" />
              <h3 className="text-xl font-semibold mb-2">Volunteer Support</h3>
              <p className="text-gray-600">
                Not just food or money—your time is valuable! Join us as a volunteer and help with food distribution and community outreach programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
            Ready to Make a Difference?
          </h2>
          <p className="text-gray-600 mb-8">
            Take the next step in fighting food waste and hunger. Choose how you’d like to contribute and be a part of the change.
          </p>
          
        </div>
      </section>
    </div>
  );
};

export default HomeLink_d;
