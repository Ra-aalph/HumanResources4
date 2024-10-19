import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit"; // Import icons

const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]); // For filtered data
  const [form, setForm] = useState({
    employeeName: "",
    employeePosition: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    status: "Pending",
  });

  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [editingId, setEditingId] = useState(null); // To track the leave being edited
  const [notification, setNotification] = useState({ message: "", type: "" }); // Notification state

  const positions = [
    "Nurse",
    "Doctor",
    "Pharmacist",
    "Physical Therapist",
    "Administrative Staff",
  ];
  const leaveTypes = [
    "Sick Leave",
    "Vacation Leave",
    "Maternity Leave",
    "Paternity Leave",
  ];

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get("http://localhost:8055/leaves");
        setLeaves(response.data);
        setFilteredLeaves(response.data); // Initialize filtered leaves
      } catch (error) {
        console.error("Error fetching leaves:", error);
      }
    };
    fetchLeaves();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filtered = leaves.filter((leave) =>
      leave.employeeName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredLeaves(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:8055/leaves/${editingId}`, form);
        setLeaves((prev) =>
          prev.map((leave) =>
            leave._id === editingId ? { ...form, _id: editingId } : leave
          )
        );
        setFilteredLeaves((prev) =>
          prev.map((leave) =>
            leave._id === editingId ? { ...form, _id: editingId } : leave
          )
        );
        setNotification({
          message: "Employee's Leave updated successfully!",
          type: "success",
        });
        setEditingId(null);
      } else {
        const response = await axios.post("http://localhost:8055/leaves", form);
        setLeaves([...leaves, { ...form, _id: response.data._id }]);
        setFilteredLeaves([...leaves, { ...form, _id: response.data._id }]); // For new data addition
        setNotification({
          message: "Employee's Leave added successfully!",
          type: "success",
        });
      }
      setForm({
        employeeName: "",
        employeePosition: "",
        leaveType: "",
        startDate: "",
        endDate: "",
        status: "Pending",
      });
    } catch (error) {
      setNotification({ message: "Error saving leave.", type: "error" });
    }
    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 3000);
  };

  const handleEdit = (leave) => {
    setForm(leave);
    setEditingId(leave._id);
  };

  const handleDelete = async (_id) => {
    const confirmed = window.confirm("Are you sure you want to delete this?");
    if (!confirmed) {
      return; // If the user cancels, exit the function
    }
    try {
      await axios.delete(`http://localhost:8055/leaves/${_id}`);
      setLeaves(leaves.filter((leave) => leave._id !== _id));
      setFilteredLeaves(filteredLeaves.filter((leave) => leave._id !== _id)); // Update filtered list
      setNotification({
        message: "Employee's Leave deleted successfully!",
        type: "success",
      });
    } catch (error) {
      setNotification({ message: "Error deleting leave.", type: "error" });
    }
    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 3000);
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-200 text-green-800"; // Green color for Approved
      case "Rejected":
        return "bg-red-200 text-red-800"; // Red color for Rejected
      case "Pending":
      default:
        return "bg-yellow-200 text-yellow-800"; // Yellow color for Pending
    }
  };

  return (
    <div className="bg-[#F0F0F0]  mt-16">
      <div className="bg-[#F0F0F0] md:grid-cols-2 gap-4 mt-8 p-4">
        {notification.message && (
          <div
            className={`fixed top-30 right-5 p-4 border rounded flex items-center space-x-2 transition-opacity duration-500 ease-in-out  ${
              notification.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {notification.type === "success" ? (
              <FaCheckCircle />
            ) : (
              <FaExclamationCircle />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-[white] shadow-md rounded-lg p-4 sm:p-3 mb-4 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl p-4 font-bold mb-8 sm:mb-6 text-gray-800">
            Leave Management
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Search employee
              </label>
              <input
                type="text"
                placeholder="Search Employee's Name"
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Employee's Name
              </label>
              <input
                type="text"
                name="employeeName"
                value={form.employeeName}
                onChange={handleChange}
                placeholder="Employee's Name"
                required
                className="w-full px-4 py-2 border border-gray-300 focus:outline-none rounded-md focus:ring-2 focus:ring-[#090367]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Position
              </label>
              <select
                name="employeePosition"
                value={form.employeePosition}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
              >
                <option value="">Choose a Position</option>
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Leave Type
              </label>
              <select
                name="leaveType"
                value={form.leaveType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
              >
                <option value="">Choose a leave type</option>
                {leaveTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Start
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                End
              </label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="mt-2 ml-8">
            <button
            type="submit"
           className="mt-4 py-2 px-4 bg-[#090367] text-white font-semibold rounded-md shadow-md hover:bg-[#EA0D10] transition-colors duration-200"
          >
            {editingId ? "Update Leave" : "Add Leave"}
          </button>
            </div>
          </div>
        </form>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md table-container">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr className="bg-[#090367] text-white text-xs sm:text-sm leading-normal">
                <th className="border px-4 sm:px-6 py-2">Employee's Name</th>
                <th className="border px-4 sm:px-6 py-2">Position</th>
                <th className="border px-4 sm:px-6 py-2">Leave Type</th>
                <th className="border px-4 sm:px-6 py-2">Start Date</th>
                <th className="border px-4 sm:px-6 py-2">End Date</th>
                <th className="border px-4 sm:px-6 py-2">Status</th>
                <th className="border px-4 sm:px-6 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm">
              {filteredLeaves.length > 0 ? (
                filteredLeaves.map((leave) => (
                  <tr key={leave._id} className="text-xs sm:text-sm bg-white hover:bg-gray-100">
                    <td className="border border-gray-300 p-2">{leave.employeeName}</td>
                    <td className="border border-gray-300 p-2">{leave.employeePosition}</td>
                    <td className="border border-gray-300 p-2">{leave.leaveType}</td>
                    <td className="border border-gray-300 p-2">{formatDate(leave.startDate)}</td>
                    <td className="border border-gray-300 p-2">{formatDate(leave.endDate)}</td>
                    <td className={` border border-gray-300 p-2 ${getStatusColor(leave.status)}`}>
                      {leave.status}
                    </td>
                    <td className="border border-gray-300 p-2 flex justify-center">
                      <EditIcon
                        onClick={() => handleEdit(leave)}
                        className="cursor-pointer text-blue-500 hover:text-[#090367]"
                      />
                      <DeleteIcon
                        onClick={() => handleDelete(leave._id)}
                        className="cursor-pointer text-red-500 hover:text-[#EA0D10]"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                  No Employee Found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <footer className="bg-white mt-32 p-4 rounded-md shadow-md">
        <p>2024 Hospital Management System. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Leave;
