import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit"; // Import icons

const Shift = () => {
  const [shifts, setShifts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeePosition, setEmployeePosition] = useState("");
  const [shiftType, setShiftType] = useState("");
  const [differentialRate, setDifferentialRate] = useState(0); // Initialize as number
  const [salary, setSalary] = useState(0); // Initialize as number
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });

  // Daily Salary Positions
  const positions = {
    Doctor: 3182,
    Nurse: 1591,
    Pharmacist: 1136,
    "Physical Therapist": 909,
    "Administrative Staff": 682,
  };

  // Shift Types Differential Rates %
  const shiftTypes = {
    "Regular Shift": 0,  
    "Night Shift": 5,
    "Weekend Shift": 10,
    "Holiday Shift": 15,
  };

  // Format Salary
  const formatSalary = (amount) => `₱${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

  // Fetch Shifts on Component Mount
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await axios.get("http://localhost:8055/shifts");
        setShifts(response.data);
      } catch (error) {
        console.error("Error fetching shifts:", error);
        showNotification("error", "Error fetching shifts. Please try again.");
      }
    };

    fetchShifts();
  }, []);

  // Show Notification
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false }), 3000);
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newShift = { employeeName, employeePosition, shiftType, differentialRate, salary };

    try {
      if (editIndex !== null) {
        await axios.put(`http://localhost:8055/shifts/${editId}`, newShift);
        const updatedShifts = shifts.map((shift, index) => (index === editIndex ? { ...shift, ...newShift } : shift));
        setShifts(updatedShifts);
        showNotification("success", "Employee's Shift updated successfully!");
        resetForm();
      } else {
        const response = await axios.post("http://localhost:8055/shifts", newShift);
        setShifts([...shifts, response.data]);
        showNotification("success", "Employee's Shift added successfully!");
        resetForm();
      }
    } catch (error) {
      console.error("Error saving shift:", error);
      showNotification("error", "Error saving shift. Please try again.");
    }
  };

  // Reset Form Fields
  const resetForm = () => {
    setEmployeeName("");
    setEmployeePosition("");
    setShiftType("");
    setDifferentialRate(0);
    setSalary(0);
    setEditIndex(null);
    setEditId(null);
  };

  // Handle Edit
  const handleEdit = (index) => {
    const shiftToEdit = shifts[index];
    setEmployeeName(shiftToEdit.employeeName);
    setEmployeePosition(shiftToEdit.employeePosition);
    setShiftType(shiftToEdit.shiftType);
    setDifferentialRate(shiftToEdit.differentialRate);
    setSalary(shiftToEdit.salary);
    setEditIndex(index);
    setEditId(shiftToEdit._id);
  };

  // Handle Delete
  const handleDelete = async (index) => {
    const confirmed = window.confirm("Are you sure you want to delete this?");
    if (!confirmed) {
      console.log("Deletion cancelled."); 
      return; 
    }

    const shiftToDelete = shifts[index];
    try {
      await axios.delete(`http://localhost:8055/shifts/${shiftToDelete._id}`);
      const updatedShifts = shifts.filter((_, i) => i !== index);
      setShifts(updatedShifts);
      showNotification("success", "Employee's Shift deleted successfully!");
    } catch (error) {
      console.error("Error deleting shift:", error);
      showNotification("error", "Error deleting shift. Please try again.");
    }
  };

  // Handle Position Change
  const handlePositionChange = (e) => {
    const position = e.target.value;
    setEmployeePosition(position);
    const baseSalary = positions[position] || 0; // Default to 0 if position not found
    const differential = (differentialRate / 100) * baseSalary; // Calculate differential
    setSalary(baseSalary + differential);
  };

  // Handle Shift Type Change
  const handleShiftTypeChange = (e) => {
    const type = e.target.value;
    setShiftType(type);
    const rate = shiftTypes[type] || 0; // Default to 0 if shift type not found
    const baseSalary = positions[employeePosition] || 0; // Default to 0 if position not found
    const newSalary = baseSalary + (baseSalary * rate / 100); // Calculate new salary
    setDifferentialRate(rate);
    setSalary(newSalary);
  };

  // Filter Shifts Based on Search Term
  const filteredShifts = shifts.filter((shift) =>
    shift.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="bg-[#F0F0F0]  mt-16">
      <div className="bg-[#F0F0F0] md:grid-cols-2 gap-4 mt-8 p-4">
        {notification.show && (
          <div
            className={`fixed top-30 right-5 p-4 border rounded flex items-center space-x-2 transition-opacity duration-500 ease-in-out  ${
              notification.show ? "opacity-100 visible" : "opacity-0 invisible"
            } ${
              notification.type === "success"
                ? "bg-green-100 border-green-300 text-green-800"
                : "bg-red-100 border-red-300 text-red-800"
            }`}
          >
            {notification.type === "success" ? (
              <FaCheckCircle size={20} className="text-green-600" />
            ) : (
              <FaExclamationCircle size={20} className="text-red-600" />
            )}
            <span>{notification.message}</span>
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="bg-[white] shadow-md rounded-lg p-4 sm:p-3 mb-4 sm:mb-8"
        >
          <h1 className="text-2xl p-4 sm:text-3xl font-bold mb-8 sm:mb-6 text-gray-800">
            Shift Management
          </h1>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Search Employee
              </label>
              <input
                type="text"
                placeholder="Search Employee's Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-[#090367]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Employee's Name
              </label>
              <input
                type="text"
                placeholder="Employee's Name"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-[#090367]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Position
              </label>
              <select
                value={employeePosition}
                onChange={handlePositionChange}
                className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-[#090367]"
                required
              >
                <option value="">
                Choose a Position
                </option>
                {Object.keys(positions).map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>

            {/* Base Salary Field */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Base Daily Salary
              </label>
              <input
                type="text"
                value={formatSalary(positions[employeePosition] || 0)}
                readOnly
                className="border border-gray-300 rounded p-2 mb-2 w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#090367]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Shift Type
              </label>
              <select
                value={shiftType}
                onChange={handleShiftTypeChange}
                className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-[#090367]"
                required
              >
                <option value="">
                  Select Shift Type
                </option>
                {Object.keys(shiftTypes).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-2 ml-8">
              <button
                type="submit"
                className="mt-4 py-2 px-4 bg-[#090367] text-white font-semibold rounded-md shadow-md hover:bg-[#EA0D10] transition-colors duration-200"
              >
                {editIndex !== null ? "Update Shift" : "Add Shift"}
              </button>
            </div>
          </div>
        </form>
        {/* Shift Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md table-container ">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr className="bg-[#090367] text-white text-xs sm:text-sm leading-normal">
                <th className="border px-4 sm:px-6 py-2">Employee Name</th>
                <th className="border px-4 sm:px-6 py-2">Position</th>
                <th className="border px-4 sm:px-6 py-2">Shift Type</th>
                <th className="border px-4 sm:px-6 py-2">Differential Rate</th>
                <th className="border px-4 sm:px-6 py-2">Total Salary</th>
                <th className="border px-4 sm:px-6 py-2">Actions</th>
              </tr>
            </thead>

            <tbody className="text-xs sm:text-sm">
              {filteredShifts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-sm">
                  No Employee Found.
                  </td>
                </tr>
              ) : (
                filteredShifts.map((shift, index) => (
                  <tr
                    key={index}
                    className="text-xs sm:text-sm bg-white hover:bg-gray-100"
                  >
                    <td className="border border-gray-300 p-2">
                      {shift.employeeName}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {shift.employeePosition}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {shift.shiftType}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {shift.differentialRate}%
                    </td>
                    <td className="border border-gray-300 p-2">
                      {formatSalary(shift.salary)}
                    </td>
                    <td className="border border-gray-300 p-2 flex justify-center">
                      <EditIcon
                        onClick={() => handleEdit(index)}
                        className="cursor-pointer text-blue-500 hover:text-[#090367]"
                      />
                      <DeleteIcon
                        onClick={() => handleDelete(index)}
                        className="cursor-pointer text-red-500 hover:text-[#EA0D10]"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <footer className="bg-white mt-36 p-4 rounded-md shadow-md">
        <p>2024 Hospital Management System. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Shift;
