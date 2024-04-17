import { NavLink } from "react-router-dom";
import React, { useRef, useState } from 'react';

export default function Navbar() {
  const [showFilesBox, setShowFilesBox] = useState(false); // State to control visibility of files box
  const [mongoData, setMongoData] = useState([]); // State to store MongoDB files data
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      fetch('http://localhost:5050/document', {  // Replace '/your-upload-endpoint' with your actual upload endpoint
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch(error => console.error('Error:', error));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const toggleFilesBox = () => {
    setShowFilesBox(prevState => !prevState); // Toggle files box visibility
    if (!showFilesBox) {
      fetchMongoDBFiles(); // Fetch MongoDB files when files box is opened, should be modular enough for logs to be  showen later 
    }
  };

  const fetchMongoDBFiles = () => {
    //gonna have to get real data from the database
    const sampleData = [
      { filename: "file1.txt" },
      { filename: "file2.pdf" },
      { filename: "file3.docx" },
    ];
  
    // Set the data up to be displayed
    setMongoData(sampleData);
  };

  return (
    <div>
      <nav className="p-6 rounded-md flex justify-between items-center mb-6 bg-blue-500 ">

        <NavLink to="/" className="text-xl text-white hover:text-gray-200 font-mono" >
          Capstone FAQ Bot Dashboard
        </NavLink>
        <div className="flex items-center space-x-5">
          <NavLink className="text-md text-white hover:text-gray-200 font-medium" to="/about">
            About
          </NavLink>
          <button onClick={toggleFilesBox} className="bg-white text-black inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-input hover:bg-slate-200 h-9 rounded-md px-3">
            Check logs
          </button>
          <button onClick={toggleFilesBox} className="bg-white text-black inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-input hover:bg-slate-200 h-9 rounded-md px-3">
            View Files
          </button>
          <button onClick={triggerFileInput} className="bg-white text-black inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-input hover:bg-slate-200 h-9 rounded-md px-3">
            Upload files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={handleFileSelect}
          />
        </div>
      </nav>
      {showFilesBox && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            {/* Render our files, this showfiles box can be used for logs too */}
            {mongoData.map((file, index) => (
              <div key={index}>
                <p>{file.filename}</p>
              </div>
            ))}
            {/* This will be the close button, rn on topright */}
            <button className="absolute top-4 right-4" onClick={toggleFilesBox}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
