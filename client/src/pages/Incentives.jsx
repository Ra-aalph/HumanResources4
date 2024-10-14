import React, { useState, useEffect } from "react";
import { FaStar, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit"; // Import icons
import axios from "axios";

const Incentives = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    salary: "",
    incentives: 0,
  });
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  }); // Notification state

  const positions = [
    { name: "Doctor", salary: 70000 },
    { name: "Nurse", salary: 35000 },
    { name: "Pharmacist", salary: 25000 },
    { name: "Physical Therapist", salary: 20000 },
    { name: "Administrative Staff", salary: 15000 },
  ];

  useEffect(() => {
    fetchIncentives(); // Fetch incentives when component mounts
  }, []);

  useEffect(() => {
    console.log("Search Term:", searchTerm);
    console.log("Employees List:", employees);
    setFilteredEmployees(
      employees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.position.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, employees]);

  const fetchIncentives = async () => {
    try {
      const response = await axios.get("http://localhost:8055/incentives");
      if (response.data.length === 0) {
        console.log("No employee data available");
      }
      setEmployees(response.data);
      console.log("Employees fetched:", response.data); // Log fetched data
    } catch (error) {
      console.error("Error fetching incentives:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      salary:
        name === "position"
          ? positions.find((pos) => pos.name === value).salary
          : prevData.salary,
    }));
  };

  const handleStarClick = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      incentives: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalSalary =
      parseFloat(formData.salary) + formData.incentives * 1000; // Example incentive value

    try {
      if (editIndex !== null) {
        // Update existing employee
        const updatedEmployee = { ...formData, totalSalary };
        await axios.put(
          `http://localhost:8055/incentives/${employees[editIndex]._id}`,
          updatedEmployee
        );
        const updatedEmployees = [...employees];
        updatedEmployees[editIndex] = updatedEmployee;
        setEmployees(updatedEmployees);
        setEditIndex(null); // Reset edit index after updating
        showNotification("success", "Employee updated successfully!"); // Show success notification
      } else {
        // Create new employee
        const newEmployee = { ...formData, totalSalary };
        const response = await axios.post(
          "http://localhost:8055/incentives",
          newEmployee
        );
        setEmployees((prevEmployees) => [...prevEmployees, response.data]);
        showNotification("success", "Employee added successfully!"); // Show success notification
      }
      setFormData({ name: "", position: "", salary: "", incentives: 0 });
    } catch (error) {
      console.error("Error saving employee:", error);
      showNotification("error", "Error saving employee!"); // Show error notification
    }
  };

  const handleDelete = async (index) => {
    const confirmed = window.confirm("Are you sure you want to delete this?");
    if (!confirmed) {
      return; // If the user cancels, exit the function
    }
    try {
      await axios.delete(
        `http://localhost:8055/incentives/${employees[index]._id}`
      );
      setEmployees((prevEmployees) =>
        prevEmployees.filter((_, i) => i !== index)
      );
      showNotification("success", "Employee deleted successfully!"); // Show success notification
    } catch (error) {
      console.error("Error deleting employee:", error);
      showNotification("error", "Error deleting employee!"); // Show error notification
    }
  };

  const handleEdit = (index) => {
    setFormData(employees[index]);
    setEditIndex(index);
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" }); // Hide notification after 3 seconds
    }, 3000);
  };

  // Function to format currency
  const formatCurrency = (amount) => {
    return `₱${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  return (
    <div className="bg-[#F0F0F0] mt-16 ">
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

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="bg-[white] shadow-md rounded-lg p-4 sm:p-3 mb-4 sm:mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold p-4 mb-8 sm:mb-6 text-gray-800">
          Employee's Incentives
        </h1>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Search Employee
            </label>
            <input
              type="text"
              placeholder="Search Employee's Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Employee's Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Employee's Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Position
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#090367]"
              required
            >
              <option value="">Choose Position</option>
              {positions.map((pos) => (
                <option key={pos.name} value={pos.name}>
                  {pos.name}
                </option>
              ))}
            </select>
          </div>
          <div className=" flex grid-cols-1 mt-10 sm:grid-cols-3 gap-1 mb-1">
            <span className="mr-3">Incentives (Rate 1-5):</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer ${
                  formData.incentives >= star
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}
                onClick={() => handleStarClick(star)}
              />
            ))}
          </div>
          <div className="mt-2 ml-8">
            <button
              type="submit"
              className="mt-4 py-2 px-4 bg-[#090367] text-white font-semibold rounded-md shadow-md hover:bg-[#EA0D10] transition-colors duration-200"
            >
              {editIndex !== null ? "Update Incentives" : "Add Incentives"}
            </button>
          </div>
        </div>
      </form>

      {/* Employee List Section */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md table-container">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr className="bg-[#090367] text-white text-xs sm:text-sm leading-normal">
              <th className="border px-4 sm:px-6 py-2">Employee Name</th>
              <th className="border px-4 sm:px-6 py-2">Position</th>
              <th className="border px-4 sm:px-6 py-2">Salary(Monthly)</th>
              <th className="border px-4 sm:px-6 py-2">Incentives</th>
              <th className="border px-4 sm:px-6 py-2">Total salary</th>
              <th className="border px-4 sm:px-6 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className=" text-xs sm:text-sm">
            {filteredEmployees.map((emp, index) => (
              <tr
                key={index}
                className="text-xs sm:text-sm bg-white hover:bg-gray-100"
              >
                <td className="border border-gray-300 p-2">{emp.name}</td>
                <td className="border border-gray-300 p-2">{emp.position}</td>
                <td className="border border-gray-300 p-2">
                  {formatCurrency(emp.salary)}
                </td>
                <td className="border border-gray-300 p-2">{emp.incentives}</td>
                <td className="border border-gray-300 p-2">
                  {formatCurrency(emp.totalSalary)}
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
            ))}
          </tbody>
          {filteredEmployees.length === 0 && (
            <tbody>
              <tr>
                <td colSpan={6} className="text-center py-4  text-sm">
                  No Employee Found.
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      <footer className="bg-white mt-36 p-4 rounded-md shadow-md">
          <p>2024 Hospital Management System. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Incentives;
