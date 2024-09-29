import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../../../firebase';
import { doc, getDoc, updateDoc, setDoc, collection } from 'firebase/firestore';

const CurrentPickup_v = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const task = location.state?.task;

  const [isPickupDone, setIsPickupDone] = useState(task?.isPickupDone || false);
  const [isQualityChecked, setIsQualityChecked] = useState(task?.isQualityChecked || false);
  const [isDeliveredToNgo, setIsDeliveredToNgo] = useState(task?.isDeliveredToNgo || false);
  const [isDeliveryDone, setIsDeliveryDone] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      if (!task) return;

      try {
        const taskDocRef = doc(db, 'tasks', task.id);
        const taskDoc = await getDoc(taskDocRef);
        if (taskDoc.exists()) {
          const taskData = taskDoc.data();
          setIsPickupDone(taskData.isPickupDone || false);
          setIsQualityChecked(taskData.isQualityChecked || false);
          setIsDeliveredToNgo(taskData.isDeliveredToNgo || false);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching task: ', error);
      }
    };

    fetchTask();
  }, [task]);

  useEffect(() => {
    if (isDeliveredToNgo) {
      console.log('isDeliveredToNgo is true, handling donation and volunteer history');
      updateTaskStatus();
    }
  }, [isDeliveredToNgo]);

  const updateTaskStatus = async () => {
    if (!task) return;

    try {
      const taskDocRef = doc(db, 'tasks', task.id);
      await updateDoc(taskDocRef, {
        isPickupDone,
        isQualityChecked,
        isDeliveredToNgo,
        isDeliveryDone,
        taskType: 'Completed',
      });
      console.log('Task updated successfully');

      if (isDeliveredToNgo) {
        await handleDonationHistory(task.id);
        await handleVolunteerHistory(task);
        await updateVolunteerWorkStatus(task.volunteerId);
      }
    } catch (error) {
      console.error('Error updating task: ', error);
    }
  };

  const handleDonationHistory = async (taskId) => {
    try {
      const taskDocRef = doc(db, 'tasks', taskId);
      const taskDoc = await getDoc(taskDocRef);

      if (taskDoc.exists()) {
        const taskData = taskDoc.data();
        const donationId = taskData.donationId;
        console.log(taskData);

        if (donationId) {
          const donationDocRef = doc(db, 'donations', donationId);
          const donationDoc = await getDoc(donationDocRef);

          if (donationDoc.exists()) {
            const donationData = donationDoc.data();
            await insertDonationHistory(donationData, taskData);
            await addToInventory(donationData); // Add donation to inventory
          } else {
            console.log('No donation document found for the provided ID!');
          }
        }
      }
    } catch (error) {
      console.error('Error handling donation history: ', error);
    }
  };

  const insertDonationHistory = async (donationData, taskData) => {
    const historyRef = collection(db, 'history');
    const id = randomAlphaNumeric(10);
    const historyDoc = doc(historyRef, id);

    try {
      await setDoc(historyDoc, {
        taskId: taskData.taskId,
        donationId: donationData.donationid,
        donor_name: donationData.donor_name,
        donation_type: donationData.FoodType,
        donation_quantity: donationData.quantity,
        deliveredTo: donationData.ngoAssigned_name,
        ngoid: donationData.ngoAssigned,
        status: 'Completed',
        timestamp: new Date(),
      });
      console.log('Donation history updated successfully');
    } catch (error) {
      console.error('Error updating donation history: ', error);
    }
  };

  const handleVolunteerHistory = async (taskData) => {
    const volunteerHistoryRef = collection(db, 'volunteerHistory');
    const volunteerHistoryId = randomAlphaNumeric(10);
    const volunteerHistoryDoc = doc(volunteerHistoryRef, volunteerHistoryId);

    try {
      await setDoc(volunteerHistoryDoc, {
        taskId: taskData.taskId,
        donorId: taskData.donationId,
        taskNeed: taskData.taskNeed,
        taskType: 'Completed',
        volunteerId: taskData.volunteerId,
        volunteerName: taskData.volunteerName,
        taskLocation: taskData.location,
        timestamp: new Date(),
      });
      console.log('Volunteer history updated successfully');
    } catch (error) {
      console.error('Error updating volunteer history: ', error);
    }
  };

  const updateVolunteerWorkStatus = async (volunteerId) => {
    if (!volunteerId) return;

    const volunteerDocRef = doc(db, 'users', volunteerId);

    try {
      await updateDoc(volunteerDocRef, {
        work_status: 'free',
      });
      console.log('Volunteer work status updated successfully');
    } catch (error) {
      console.error('Error updating volunteer work status: ', error);
    }
  };

  // Function to add donation to the Inventory collection
  const addToInventory = async (donationData) => {
    const inventoryRef = collection(db, 'inventory');
    const inventoryId = randomAlphaNumeric(10); // Create a random ID for inventory
    const inventoryDoc = doc(inventoryRef, inventoryId);

    try {
      await setDoc(inventoryDoc, {
        id:inventoryId,
        ngoId: donationData.ngoAssigned,
        ngoName: donationData.ngoAssigned_name,
        FoodType: donationData.FoodType,
        Quantity: donationData.quantity,
        ExpiryDate: donationData.expiry, // Add the ExpiryDate from donationData
        Distribute: 'Not Distributed', 
        QualityCheck:"pending"// Initial status of distribution
      });
      console.log('Donation added to inventory successfully');
    } catch (error) {
      console.error('Error adding to inventory: ', error);
    }
  };

  const randomAlphaNumeric = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handlePickupDoneChange = () => setIsPickupDone((prev) => !prev);
  const handleQualityCheckedChange = () => setIsQualityChecked((prev) => !prev);
  const handleDeliveredToNgoChange = () => setIsDeliveredToNgo((prev) => !prev);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Current Pickup</h1>
      {task ? (
        <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <div className="flex items-center">
            <input type="checkbox" checked={isPickupDone} onChange={handlePickupDoneChange} disabled={isPickupDone} />
            <label className={`ml-2 ${isPickupDone ? 'line-through text-gray-400' : ''}`}>Pickup Done</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" checked={isQualityChecked} onChange={handleQualityCheckedChange} disabled={isQualityChecked || !isPickupDone} />
            <label className={`ml-2 ${isQualityChecked ? 'line-through text-gray-400' : ''}`}>Initial Quality and Packaging Check</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" checked={isDeliveredToNgo} onChange={handleDeliveredToNgoChange} disabled={isDeliveredToNgo || !isQualityChecked} />
            <label className={`ml-2 ${isDeliveredToNgo ? 'line-through text-gray-400' : ''}`}>Delivered to NGO</label>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Loading task...</p>
      )}
    </div>
  );
};

export default CurrentPickup_v;
