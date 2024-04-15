import { NavLink } from "react-router-dom";
import React, { useRef } from 'react';

export default function Navbar() {
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
          <NavLink className="text-md text-white hover:text-gray-200 font-medium" to="/checklogs">
            Check logs
          </NavLink>
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
    </div>
  );
}
