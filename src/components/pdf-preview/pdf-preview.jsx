import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Edit3, Eye, Save, X } from "lucide-react";
import Markdown from "react-markdown";

function formatDate(date) {
  if (!date) return "_________";
  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
}

const PDFPreview = ({
  data = [],
  font = "Arial",
  positions = {},
  userDetails = {},
  onDataUpdate = () => {},
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editContent, setEditContent] = useState("");
  const [localData, setLocalData] = useState(data);
  const pageRefs = useRef([]);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const normalizeTask = (task) => task.trim().toLowerCase();

  const holidays = localData.filter(
    (entry) => normalizeTask(entry.Task) === "holiday"
  );
  const holidayList = holidays.filter(
    (holiday) =>
      holiday.Task.length <= 30 &&
      !["on leave", "leave day"].includes(normalizeTask(holiday.Task))
  );

  const leaveList = localData.filter((entry) => {
    const task = normalizeTask(entry.Task);
    return /^(on leave|leave day)$/.test(task);
  });

  const excludedDates = [
    ...holidayList.map((holiday) => holiday.Date.trim()),
    ...leaveList.map((leave) => leave.Date.trim()),
  ];

  const filteredData = localData.filter(
    (entry) =>
      normalizeTask(entry.Task) !== "holiday" &&
      !excludedDates.includes(entry.Date.trim())
  );

  const totalPages =
    1 +
    filteredData.length +
    (holidayList.length > 0 || leaveList.length > 0 ? 1 : 0);

  const scrollToPage = (pageNumber) => {
    const pageElement = pageRefs.current[pageNumber - 1];
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
      setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (let i = 0; i < pageRefs.current.length; i++) {
        const pageElement = pageRefs.current[i];
        if (pageElement) {
          const rect = pageElement.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;

          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            setCurrentPage(i + 1);
            break;
          }
        }
      }
    };

    const container = document.querySelector(".pdf-preview-container");
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const startEditing = (index, content) => {
    setIsEditing(true);
    setEditingIndex(index);
    setEditContent(content || "");
  };

  const saveEdit = () => {
    const newData = [...localData];
    const originalIndex = localData.findIndex(
      (entry, idx) => filteredData[editingIndex] === entry
    );

    if (originalIndex !== -1) {
      newData[originalIndex] = {
        ...newData[originalIndex],
        Task: editContent,
      };
      setLocalData(newData);
      onDataUpdate(newData);
    }

    setIsEditing(false);
    setEditingIndex(-1);
    setEditContent("");
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingIndex(-1);
    setEditContent("");
  };

  const pageStyle = {
    width: "210mm",
    height: "297mm",
    margin: "0 auto 20px auto",
    padding: "0",
    backgroundColor: "white",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    fontFamily: font,
    fontSize: "12px",
    lineHeight: "1.4",
    position: "relative",
    border: "1px solid #e0e0e0",
    overflow: "hidden",
  };

  const contentWrapperStyle = {
    margin: "10px",
    border: "1px solid black",
    height: "calc(100% - 20px)",
    position: "relative",
  };

  const contentPageStyle = {
    padding: "30px",
    backgroundColor: "#ffffff",
    height: "100%",
    position: "relative",
    boxSizing: "border-box",
  };

  return (
    <div className="relative h-full">
      {/* Page Navigation */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between bg-white rounded-lg shadow-md p-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => scrollToPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>

          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => scrollToPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= totalPages) {
                  scrollToPage(page);
                }
              }}
              className="w-16 px-2 py-1 text-sm border rounded focus:outline-none focus:border-blue-500"
            />
            <span className="text-sm text-gray-600">Go to page</span>
          </div>

          {/* Global Edit Toggle - Always show for debugging */}
          <div className="flex items-center space-x-2">
            <div className="text-xs text-gray-500">
              Page: {currentPage}/{totalPages} | Content: {filteredData.length}
            </div>
            <button
              onClick={() => {
                if (isEditing) {
                  cancelEdit();
                } else {
                  const contentPageIndex = currentPage - 2;
                  console.log("Edit clicked:", {
                    currentPage,
                    contentPageIndex,
                    filteredDataLength: filteredData.length,
                  });
                  if (
                    contentPageIndex >= 0 &&
                    contentPageIndex < filteredData.length
                  ) {
                    startEditing(
                      contentPageIndex,
                      filteredData[contentPageIndex].Task
                    );
                  }
                }
              }}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isEditing ? <X size={16} /> : <Edit3 size={16} />}
              <span>{isEditing ? "Cancel" : "Edit"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* PDF Content */}
      <div className="pdf-preview-container bg-gray-200 pt-20 pb-6 px-6 overflow-auto h-full">
        <div className="max-w-full">
          {/* Cover Page */}
          <div ref={(el) => (pageRefs.current[0] = el)} style={pageStyle}>
            <div
              className="flex flex-col items-center justify-between h-full"
              style={{ padding: "60px 40px" }}
            >
              <div></div> {/* Spacer */}
              <div className="text-center">
                <h1
                  className="text-2xl font-bold mb-10 text-center"
                  style={{
                    fontFamily: '"Libre Baskerville", serif',
                    fontStyle: "italic",
                    fontSize: "24px",
                    marginBottom: "40px",
                  }}
                >
                  Internship Program Diary
                </h1>

                <div className="w-full mt-5" style={{ marginTop: "20px" }}>
                  <div className="flex items-center mb-5">
                    <span
                      className="font-normal"
                      style={{ width: "120px", fontSize: "12px" }}
                    >
                      Name
                    </span>
                    <span
                      className="flex-1 text-left pl-2"
                      style={{
                        fontSize: "12px",
                        borderBottom: "1px solid black",
                        paddingBottom: "2px",
                      }}
                    >
                      : {userDetails?.name || "_________________"}
                    </span>
                  </div>
                  <div className="flex items-center mb-5">
                    <span
                      className="font-normal"
                      style={{ width: "120px", fontSize: "12px" }}
                    >
                      ID No.
                    </span>
                    <span
                      className="flex-1 text-left pl-2"
                      style={{
                        fontSize: "12px",
                        borderBottom: "1px solid black",
                        paddingBottom: "2px",
                      }}
                    >
                      : {userDetails?.idNo || "_________________"}
                    </span>
                  </div>
                  <div className="flex items-center mb-5">
                    <span
                      className="font-normal"
                      style={{ width: "120px", fontSize: "12px" }}
                    >
                      IP Station
                    </span>
                    <span
                      className="flex-1 text-left pl-2"
                      style={{
                        fontSize: "12px",
                        borderBottom: "1px solid black",
                        paddingBottom: "2px",
                      }}
                    >
                      : {userDetails?.ipStation || "_________________"}
                    </span>
                  </div>
                  <div className="flex items-center mb-5">
                    <span
                      className="font-normal"
                      style={{ width: "120px", fontSize: "12px" }}
                    >
                      Duration
                    </span>
                    <span
                      className="flex-1 text-left pl-2"
                      style={{
                        fontSize: "12px",
                        borderBottom: "1px solid black",
                        paddingBottom: "2px",
                      }}
                    >
                      : {formatDate(userDetails?.duration?.from)} to{" "}
                      {formatDate(userDetails?.duration?.to)}
                    </span>
                  </div>
                  <div className="flex items-center mb-5">
                    <span
                      className="font-normal"
                      style={{ width: "120px", fontSize: "12px" }}
                    >
                      Faculty Mentor
                    </span>
                    <span
                      className="flex-1 text-left pl-2"
                      style={{
                        fontSize: "12px",
                        borderBottom: "1px solid black",
                        paddingBottom: "2px",
                      }}
                    >
                      : {userDetails?.facultyMentor || "_________________"}
                    </span>
                  </div>
                  <div className="flex items-center mb-5">
                    <span
                      className="font-normal"
                      style={{ width: "120px", fontSize: "12px" }}
                    >
                      Company Mentor
                    </span>
                    <span
                      className="flex-1 text-left pl-2"
                      style={{
                        fontSize: "12px",
                        borderBottom: "1px solid black",
                        paddingBottom: "2px",
                      }}
                    >
                      : {userDetails?.companyMentor || "_________________"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <img
                  src="/api/placeholder/150/150"
                  alt="IFHE Logo"
                  className="mb-5"
                  style={{ width: "150px", marginBottom: "20px" }}
                />
                <p
                  className="text-base mt-5"
                  style={{ fontSize: "16px", marginTop: "20px" }}
                >
                  Faculty of Science & Technology
                </p>
              </div>
            </div>
          </div>

          {/* Content Pages */}
          {filteredData.map((entry, index) => (
            <div
              key={index}
              ref={(el) => (pageRefs.current[index + 1] = el)}
              style={pageStyle}
            >
              <div style={contentWrapperStyle}>
                <div style={contentPageStyle}>
                  {/* Header */}
                  <div
                    className="flex justify-between mb-5"
                    style={{
                      fontSize: "12px",
                      marginBottom: "20px",
                      marginTop: positions?.header?.top || "0px",
                    }}
                  >
                    <span style={{ fontFamily: font }}>
                      Day: {entry.Day || ""}
                    </span>
                    <span style={{ fontFamily: font }}>
                      Date: {entry.Date || ""}
                    </span>
                  </div>

                  {/* Content - with controlled height */}
                  <div
                    style={{
                      marginTop: positions?.content?.marginTop || "0px",
                      marginBottom: "120px",
                      height: "calc(100% - 160px)",
                      overflow: "hidden",
                      wordWrap: "break-word",
                      position: "relative",
                    }}
                  >
                    {isEditing && editingIndex === index ? (
                      <div className="h-full flex flex-col">
                        {/* Editor Toolbar */}
                        <div className="flex items-center justify-between mb-2 pb-2 border-b">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-600">
                              Markdown Editor
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={saveEdit}
                              className="flex items-center space-x-1 px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              <Save size={12} />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                              <X size={12} />
                              <span>Cancel</span>
                            </button>
                          </div>
                        </div>

                        {/* Editor */}
                        <div className="flex-1 flex border rounded">
                          {/* Textarea */}
                          <div className="flex-1 flex flex-col">
                            <div className="bg-gray-100 px-2 py-1 text-xs border-b">
                              Write
                            </div>
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="flex-1 p-2 text-sm font-mono resize-none border-none outline-none"
                              placeholder="Enter your markdown content here..."
                              style={{
                                fontFamily:
                                  'Monaco, Consolas, "Courier New", monospace',
                              }}
                            />
                          </div>

                          {/* Preview */}
                          <div className="flex-1 flex flex-col border-l">
                            <div className="bg-gray-100 px-2 py-1 text-xs border-b">
                              Preview
                            </div>
                            <div className="flex-1 p-2 overflow-auto text-sm">
                              <Markdown>{editContent}</Markdown>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-full group">
                        <Markdown>{entry.Task || ""}</Markdown>
                        {/* Edit button overlay - Make it more visible */}
                        <button
                          onClick={() => {
                            console.log("Individual edit clicked:", {
                              index,
                              task: entry.Task,
                            });
                            startEditing(index, entry.Task);
                          }}
                          className="absolute top-2 right-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-lg opacity-80 hover:opacity-100 transition-all transform hover:scale-110"
                          title="Edit this entry"
                        >
                          <Edit3 size={16} />
                        </button>
                        {/* Always visible debug info */}
                        <div className="absolute bottom-2 left-2 text-xs bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                          Entry {index + 1}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div
                    className="absolute"
                    style={{
                      bottom: "30px",
                      left: "30px",
                      right: "30px",
                    }}
                  >
                    <div className="flex justify-between mt-2">
                      <div className="flex-1 mr-5">
                        <p
                          className="mb-1"
                          style={{ fontSize: "10px", fontFamily: font }}
                        >
                          Checked by:
                        </p>
                        <div
                          className="mt-1"
                          style={{
                            borderBottom: "1px solid black",
                            marginTop: "5px",
                            height: "1px",
                          }}
                        ></div>
                      </div>
                      <div className="flex-1">
                        <p
                          className="mb-1"
                          style={{ fontSize: "10px", fontFamily: font }}
                        >
                          Date:
                        </p>
                        <div
                          className="mt-1"
                          style={{
                            borderBottom: "1px solid black",
                            marginTop: "5px",
                            height: "1px",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <div className="flex-1 mr-5">
                        <p
                          className="mb-1"
                          style={{ fontSize: "10px", fontFamily: font }}
                        >
                          Verified by:
                        </p>
                        <div
                          className="mt-1"
                          style={{
                            borderBottom: "1px solid black",
                            marginTop: "5px",
                            height: "1px",
                          }}
                        ></div>
                      </div>
                      <div className="flex-1">
                        <p
                          className="mb-1"
                          style={{ fontSize: "10px", fontFamily: font }}
                        >
                          Date:
                        </p>
                        <div
                          className="mt-1"
                          style={{
                            borderBottom: "1px solid black",
                            marginTop: "5px",
                            height: "1px",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Holidays and Leaves Table */}
          {(holidayList.length > 0 || leaveList.length > 0) && (
            <div
              ref={(el) => (pageRefs.current[totalPages - 1] = el)}
              style={pageStyle}
            >
              <div style={{ marginTop: "20px", padding: "30px" }}>
                <h2
                  className="text-base font-bold mb-2 text-center"
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  Holidays and Leaves
                </h2>

                <div
                  style={{
                    border: "1px solid black",
                    borderRadius: "5px",
                    overflow: "hidden",
                  }}
                >
                  {/* Table Header */}
                  <div
                    className="flex"
                    style={{
                      backgroundColor: "#f0f0f0",
                      borderBottom: "1px solid black",
                    }}
                  >
                    <div
                      className="flex-1 p-2 text-center font-bold"
                      style={{
                        padding: "8px",
                        borderRight: "1px solid black",
                        fontWeight: "bold",
                      }}
                    >
                      Date
                    </div>
                    <div
                      className="flex-1 p-2 text-center font-bold"
                      style={{
                        padding: "8px",
                        borderRight: "1px solid black",
                        fontWeight: "bold",
                      }}
                    >
                      Holidays
                    </div>
                    <div
                      className="flex-1 p-2 text-center font-bold"
                      style={{
                        padding: "8px",
                        fontWeight: "bold",
                      }}
                    >
                      Leaves
                    </div>
                  </div>

                  {/* Table Rows */}
                  {localData
                    .filter((entry) => {
                      const isHoliday =
                        entry.Task === "HOLIDAY" &&
                        entry.Task.length <= 30 &&
                        !["On Leave", "Leave Day"].includes(entry.Task);
                      const isLeave = ["On Leave", "Leave Day"].includes(
                        entry.Task
                      );
                      return isHoliday || isLeave;
                    })
                    .map((entry, index) => {
                      const isHoliday =
                        entry.Task === "HOLIDAY" &&
                        entry.Task.length <= 30 &&
                        !["On Leave", "Leave Day"].includes(entry.Task);
                      const isLeave = ["On Leave", "Leave Day"].includes(
                        entry.Task
                      );

                      return (
                        <div
                          key={index}
                          className="flex"
                          style={{
                            borderBottom:
                              index === localData.length - 1
                                ? "none"
                                : "1px solid black",
                          }}
                        >
                          <div
                            className="flex-1 p-2 text-center"
                            style={{
                              padding: "8px",
                              borderRight: "1px solid black",
                            }}
                          >
                            {entry.Date || ""}
                          </div>
                          <div
                            className="flex-1 p-2 text-center"
                            style={{
                              padding: "8px",
                              borderRight: "1px solid black",
                            }}
                          >
                            {isHoliday ? entry.Task : ""}
                          </div>
                          <div
                            className="flex-1 p-2 text-center"
                            style={{ padding: "8px" }}
                          >
                            {isLeave ? entry.Task : ""}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;
