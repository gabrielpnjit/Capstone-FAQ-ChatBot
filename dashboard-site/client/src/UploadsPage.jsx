import React, { useState, useEffect, useRef } from 'react';
import Navbar from "./components/Navbar";

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setShowConfirmation(true);
    }
  };

  const handleConfirmUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      fetch('http://localhost:5050/document', {
        method: 'POST',
        body: formData,
      })
      .then(response => {
        if (response.ok) {
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 3000);
        } else {
          throw new Error('Failed to upload file');
        }
      })
      .catch(error => console.error('Error:', error))
      .finally(() => {
        setSelectedFile(null);
        setShowConfirmation(false);
      });
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setShowConfirmation(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full p-6">
      <Navbar />
      <div className="flex justify-center items-center mx-4 space-x-4">
        <div className="overflow-x-auto">
          <input
            type="file"
            accept=".pdf,.txt,.csv"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
          <button className="bg-grey text-black inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-input hover:bg-slate-200 h-9 rounded-md px-3"
          onClick={triggerFileInput}>Select File</button>

          {/* Confirmation box */}
          {showConfirmation && (
            <div className="confirmation-box border border-gray-300 rounded-md bg-white shadow-md p-4">
              <div className="mb-4">
                <p className="text-lg font-semibold">Selected File:</p>
                <p className="text-gray-600">{selectedFile.name}</p>
              </div>
              <div className="flex justify-between">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={handleConfirmUpload}>Upload</button>
                <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                onClick={handleCancelUpload}>Cancel</button>
              </div>
            </div>
          )}

          {/* Success message */}
          {showSuccessMessage && (
            <div className="bg-green-200 text-green-800 px-4 py-2 rounded-md mt-4">
              File uploaded successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
