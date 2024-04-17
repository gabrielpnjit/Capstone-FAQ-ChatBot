import React, { useState, useEffect } from 'react';
import Navbar from "./components/Navbar";

const LOGS = () => {
  const [mongoData, setMongoData] = useState([]);

  useEffect(() => {
    fetchMongoDBLogs();
  }, []);

  const fetchMongoDBLogs = async () => {
    try {
      const response = await fetch('http://localhost:5050/document/viewLogs', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data from MongoDB');
      }

      const logs = await response.json();
      setMongoData(logs);
    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);
    }
  };

  return (
    <div className="w-full p-6">
      <Navbar />
      <div className="flex justify-center items-center mx-4 space-x-4">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Question</th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Answer</th>
            </tr>
          </thead>
          <tbody>
            {mongoData.map((log, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{log.question}</td>
                <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{log.Answer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LOGS;
