import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../firebase'; // Adjust the path as needed
import { collection, query, where, getDocs } from 'firebase/firestore';

const ManageTasks_v = () => {
  const navigate = useNavigate();
  const [activeTask, setActiveTask] = useState(null);
  const [inProgressTasks, setInProgressTasks] = useState([]);

  const userData = JSON.parse(localStorage.getItem('userData'));

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksRef = collection(db, 'tasks');
        const tasksQuery = query(
          tasksRef,
          where('volunteerId', '==', userData.uid),
          where('taskType', '==', 'In-Progress')
        );

        const snapshot = await getDocs(tasksQuery);
        const tasksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setInProgressTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      }
    };

    fetchTasks();
  }, [userData.uid]);

  const handlePickup = (task) => {
    setActiveTask(task);
    navigate('/home_v/currentPickup_v', { state: { task } }); // Pass the task object in state
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Your Tasks</h1>
      
      <div className="space-y-6">
        {inProgressTasks.length > 0 ? (
          inProgressTasks.map((task) => (
            <div key={task.id} className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row justify-between items-center">
              <div className="text-left">
                <p className="text-xl font-semibold text-gray-700">{task.taskNeed}</p>
                <p className="text-gray-500">{task.time} on {task.date}</p>
              </div>
              <button 
                onClick={() => handlePickup(task)} 
                className={`mt-4 md:mt-0 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-full transition duration-300 ease-in-out ${activeTask ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={activeTask !== null}
              >
                {activeTask ? 'Going For Pickup' : 'Pickup'}
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No in-progress tasks available.</p>
        )}
      </div>
    </div>
  );
};

export default ManageTasks_v;
