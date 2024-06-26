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
      if(sourceLocation&&documentName){
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
    <div className="bg-gray-800 min-h-screen ">
      <Navbar />
      <div className="bg-gray-800 flex pt-20 justify-center items-center h-screen "> 
        <div className="p-6 w-96 bg-gray-300 mb-auto rounded-lg flex flex-col items-center"> 
          <h3 className="font-semibold text-lg mb-4 text-center">Uploading Documents</h3> 
          <h2 className="text-lg text-center">
            Please provide URL to source.<br />
            All docs will be quoted by the bot.<br />
            Accepted Formats: .txt, .pdf, .csv <br />
            Document name is for user convenience.<br />
          </h2>
          <input
            type="file"
            accept=".pdf,.txt,.csv"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
          {!showConfirmation && !showWorkingMessage && !showSuccessMessage && (
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-4"  // Add margin-top
              onClick={triggerFileInput}>
              Select File
            </button>
          )}
          {showConfirmation && (
            <div className="confirmation-box border border-gray-300 rounded-md bg-white shadow-md p-4 mt-4"> {/* Add margin-top */}
              <div className="mb-4">
                <p className="text-lg font-semibold">Selected File:</p>
                <p className="text-gray-600">{selectedFile.name}</p>
              </div>
              <div className="mb-4">
                <label htmlFor="Title" className="block text-xxs font-medium text-black-700">_______________Required Info_______________</label>
              </div>
              <div className="mb-4">
                <label htmlFor="documentName" className="block text-sm font-medium text-gray-700">Document Name:</label>
                <input type="text" id="documentName" name="documentName" className="mt-1 p-2 border border-gray-300 rounded-md w-full" required />
              </div>
              <div className="mb-4">
                <label htmlFor="sourceLocation" className="block text-sm font-medium text-gray-700">Source Location:</label>
                <input type="text" id="sourceLocation" name="sourceLocation" className="mt-1 p-2 border border-gray-300 rounded-md w-full" required />
              </div>
              <div className="flex justify-between">
                <button className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ${!selectedFile ? 'disabled:opacity-50' : ''}`}
                  onClick={() => handleConfirmUpload(document.getElementById('documentName').value, document.getElementById('sourceLocation').value)}>Upload</button>
                <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400" onClick={handleCancelUpload}>Cancel</button>
              </div>
            </div>
          )}
          {/* Working message */}
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
  );
  
};

export default UploadFile;
