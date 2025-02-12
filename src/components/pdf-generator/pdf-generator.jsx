import React, { useState, useEffect } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import FileUpload from "../form/file-upload";
import PDFDocument from "./pdf-document";
import UserDetailsForm from "../form/user-details";

// Utility to detect if the browser is Firefox
const isFirefox = () => {
  const { userAgent } = navigator;
  return userAgent.includes("Firefox");
};

// Utility to detect if the device is mobile
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};

const PDFGenerator = () => {
  // State for uploaded data
  const [data, setData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  // State for font selection
  const [font, setFont] = useState("Helvetica");

  // State for user details
  const [userDetails, setUserDetails] = useState(null);

  // State for layout positions
  const [positions, setPositions] = useState({
    header: { top: 20 },
    content: { marginTop: 40 },
    footer: { bottom: 40 },
  });

  // State for active tab
  const [activeTab, setActiveTab] = useState("form");

  // Load data from local storage on component mount
  useEffect(() => {
    const savedUserDetails = localStorage.getItem("userDetails");
    const savedData = localStorage.getItem("processedData");

    if (savedUserDetails) {
      setUserDetails(JSON.parse(savedUserDetails));
    }

    if (savedData) {
      setData(JSON.parse(savedData));
      setShowPreview(true); // Automatically show preview if data exists
    }
  }, []);

  // Handle layout selection change
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

  // Check if the browser supports inline PDF rendering
  const supportsInlinePDF =
    !isMobileDevice() || (isMobileDevice() && isFirefox());

  return (
    <div className="flex flex-col h-screen">
      {/* Tabs for Mobile */}
      <div className="md:hidden flex border-b border-gray-200">
        <button
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === "form" ? "bg-gray-100 text-blue-600" : "text-gray-600"
          }`}
          onClick={() => setActiveTab("form")}
        >
          Form
        </button>
        <button
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === "pdf" ? "bg-gray-100 text-blue-600" : "text-gray-600"
          }`}
          onClick={() => setActiveTab("pdf")}
        >
          PDF Preview
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex md:flex-row flex-col">
        {/* Left Panel - Forms */}
        <div
          className={`${
            activeTab === "pdf" && "hidden md:block"
          } md:w-1/3 w-full p-4 border-b md:border-r border-gray-200 overflow-y-auto bg-gray-50`}
        >
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">
              PDF Settings
            </h2>

            {/* User Details Form */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">
                Student Details
              </h3>
              <UserDetailsForm
                onSubmit={(details) => {
                  setUserDetails(details);
                  localStorage.setItem("userDetails", JSON.stringify(details));
                }}
              />
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
                  localStorage.setItem(
                    "processedData",
                    JSON.stringify(processedData),
                  );
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
              <h3 className="text-sm font-medium text-gray-700">
                Layout Style
              </h3>
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

        {/* Right Panel - PDF Viewer or Download Link */}
        <div
          className={`${
            activeTab === "form" && "hidden md:block"
          } flex-1 relative bg-gray-100`}
        >
          {showPreview ? (
            supportsInlinePDF ? (
              // Render PDF preview for supported browsers
              <PDFViewer
                className="absolute inset-0 w-full h-full"
                style={{
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PDFDocument
                  data={data}
                  font={font}
                  positions={positions}
                  userDetails={userDetails}
                />
              </PDFViewer>
            ) : (
              // Fallback to download link for unsupported browsers
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">
                  Your browser does not support inline PDF preview. Please use
                  Firefox on mobile or any desktop browser.
                </h2>
                <PDFDownloadLink
                  document={
                    <PDFDocument
                      data={data}
                      font={font}
                      positions={positions}
                      userDetails={userDetails}
                    />
                  }
                  fileName={`IP_Diary_${userDetails.idNo}.pdf`}
                >
                  {({ loading }) =>
                    loading ? (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Generating PDF...
                      </button>
                    ) : (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Download PDF
                      </button>
                    )
                  }
                </PDFDownloadLink>
              </div>
            )
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <p className="text-lg text-center">
                Fill in details and upload file to preview PDF
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFGenerator;
