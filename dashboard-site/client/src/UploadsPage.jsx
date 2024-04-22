import React, { useState, useEffect, useRef } from 'react';
import Navbar from "./components/Navbar";

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showWorkingMessage, setShowWorkingMessage] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setShowConfirmation(true);
    }
  };

  const handleConfirmUpload = (documentName, sourceLocation) => {
    if (selectedFile) {
      setShowConfirmation(false);//so they cant spam the uplaod button
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('documentName',documentName);
      formData.append('sourceLocation',sourceLocation)
      setShowWorkingMessage(true)
  
      fetch('http://localhost:5050/document', {
        method: 'POST',
        body: formData,
      })
      .then(response => {
        if (response.ok) {
          setShowWorkingMessage(false)
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 2000);
        } else {
          setShowWorkingMessage(false)
          throw new Error('Failed to upload file');
        }
      })
      .catch(error => console.error('Error:', error))
      .finally(() => {
        setShowWorkingMessage(false)
        setSelectedFile(null);
       // setShowConfirmation(false);
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
    <div className="bg-gray-800 min-h-screen">
      <Navbar />
      <div className="bg-gray-800">
                {/* Uploads Box */}
                <div className="p-6 w-96 bg-gray-300 rounded-lg">
          <h3 className="font-semibold text-lg">Uploading Documents</h3>
          <h2 className="text-lg">
            Please provide URL to source.<br></br>
            All docs will be quoted by the bot.<br></br>
            Accepted Formats .txt, .pdf, .csv <br></br>
            Document name is for user convenience.<br></br>

        </h2>
        </div>
      <div className="flex justify-center items-center mx-4 space-x-4">
        
        <div className="justify-center items-center">
          <input
            type="file"
            accept=".pdf,.txt,.csv"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
          {!showConfirmation && !showWorkingMessage && !showSuccessMessage && (
          <button className="bg-blue-500 justify-center items-center text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={triggerFileInput}>
            Select File
          </button>
    )}
            {showConfirmation && (
          <div className="confirmation-box border border-gray-300 rounded-md bg-white shadow-md p-4">
            <div className="mb-4">
              <p className="text-lg font-semibold">Selected File:</p>
              <p className="text-gray-600">{selectedFile.name}</p>
            </div>
            <div className="mb-4">
              <label htmlFor="documentName" className="block text-sm font-medium text-gray-700">Document Name:</label>
              <input type="text" id="documentName" name="documentName" className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
            </div>
            <div className="mb-4">
              <label htmlFor="sourceLocation" className="block text-sm font-medium text-gray-700">Source Location:</label>
              <input type="text" id="sourceLocation" name="sourceLocation" className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
            </div>
            <div className="flex justify-between">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={() => handleConfirmUpload(document.getElementById('documentName').value, document.getElementById('sourceLocation').value)}>Upload</button>
              <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400" onClick={handleCancelUpload}>Cancel</button>
            </div>
          </div>
          )}
          {/* working message */}
          {showWorkingMessage && (
            <div className="bg-green-200 text-green-800 px-4 py-2 rounded-md mt-4">
              Currently Processing!
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
    </div>
  );
};

export default UploadFile;
