import { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import FileUpload from "../form/file-upload";
import PDFDocument from "./pdf-document";
import PDFPreview from "../pdf-preview/pdf-preview";
import UserDetailsForm from "../form/user-details";
import FontSelector from "../options/font-selector";

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
  const [activeTab, setActiveTab] = useState("form");

  const [isDataModified, setIsDataModified] = useState(false);

  useEffect(() => {
    const savedUserDetails = localStorage.getItem("userDetails");
    const savedData = localStorage.getItem("processedData");

    if (savedUserDetails) {
      setUserDetails(JSON.parse(savedUserDetails));
    }

    if (savedData) {
      setData(JSON.parse(savedData));
      setShowPreview(true);
    }
  }, []);

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

  const handleDataUpdate = (updatedData) => {
    setData(updatedData);
    setIsDataModified(true);

    localStorage.setItem("processedData", JSON.stringify(updatedData));

    console.log("Data updated and saved to localStorage");

    setTimeout(() => {
      setIsDataModified(false);
    }, 2000);
  };

  const handleManualSave = () => {
    localStorage.setItem("processedData", JSON.stringify(data));
    setIsDataModified(false);
    console.log("Data manually saved to localStorage");
  };

  const handleResetData = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all data? This action cannot be undone."
      )
    ) {
      setData([]);
      setShowPreview(false);
      setIsDataModified(false);
      localStorage.removeItem("processedData");
    }
  };

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
          PDF Preview{" "}
          {isDataModified && <span className="text-orange-500">●</span>}
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
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                PDF Settings
              </h2>
              {isDataModified && (
                <span className="text-sm text-orange-600 font-medium">
                  ● Modified
                </span>
              )}
            </div>

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
                  setIsDataModified(false);
                  localStorage.setItem(
                    "processedData",
                    JSON.stringify(processedData)
                  );
                }}
              />
            </div>

            {/* Data Management Section */}
            {showPreview && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">
                  Data Management
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={handleManualSave}
                    className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
                      isDataModified
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!isDataModified}
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleResetData}
                    className="flex-1 px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                  >
                    Reset Data
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Changes are auto-saved when editing. Manual save available for
                  backup.
                </p>
              </div>
            )}

            {/* Font Selection */}
            <FontSelector font={font} setFont={setFont} />

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

            {/* Download Section */}
            {showPreview && (
              <div className="space-y-2">
                <h3 data-testid="upload-button"className="text-sm font-medium text-gray-700">
                  Download PDF
                </h3>
                <PDFDownloadLink
                  document={
                    <PDFDocument
                      data={data}
                      font={font}
                      positions={positions}
                      userDetails={userDetails}
                    />
                  }
                  fileName={`IP_Diary_${userDetails?.idNo || "document"}.pdf`}
                >
                  {({ loading }) => (
                    <button
                      className={`w-full px-4 py-2 rounded transition-colors ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      } text-white`}
                      disabled={loading}
                    >
                      {loading ? "Generating PDF..." : "Download PDF"}
                    </button>
                  )}
                </PDFDownloadLink>
                {isDataModified && (
                  <p className="text-xs text-orange-600">
                    Note: PDF will include your latest changes
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div
          className={`${
            activeTab === "form" && "hidden md:block"
          } flex-1 relative bg-gray-100`}
        >
          {showPreview ? (
            <div data-testid="pdf-preview" className="absolute inset-0 overflow-auto">
              <PDFPreview
                data={data}
                font={font}
                positions={positions}
                userDetails={userDetails}
                onDataUpdate={handleDataUpdate}
              />
            </div>
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
