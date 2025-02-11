import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const FileUpload = ({ onDataProcessed }) => {
  const [activeTab, setActiveTab] = useState("upload");
  const [googleSheetLink, setGoogleSheetLink] = useState(
    localStorage.getItem("googleSheetLink") || ""
  );
  const [isEditing, setIsEditing] = useState(!googleSheetLink);

  // Function to handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      const arrayBuffer = evt.target?.result;
      const fileType = file.name.split(".").pop()?.toLowerCase();
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
        const processedData = parsedData.map((entry) => {
          const dateMatch = entry.Date.match(/^(\w+),\s+(.+)$/);
          const day = dateMatch ? dateMatch[1] : null;
          const formattedDate = dateMatch ? dateMatch[2] : null;
          return {
            Day: day,
            Date: formattedDate,
            Task: entry.Task.trim(),
          };
        });
        onDataProcessed(processedData);
      } catch (error) {
        console.error("Error parsing file:", error);
      }
    };
    reader.onerror = () => {
      console.error("File reading failed:", reader.error);
    };
    reader.readAsArrayBuffer(file);
  };

  // Function to fetch data from Google Sheets link
  const fetchDataFromGoogleSheet = async (link) => {
    try {
      const response = await fetch(link);
      if (!response.ok) {
        throw new Error("Failed to fetch data from the provided link.");
      }
      const csvText = await response.text();
      const workbook = XLSX.read(csvText, { type: "string" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(worksheet);

      const processedData = parsedData.map((entry) => {
        const dateMatch = entry.Date.match(/^(\w+),\s+(.+)$/);
        const day = dateMatch ? dateMatch[1] : null;
        const formattedDate = dateMatch ? dateMatch[2] : null;
        return {
          Day: day,
          Date: formattedDate,
          Task: entry.Task.trim(),
        };
      });

      onDataProcessed(processedData);
      setIsEditing(false); // Switch to "Edit" mode after successful fetch
    } catch (error) {
      console.error("Error fetching Google Sheets data:", error);
      alert("Failed to fetch data from the provided link.");
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
      link.includes("docs.google.com/spreadsheets") && link.includes("output=csv");
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
        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
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
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Submit
                </button>
                {/* Help Hyperlink */}
                <a
                  href="https://github.com/tanishq-cloud/ip-diary/wiki/Task-format"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  How to format tasks?
                </a>
              </div>
            </form>
          ) : (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Saved Link:</span>
              <button
                onClick={handleEditClick}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;