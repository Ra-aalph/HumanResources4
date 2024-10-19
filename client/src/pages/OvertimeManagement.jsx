import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit"; // Import icons
import axios from "axios";
import "/src/index.css";

const OvertimeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    baseSalary: 0,
    overtimeHours: 0,
    totalSalary: 0,
    predictedOvertime: 0, // Added for predicted overtime
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [notification, setNotification] = useState({
    message: "",
    type: "",
    show: false,
  }); // Updated to include show
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const positions = [
    { position: "Doctor", baseSalary: 70000 },
    { position: "Nurse", baseSalary: 35000 },
    { position: "Pharmacist", baseSalary: 25000 },
    { position: "Physical Therapist", baseSalary: 20000 },
    { position: "Administrative Staff", baseSalary: 15000 },
  ];

  const calculateTotalSalary = (baseSalary, overtimeHours) => {
    const overtimeRate = 1.5; // Overtime hour rates
    const overtimePay = overtimeHours * (baseSalary / 264) * overtimeRate; // 264 - working hours per month
    return baseSalary + overtimePay;
  };

  const predictOvertime = (historicalData) => {
    // Simple predictive model based on average historical overtime hours
    if (historicalData.length === 0) return 0;
    const totalOvertime = historicalData.reduce(
      (sum, entry) => sum + entry.overtimeHours,
      0
    );
    return totalOvertime / historicalData.length; // Average overtime
  };

  const formatCurrency = (amount) => {
    return `₱${parseFloat(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8055/overtimes");
      setEmployees(response.data);
      const historicalData = response.data; // Assume historical data is here
      const predictedOvertime = predictOvertime(historicalData);
      setFormData((prev) => ({ ...prev, predictedOvertime }));
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, position, baseSalary, overtimeHours } = formData;
    const totalSalary = calculateTotalSalary(
      parseFloat(baseSalary),
      parseFloat(overtimeHours)
    );

    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:8055/overtimes/${employees[currentIndex]._id}`,
          {
            name,
            position,
            baseSalary,
            overtimeHours,
            totalSalary,
          }
        );
        setNotification({
          message: "Employee's Overtime updated successfully!",
          type: "success",
          show: true,
        });
      } else {
        await axios.post("http://localhost:8055/overtimes", {
          name,
          position,
          baseSalary,
          overtimeHours,
          totalSalary,
        });
        setNotification({
          message: "Employee added successfully!",
          type: "success",
          show: true,
        });
      }
      fetchEmployees();
    } catch (err) {
      console.error("Error saving employee:", err);
      setNotification({
        message: "Error occurred while saving employee.",
        type: "error",
        show: true,
      });
    }

    setFormData({
      name: "",
      position: "",
      baseSalary: 0,
      overtimeHours: 0,
      totalSalary: 0,
      predictedOvertime: 0, // Reset predicted overtime
    });
    setIsEditing(false);
    setCurrentIndex(null);

    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 3000);
  };

  const handleEdit = (index) => {
    const employee = employees[index];
    setFormData(employee);
    setIsEditing(true);
    setCurrentIndex(index);
  };

  const handleDelete = async (index) => {
    const confirmed = window.confirm("Are you sure you want to delete this?");
    if (!confirmed) {
      return; // If the user cancels, exit the function
    }
    try {
      await axios.delete(
        `http://localhost:8055/overtimes/${employees[index]._id}`
      );
      fetchEmployees();
      setNotification({
        message: "Employee's Overtime deleted successfully!",
        type: "success",
        show: true,
      });

      setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 5000);
    } catch (err) {
      console.error("Error deleting employee:", err);
      setNotification({
        message: "Error occurred while deleting employee.",
        type: "error",
        show: true,
      });
    }
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#F0F0F0] mt-16">
      <div className="bg-[#F0F0F0] md:grid-cols-2 gap-4 mt-8 p-4">
        <div
          className={`fixed top-30 right-5 p-4 border rounded flex items-center space-x-2 transition-opacity duration-500 ease-in-out ${
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

        <form
          className="bg-[white] shadow-md rounded-lg p-4 sm:p-3 mb-4 sm:mb-8"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl p-4 sm:text-3xl font-bold mb-8 sm:mb-6 text-gray-800">
            Overtime Management
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Search Employee
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Employee's Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
              />
            </div>

            {/* Existing form inputs */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Employee's Name
              </label>
              <input
                type="text"
                placeholder="Employee's Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Position
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={(e) => {
                  const selectedPosition = positions.find(
                    (pos) => pos.position === e.target.value
                  );
                  setFormData({
                    ...formData,
                    position: e.target.value,
                    baseSalary: selectedPosition
                      ? selectedPosition.baseSalary
                      : 0,
                  });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
                required
              >
                <option value="">Choose a Position</option>
                {positions.map((position) => (
                  <option key={position.position} value={position.position}>
                    {position.position}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Base Salary
              </label>
              <input
                type="text" // Changed type to text to accommodate the formatted currency
                placeholder="Base Salary"
                name="baseSalary"
                value={formatCurrency(formData.baseSalary)}
                readOnly // Made read-only, will be set based on position selection
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Overtime Hours
              </label>
              <input
                type="number"
                placeholder="Overtime Hours"
                name="overtimeHours"
                value={formData.overtimeHours}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Total Salary
              </label>
              <input
                type="text"
                placeholder="Total Salary"
                name="totalSalary"
                value={formatCurrency(
                  calculateTotalSalary(
                    formData.baseSalary,
                    formData.overtimeHours
                  )
                )}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>

            {/* Predicted Overtime */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Predicted Overtime (Next Month)
              </label>
              <input
                type="text"
                placeholder="Predicted Overtime"
                name="predictedOvertime"
                value={formData.predictedOvertime}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div className="mt-2 ml-8">
              <button
                type="submit"
                className="mt-4 py-2 px-4 bg-[#090367] text-white font-semibold rounded-md shadow-md hover:bg-[#EA0D10] transition-colors duration-200"
              >
                {isEditing ? "Update Overtime" : "Add Overtime"}
              </button>
            </div>
          </div>
        </form>

        {/* Employees List */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md table-container">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr className="bg-[#090367] text-white text-xs sm:text-sm leading-normal">
                <th className="border px-4 sm:px-6 py-2">Employee Name</th>
                <th className="border px-4 sm:px-6 py-2">Position</th>
                <th className="border px-4 sm:px-6 py-2">Base Salary</th>
                <th className="border px-4 sm:px-6 py-2">Overtime Hours</th>
                <th className="border px-4 sm:px-6 py-2">Total Salary</th>
                <th className="border px-4 sm:px-6 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className=" text-xs sm:text-sm">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee, index) => (
                  <tr
                    key={employee._id}
                    className="text-xs sm:text-sm bg-white hover:bg-gray-100"
                  >
                    <td className="border border-gray-300 p-2">
                      {employee.name}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {employee.position}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {formatCurrency(employee.baseSalary)}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {employee.overtimeHours}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {formatCurrency(employee.totalSalary)}
                    </td>
                    <td className="border border-gray-300 p-2 flex justify-center">
                      <button
                        onClick={() => handleEdit(index)}
                        className="text-blue-500 hover:text-[#090367]"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-red-500 hover:text-[#EA0D10]"
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4  text-sm">
                  No Employee Found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <footer className="bg-white mt-36 p-4 rounded-md shadow-md">
          <p>2024 Hospital Management System. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default OvertimeManagement;
