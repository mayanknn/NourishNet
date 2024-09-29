import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase'; // Adjust the import path if necessary

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      try {
        const querySnapshot = await getDocs(usersCollection);
        const userData = [];

        querySnapshot.forEach((doc) => {
          userData.push({ id: doc.id, ...doc.data() });
        });

        setUsers(userData); // Set the fetched users data to state
      } catch (error) {
        setError('Error fetching user data');
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Handle delete user
  const handleDelete = async (userId) => {
    const userDoc = doc(db, 'users', userId);
    try {
      await deleteDoc(userDoc);
      // Update state to remove deleted user
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Users List</h1>
      
      {/* Display Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {/* User List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-4 py-3 text-left text-sm font-semibold">Full Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className={`border-t ${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}`}>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {user.FullName || user.NGO_name || user.Organization_name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{user.Role}</td>
                <td className="px-4 py-3 text-center">
                  <button 
                    onClick={() => handleDelete(user.id)} 
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                  >
                    Ban
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
