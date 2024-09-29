import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase'; // Ensure you have your Firebase configuration set up correctly
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

const ClaimedVolunteers = () => {
  const [volunteerData, setVolunteerData] = useState([]);
  const [donorId, setDonorId] = useState(null);

  useEffect(() => {
    // Step 1: Retrieve `userData` from local storage and extract `donorId`
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.uid) {
      setDonorId(userData.uid);
    }
  }, []);

  useEffect(() => {
    if (!donorId) return; // Don't fetch data until donorId is set

    const fetchDonationAndTasks = async () => {
      try {
        
        // Step 2: Fetch the donation document using the donorId
        const donationQuery = query(collection(db, 'donations'), where('donorid', '==', donorId));
        const donationSnapshot = await getDocs(donationQuery);
        console.log(donationSnapshot.docs[0].data());

        if (donationSnapshot!=null) {
          // Assuming there's only one donation record for this donorId
          const donationDoc = donationSnapshot.docs[0];
          const donationData = donationDoc.data();
          console.log(donationData);
          const donationId = donationData.donationid;
          console.log(donationId) // This is the donationId to be used in the tasks collection;

          // Step 3: Fetch all tasks where donationid matches the specific donationId
          const tasksQuery = query(collection(db, 'tasks'), 
          where('donationId', '==', donationId), 
          where('taskType', '==', 'In-Progress'));
          const tasksSnapshot = await getDocs(tasksQuery);

          console.log(tasksSnapshot.docs[0].data());

          // Step 4: Map through each task to form the desired data structure
          const taskDetails = tasksSnapshot.docs.map((taskDoc) => ({
            id: taskDoc.id, // Task ID
            volunteer: taskDoc.data().volunteerName || 'N/A',
            ngo: donationData.ngoAssigned_name || 'Unknown NGO',
            foodType: donationData.FoodType || 'N/A',
            description: donationData.description || 'No description available',
            status: taskDoc.data().taskType,
          }));

          setVolunteerData(taskDetails);
        } else {
          console.log('No donation record found for the specified donorId.');
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchDonationAndTasks();
  }, [donorId]);

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6" style={{marginTop:'5rem'}}>
      {volunteerData.length === 0 ? (
        <div className="col-span-2 text-center text-gray-600">Loading data or no tasks in-progress...</div>
      ) : (
        volunteerData.map((volunteer) => (
          <div
            key={volunteer.id}
            className="p-6 bg-white rounded-xl shadow-lg space-y-6 mx-4 my-4 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1"
          >
            {/* Top Section */}
            <div className="flex justify-between items-center">
              <div className="text-green-700 font-bold text-xl">
                Volunteer: {volunteer.volunteer}
              </div>
              <div className="bg-blue-100 text-blue-600 font-semibold py-1 px-3 rounded-md text-sm">
                NGO: {volunteer.ngo}
              </div>
            </div>

            {/* Middle Section */}
            <div className="text-lg text-gray-600">
              <span className="font-semibold">Food Type: </span>
              {volunteer.foodType}
            </div>

            <div className="text-gray-600">
              <span className="font-semibold">Description: </span>
              {volunteer.description}
            </div>

            {/* Bottom Section */}
            <div className="flex justify-between items-center">
              <div className="text-gray-500 font-medium">
                <i className="fas fa-info-circle mr-1"></i> Status: <span className={volunteer.status === 'Assigned' ? 'text-blue-600' : 'text-green-600'}>{volunteer.status}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ClaimedVolunteers;
