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

  return (
    <div className="w-full p-6">
      <Navbar />
      <div className="flex justify-center items-center mx-4 space-x-4">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">filename</th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">content</th>
              <th className="px-6 py-3 bg-gray-50"></th> {/* Empty header for delete button */}
            </tr>
          </thead>
          <tbody>
            {mongoData.map((files, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{files.filename}</td>
                <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{files.content.slice(0, 400)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MongoFiles;
