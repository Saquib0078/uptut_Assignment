import React, { useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function FileUploader() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  }

  const handleFileUpload = () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      socket.emit('send-file', formData);
      setFile(null);
    }
  }

  return (
    <div>
      <h1>File Sharing App</h1>
      <FileUploader onFileChange={handleFileChange} onFileUpload={handleFileUpload} />
    </div>
  );
}

export default FileUploader;
