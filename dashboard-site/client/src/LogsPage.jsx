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
    setTimeout(() => fetchMongoDBLogs(), 10000);        //SETTIMEOUT FUNCTION HERE FOR AUTO FETCHING LOGS
  };

  const isBadFeedback = (feedback) => {
    return feedback === 'Bad';
  };

  return (
    <div className="w-full p-6">
      <Navbar />
      <div className="flex justify-center items-center mx-4 space-x-4">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Question</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Answer</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Sources</th>
                <button onClick={fetchMongoDBLogs} className="text-white bg-red-500 hover:bg-red-700 font-medium py-1 px-0.5 rounded inline-flex items-center">
                  Refresh Logs
                </button>
              </tr>
            </thead>
            <tbody>
              {mongoData.map((log, index) => (
                <tr key={index} className={isBadFeedback(log.feedback) ? 'bg-red-200' : 'bg-green-200'}>
                  <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900 border border-gray-300">
                    {log.question}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900 border border-gray-300">
                    {log.Answer}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900 border border-gray-300">
                    {log.feedback}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900 border border-gray-300">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900 border border-gray-300">
                    {log.sources}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LOGS;
