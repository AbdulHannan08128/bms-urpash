// pages/index.js
'use client'
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx'
export default function Home() {
  const [jsonData, setJsonData] = useState(null);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const convertedData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      setJsonData(convertedData);
    };
    
    reader.readAsArrayBuffer(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Upload Excel File</h1>
      <div
        {...getRootProps()}
        className={`py-12 px-4 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${isDragActive ? 'border-blue-500' : ''}`}
      >
        <input {...getInputProps()} />
        <p className="text-center">
          {isDragActive ? 'Drop the file here' : 'Drag and drop your Excel file here, or click to browse'}
        </p>
      </div>
      {jsonData && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Converted Data:</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

