import React, { useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import FileUpload from "../form/file-upload";
import PDFDocument from "./pdf-document";
import UserDetailsForm from "../form/user-details";

const PDFGenerator = () => {
  const [data, setData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [font, setFont] = useState("Helvetica");
  const [userDetails, setUserDetails] = useState(null);
  const [positions, setPositions] = useState({
    header: { top: 20 },
    content: { marginTop: 40 },
    footer: { bottom: 40 },
  });

  const handleChange = (event) => {
    const selectedLayout = event.target.value;
    if (selectedLayout === "compact") {
      setPositions({
        header: { top: 10 },
        content: { marginTop: 30 },
        footer: { bottom: 30 },
      });
    } else if (selectedLayout === "default") {
      setPositions({
        header: { top: 20 },
        content: { marginTop: 40 },
        footer: { bottom: 40 },
      });
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel - Forms */}
      <div className="w-1/3 p-4 border-r border-gray-200 overflow-y-auto bg-gray-50">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">PDF Settings</h2>

          {/* User Details Form */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">
              Student Details
            </h3>
            <UserDetailsForm onSubmit={(details) => setUserDetails(details)} />
          </div>

          {/* File Upload Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">
              Upload Daily Tasks
            </h3>
            <FileUpload
              onDataProcessed={(processedData) => {
                setData(processedData);
                setShowPreview(true);
              }}
            />
          </div>

          {/* Font Selection */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">
              Font Selection
            </h3>
            <select
              data-testid="font-select"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={font}
              onChange={(e) => setFont(e.target.value)}
            >
              <option value="Helvetica">Helvetica</option>
              <option value="Times-Roman">Times New Roman</option>
              <option value="Courier">Courier</option>
            </select>
          </div>

          {/* Layout Selection */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Layout Style</h3>
            <select
              data-testid="layout-select"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            >
              <option value="default">Default Layout</option>
              <option value="compact">Compact Layout</option>
            </select>
          </div>
        </div>
      </div>

      {/* Right Panel - PDF Viewer */}
      <div className="flex-1 bg-gray-100">
        {showPreview ? (
          <PDFViewer width="100%" height="100%">
            <PDFDocument
              data={data}
              font={font}
              positions={positions}
              userDetails={userDetails}
            />
          </PDFViewer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p className="text-lg">
              Fill in details and upload file to preview PDF
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFGenerator;
