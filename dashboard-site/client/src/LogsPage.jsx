import React, { useState, useEffect } from 'react';
import Navbar from "./components/Navbar";

const LOGS = () => {
  const [mongoData, setMongoData] = useState([]);
  const [filterMode, setFilterMode] = useState('all');

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
    setTimeout(fetchMongoDBLogs, 10000); // SETTIMEOUT FUNCTION HERE FOR AUTO FETCHING LOGS
  };
  const deleteAllLogs = async () => {
    try {
      const confirmed = window.confirm('Are you sure you want to delete all Logs?');
      if (!confirmed) return;
      const response = await fetch(`http://localhost:5050/document/deleteAllLogs`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };
  const deleteFile = async (fileId) => {
    try {
      const response = await fetch(`http://localhost:5050/document/delete/${fileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete');
      }
        } catch (error) {
      console.error('Error deleting: ', error);
    }
  };

  const filterLogs = (log) => {
    if (filterMode === 'all') {
      return true;
    } else if (filterMode === 'bad') {
      return log.feedback === 'Bad';
    } else if (filterMode === 'good') {
      return log.feedback === 'Good';
    }
    return false;
  };

  const toggleFilterMode = () => {
    switch (filterMode) {
      case 'all':
        setFilterMode('bad');
        break;
      case 'bad':
        setFilterMode('good');
        break;
      case 'good':
        setFilterMode('all');
        break;
      default:
        setFilterMode('all');
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen">
      <Navbar />
      <div className="bg-gray-800">
        <div className="flex justify-center mt-4">
          <button onClick={toggleFilterMode} className="text-white bg-gray-600 hover:bg-gray-700 font-medium py-2 px-4 rounded inline-flex items-center">
            {filterMode === 'all' ? 'Swap to Bad Logs' : (filterMode === 'bad' ? 'Swap to Good Logs' : 'Swap to All Logs')}
          </button>
        </div>
        <div className="flex pt-6 justify-center items-center mx-4 space-x-4">
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full border-collapse rounded-lg">
              <thead>

                <tr>
                  <th className="px-1 py-1 pl-4 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-1 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Question</th>
                  <th className="px-6 py-1 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Answer</th>
                  <th className="px-2 py-1 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                  <th className="px-1 py-1 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-1 py-1 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Message Link</th>
                  <th className="px-1 py-1 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Sources</th>
                  <th className="px-1 py-1 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"> 
                  <button onClick={() => deleteAllLogs()} className="text-red-500 hover:text-red-700 flex items-center justify-center bg-slate-400 h-11 rounded-md px-3 text-sm">
                    <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4 a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    PURGE ALL
                  </button>
              </th>
                </tr>
              </thead>
              <tbody>
                {mongoData.filter(filterLogs).map((log, index) => (
                  <tr key={index} className={log.feedback === 'Bad' ? 'bg-red-200' : (log.feedback === 'Good' ? 'bg-green-200' : 'bg-gray-200')}>
                    <td className="px-1 py-2 whitespace-no-wrap text-sm leading-5 text-gray-900 border border-gray-300">{log.questionId}</td>
                    <td className="px-6 py-2 whitespace-pre-wrap text-sm leading-5 text-gray-900 border border-gray-300 overflow-hidden">{log.question}</td>
                    <td className="px-6 py-2 whitespace-pre-wrap text-sm leading-5 text-gray-900 border border-gray-300 overflow-hidden">{log.answer}</td>
                    <td className="px-2 py-2 whitespace-no-wrap text-sm leading-5 text-gray-900 border border-gray-300">{log.feedback}</td>
                    <td className="px-1 py-2 whitespace-no-wrap text-sm leading-5 text-gray-900 border border-gray-300">{log.timestamp.slice(0, 24)}</td>
                    <td className="px-1 py-2 whitespace-no-wrap text-sm leading-5 text-gray-900 border border-gray-300">
                      <a href={log.messageLink} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 text-center text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring cursor-pointer">View</a>
                    </td>
                    <td className="px-1 py-2 whitespace-no-wrap text-sm leading-5 text-gray-900 border border-gray-300">
                    {log.sources.map((source, sourceIndex) => {
                    const trimmedSource=source.slice(1,-2);
                    const parts=trimmedSource.split("](<")
                    const sourceName = parts[0];
                    const sourceLink = parts[1];
                    return(    
                        <span key={sourceIndex}>
                      <a href={sourceLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{sourceName}</a>
                      {sourceIndex !== log.sources.length - 1 && ', '}
                    </span>
                  );
                 
                 })}
                    </td>
                    <td>
                    { 
                  <button onClick={() => deleteFile(log._id)} className="text-red-500 hover:text-red-700 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4 a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    <span className="text-xs">Delete Entry</span>
                  </button>
                  }
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LOGS;
