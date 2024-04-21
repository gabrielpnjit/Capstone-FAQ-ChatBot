import React, { useState, useEffect } from 'react';
import Navbar from "./components/Navbar";

const MongoFiles = () => {
  const [mongoData, setMongoData] = useState([]);

  useEffect(() => {
    fetchMongoDBFiles();
  }, []);

  const fetchMongoDBFiles = async () => {
    try {
      const response = await fetch('http://localhost:5050/document/viewFiles', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data from MongoDB');
      }
      const files = await response.json();
      setMongoData(files);
    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);
    }
  };

  const deleteFile = async (fileId) => {
    try {
      const confirmed = window.confirm('Are you sure you want to delete all files?');
      if (!confirmed) return;
      const response = await fetch(`http://localhost:5050/document/delete/${fileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      // Remove the deleted file from the state
      setMongoData(mongoData.filter(file => file._id !== fileId));// Basically refreshes without running a GET
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };
  const deleteAll = async (fileId) => {
    try {
      const confirmed = window.confirm('Are you sure you want to delete all files?');
      if (!confirmed) return;
      const response = await fetch(`http://localhost:5050/document/deleteAll`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      // Remove the deleted file from the state
      setMongoData(mongoData.filter(file => file._id !== fileId));// Basically refreshes without running a GET
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    <div className="w-full p-6">
      <Navbar />
      <div className="flex justify-center items-center mx-4 space-x-4">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Filename</th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Content</th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Source</th>
              <th className="px-6 py-3 bg-gray-50 text-right">
              <button onClick={() => deleteAll()} className="text-red-500 hover:text-red-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4 a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {mongoData.map((file, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{file.filename}</td>
                <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{file.content.slice(0, 400)}</td>
                <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{file.source}</td>
                <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-center">
                  <button onClick={() => deleteFile(file._id)} className="text-red-500 hover:text-red-700">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4 a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MongoFiles;
