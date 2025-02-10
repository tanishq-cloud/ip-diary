import React from 'react';
import * as XLSX from 'xlsx';

const FileUpload = ({ onDataProcessed }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const arrayBuffer = evt.target?.result;

      // Determine the file type based on its extension
      const fileType = file.name.split('.').pop()?.toLowerCase();

      let parsedData;

      try {
        if (fileType === 'csv') {
          // Handle CSV files
          const decoder = new TextDecoder('utf-8');
          const csvText = decoder.decode(arrayBuffer);
          const workbook = XLSX.read(csvText, { type: 'string' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          parsedData = XLSX.utils.sheet_to_json(worksheet);
        } else if (['xls', 'xlsx'].includes(fileType)) {
          // Handle Excel files
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          parsedData = XLSX.utils.sheet_to_json(worksheet);
        } else {
          console.error('Unsupported file type');
          return;
        }

        // Process the parsed data to extract day and date
        const processedData = parsedData.map((entry) => {
          const dateMatch = entry.Date.match(/^(\w+),\s+(.+)$/); // Regex to split day and date
          const day = dateMatch ? dateMatch[1] : null; // Extract day (e.g., "Monday")
          const formattedDate = dateMatch ? dateMatch[2] : null; // Extract date (e.g., "January 6, 2025")

          return {
            Day: day,
            Date: formattedDate,
            Task: entry.Task.trim(), // Remove leading/trailing whitespace
          };
        });

        // Pass processed data to parent
        onDataProcessed(processedData);
      } catch (error) {
        console.error('Error parsing file:', error);
      }
    };

    reader.onerror = () => {
      console.error('File reading failed:', reader.error);
    };

    // Read the file as an ArrayBuffer
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileUpload}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
    </div>
  );
};

export default FileUpload;