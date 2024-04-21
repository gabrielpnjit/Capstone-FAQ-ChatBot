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
      console.log(logs);
      setMongoData(logs);
    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);
    }
    setTimeout(() => fetchMongoDBLogs(), 10000);        //SETTIMEOUT FUNCTION HERE FOR AUTO FETCHING LOGS
  };

  const isBadFeedback = (feedback) => {
    return feedback === 'Bad';
  };

  return (<div className="w-full p-6">
  <Navbar />
  <div className="flex justify-center items-center mx-4 space-x-4">
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <button onClick={fetchMongoDBLogs} className="text-white bg-red-500 hover:bg-red-700 font-medium py-1 px-0.5 rounded inline-flex items-center">
            Refresh Logs
          </button>
          <tr>
            <th className="px-1 py-1 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-1 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Question</th>
            <th className="px-6 py-1 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Answer</th>
            <th className="px-2 py-1 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
            <th className="px-1 py-1 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Time</th>
            <th className="px-1 py-1 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Message Link</th>
            <th className="px-1 py-1 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Sources</th>
          </tr>
        </thead>
        <tbody>
          {mongoData.map((log, index) => (
            <tr key={index} className={isBadFeedback(log.feedback) ? 'bg-red-200' : 'bg-green-200'}>
              <td className="px-1 py-2 whitespace-no-wrap text-xs leading-5 text-gray-900 border border-gray-300">
                {log.questionId}
              </td>
              <td className="px-6 py-2 whitespace-pre-wrap text-xs leading-5 text-gray-900 border border-gray-300 overflow-hidden">
                {log.question}
              </td>
              <td className="px-6 py-2 whitespace-pre-wrap text-xs leading-5 text-gray-900 border border-gray-300 overflow-hidden">
                {log.answer}
              </td>
              <td className="px-2 py-2 whitespace-no-wrap text-xs leading-5 text-gray-900 border border-gray-300 overflow-hidden">
                {log.feedback}
              </td>
              <td className="px-1 py-2 whitespace-no-wrap text-xs leading-5 text-gray-900 border border-gray-300">
                {log.timestamp.slice(0, 24)}
              </td>
              <td className="px-1 py-2 whitespace-no-wrap text-xs leading-5 text-gray-900 border border-gray-300">
                <a href={log.messageLink} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 text-center text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring cursor-pointer">
                  View
                </a>
              </td>
              <td className="px-1 py-2 whitespace-no-wrap text-xs leading-5 text-gray-900 border border-gray-300">
                {log.sources}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>
  )}

export default LOGS;
