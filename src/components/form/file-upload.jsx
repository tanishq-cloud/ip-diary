import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const FileUpload = ({ onDataProcessed }) => {
  const [activeTab, setActiveTab] = useState("upload");
  const [googleSheetLink, setGoogleSheetLink] = useState(
    localStorage.getItem("googleSheetLink") || ""
  );
  const [isEditing, setIsEditing] = useState(!googleSheetLink);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  // Function to safely process entry data with null/undefined handling
  const processEntry = (entry) => {
    // Handle case where Date might be missing or empty
    let day = null;
    let formattedDate = null;

    if (entry.Date) {
      const dateMatch = entry.Date.toString().match(/^(\w+),\s+(.+)$/);
      day = dateMatch ? dateMatch[1] : null;
      formattedDate = dateMatch ? dateMatch[2] : entry.Date;
    }

    // Handle case where Task might be missing or empty
    const task = entry.Task ? entry.Task.toString().trim() : "";

    return {
      Day: day,
      Date: formattedDate,
      Task: task,
    };
  };

  // Function to handle file selection
  const handleFileSelection = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Function to handle file upload after button click
  const handleUploadClick = () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const arrayBuffer = evt.target?.result;
      const fileType = selectedFile.name.split(".").pop()?.toLowerCase();
      let parsedData;
      try {
        if (fileType === "csv") {
          const decoder = new TextDecoder("utf-8");
          const csvText = decoder.decode(arrayBuffer);
          const workbook = XLSX.read(csvText, { type: "string" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          parsedData = XLSX.utils.sheet_to_json(worksheet);
        } else if (["xls", "xlsx"].includes(fileType)) {
          const workbook = XLSX.read(arrayBuffer, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          parsedData = XLSX.utils.sheet_to_json(worksheet);
        } else {
          console.error("Unsupported file type");
          return;
        }

        // Process data with error handling for empty cells
        const processedData = parsedData.map(processEntry);
        onDataProcessed(processedData);

        // Reset selected file after successful upload
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById("file-input");
        if (fileInput) fileInput.value = "";
      } catch (error) {
        console.error("Error parsing file:", error);
        alert(
          "Error processing file. Please check the troubleshooting notes for help."
        );
      }
    };
    reader.onerror = () => {
      console.error("File reading failed:", reader.error);
      alert("File reading failed. Please try again with another file.");
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  // Function to fetch data from Google Sheets link
  const fetchDataFromGoogleSheet = async (link) => {
    try {
      const response = await fetch(link);
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to fetch data from the provided link.");
      }
      const csvText = await response.text();
      const workbook = XLSX.read(csvText, { type: "string" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(worksheet);

      // Process data with error handling for empty cells
      const processedData = parsedData.map(processEntry);

      onDataProcessed(processedData);
      setIsEditing(false); // Switch to "Edit" mode after successful fetch
    } catch (error) {
      console.error("Error fetching Google Sheets data:", error);
      alert(
        "Failed to fetch data from the provided link. Please check the troubleshooting notes for help."
      );
    }
  };

  // Handle Google Sheets link submission
  const handleGoogleSheetLinkSubmit = async (e) => {
    e.preventDefault();
    const link = googleSheetLink.trim();
    if (!link) {
      alert("Please enter a valid Google Sheets link.");
      return;
    }

    // Validate the link format
    const isValidLink =
      link.includes("docs.google.com/spreadsheets") &&
      link.includes("output=csv");
    if (!isValidLink) {
      alert(
        "Invalid Google Sheets link. Please provide a valid CSV export link."
      );
      return;
    }

    // Save the link and fetch data
    localStorage.setItem("googleSheetLink", link);
    await fetchDataFromGoogleSheet(link);
  };

  // Automatically fetch data if a Google Sheets link is already saved
  useEffect(() => {
    const savedLink = localStorage.getItem("googleSheetLink");
    if (savedLink) {
      setGoogleSheetLink(savedLink);
      fetchDataFromGoogleSheet(savedLink);
    }
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const toggleHelpDialog = () => {
    setShowHelpDialog(!showHelpDialog);
  };

  // Help dialog component
  const HelpDialog = () => (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          Troubleshooting Data Loading Issues
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Common Issues:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Empty Cells:</strong> The system may fail if crucial
                cells (like Date or Task) are empty in your spreadsheet.
              </li>
              <li>
                <strong>Incorrect Data Format:</strong> Your Date column should
                follow the format "Day, YYYY-MM-DD" (e.g., "Monday,
                2025-04-15").
              </li>
              <li>
                <strong>Google Sheet Not Updated:</strong> Changes to your
                Google Sheet might not be immediately reflected in the exported
                CSV link.
              </li>
              <li>
                <strong>Network Issues:</strong> Temporary connectivity problems
                might prevent loading data from Google Sheets.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg">Solutions:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Check your spreadsheet</strong> for empty cells in
                critical columns (Date, Task) and ensure they're filled.
              </li>
              <li>
                <strong>Verify the date format</strong> is correct in your
                spreadsheet.
              </li>
              <li>
                <strong>For Google Sheets:</strong> After making changes, wait a
                few minutes and then refresh your browser page.
              </li>
              <li>
                <strong>Try downloading</strong> your Google Sheet as a CSV and
                upload it directly instead of using the link.
              </li>
              <li>
                <strong>Refresh the page</strong> - sometimes a simple page
                refresh resolves caching or temporary issues.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={toggleHelpDialog}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mb-4">
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab("upload")}
          className={`px-4 py-2 rounded ${
            activeTab === "upload"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Upload File
        </button>
        <button
          onClick={() => setActiveTab("link")}
          className={`px-4 py-2 rounded ${
            activeTab === "link"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Google Sheets Link
        </button>
      </div>

      {activeTab === "upload" && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              id="file-input"
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileSelection}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button
              onClick={handleUploadClick}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Upload
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span>Need help formatting your CSV file? </span>
              <a
                href="https://github.com/tanishq-cloud/ip-diary/wiki/Task-Format-(CSV-File)"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Click here
              </a>
            </div>

            <button
              onClick={toggleHelpDialog}
              className="text-sm text-yellow-600 hover:underline flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              Troubleshooting
            </button>
          </div>
        </div>
      )}

      {activeTab === "link" && (
        <div>
          {isEditing ? (
            <form onSubmit={handleGoogleSheetLinkSubmit} className="space-y-2">
              <input
                type="text"
                value={googleSheetLink}
                onChange={(e) => setGoogleSheetLink(e.target.value)}
                placeholder="Enter Google Sheets public link"
                className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center justify-between mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Submit
                </button>
                {/* Help Hyperlink */}
                <div className="flex item-center">
                  <a
                    href="https://github.com/tanishq-cloud/ip-diary/wiki/Task-Format-(Google-Sheets-Public-Link)"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline flex items-center"
                  >
                    How to format tasks?
                  </a>

                  <button
                    type="button"
                    onClick={toggleHelpDialog}
                    className="text-sm text-yellow-600 hover:underline flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Troubleshooting
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Saved Link:</span>
                <button
                  onClick={handleEditClick}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                  Edit
                </button>
              </div>

              <button
                onClick={toggleHelpDialog}
                className="text-sm text-yellow-600 hover:underline flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                Troubleshooting
              </button>
            </div>
          )}
        </div>
      )}

      {showHelpDialog && <HelpDialog />}
    </div>
  );
};

export default FileUpload;
