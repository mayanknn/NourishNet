import React, { useState } from 'react';
import History_d_m from './History_d_m';
import History_d_f from './History_d_f';
import { MdPadding } from 'react-icons/md';

function History_d() {
  const [cash,setCash] = useState(false);
  const handleChange = () =>{
    setCash(!cash);
  }
  return (
    
    <>
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">History</h1>

      {/* Tailwind CSS button styling */}
      <button
        onClick={handleChange}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Change
      </button>

      {/* Render different components based on 'cash' value */}
      {cash ? <History_d_m /> : <History_d_f />}
    </div>
    </>
  );
}
export default History_d;