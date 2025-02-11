import { useState, useEffect } from "react";

const UserDetailsForm = ({ onSubmit }) => {
  // Initialize state with default values or data from localStorage
  const [userDetails, setUserDetails] = useState(() => {
    const savedData = localStorage.getItem("userDetails");
    return savedData
      ? JSON.parse(savedData)
      : {
          name: "",
          idNo: "",
          ipStation: "",
          duration: {
            from: "",
            to: "",
          },
          facultyMentor: "",
          companyMentor: "",
        };
  });

  // Save data to localStorage whenever userDetails changes
  useEffect(() => {
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
  }, [userDetails]);

  // State to track whether data is being edited or created
  const [isEditing, setIsEditing] = useState(!!localStorage.getItem("userDetails"));

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(userDetails); // Pass the user details to the parent component
    setIsEditing(true); // Switch to edit mode after saving
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6">Internship Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={userDetails.name}
            onChange={(e) =>
              setUserDetails({ ...userDetails, name: e.target.value })
            }
            required
          />
        </div>

        {/* ID No Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">ID No.</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={userDetails.idNo}
            onChange={(e) =>
              setUserDetails({ ...userDetails, idNo: e.target.value })
            }
            required
          />
        </div>

        {/* IP Station Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">IP Station</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={userDetails.ipStation}
            onChange={(e) =>
              setUserDetails({ ...userDetails, ipStation: e.target.value })
            }
            required
          />
        </div>

        {/* Duration Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration From
            </label>
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={userDetails.duration.from}
              onChange={(e) =>
                setUserDetails({
                  ...userDetails,
                  duration: { ...userDetails.duration, from: e.target.value },
                })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration To
            </label>
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={userDetails.duration.to}
              onChange={(e) =>
                setUserDetails({
                  ...userDetails,
                  duration: { ...userDetails.duration, to: e.target.value },
                })
              }
              required
            />
          </div>
        </div>

        {/* Faculty Mentor Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Faculty Mentor
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={userDetails.facultyMentor}
            onChange={(e) =>
              setUserDetails({ ...userDetails, facultyMentor: e.target.value })
            }
            required
          />
        </div>

        {/* Company Mentor Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company Mentor
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={userDetails.companyMentor}
            onChange={(e) =>
              setUserDetails({ ...userDetails, companyMentor: e.target.value })
            }
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isEditing ? "Edit Details" : "Save Details"}
        </button>
      </form>
    </div>
  );
};

export default UserDetailsForm;