import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit"; // Import icons

const Benefits = () => {
  const [benefits, setBenefits] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [employeePosition, setEmployeePosition] = useState("");
  const [ssSChecked, setSssChecked] = useState(false);
  const [pagIbigChecked, setPagIbigChecked] = useState(false);
  const [philHealthChecked, setPhilHealthChecked] = useState(false);
  const [leaveChecked, setLeaveChecked] = useState(false);
  const [thirteenthMonthChecked, setThirteenthMonthChecked] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Search state
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success", // success or error
  });

  const positions = [
    {
      name: "Nurse",
      benefits: {
        sss: true,
        pagIbig: true,
        philHealth: true,
        leave: true,
        thirteenthMonth: true,
      },
    },
    {
      name: "Doctor",
      benefits: {
        sss: true,
        pagIbig: true,
        philHealth: true,
        leave: true,
        thirteenthMonth: true,
      },
    },
    {
      name: "Pharmacist",
      benefits: {
        sss: true,
        pagIbig: true,
        philHealth: true,
        leave: true,
        thirteenthMonth: true,
      },
    },
    {
      name: "Physical Therapist",
      benefits: {
        sss: true,
        pagIbig: true,
        philHealth: true,
        leave: true,
        thirteenthMonth: true,
      },
    },
    {
      name: "Administrative Staff",
      benefits: {
        sss: true,
        pagIbig: true,
        philHealth: true,
        leave: true,
        thirteenthMonth: true,
      },
    },
  ];

  useEffect(() => {
    fetchBenefits();
  }, []);

  useEffect(() => {
    const selectedPosition = positions.find(
      (pos) => pos.name === employeePosition
    );
    if (selectedPosition) {
      setSssChecked(selectedPosition.benefits.sss);
      setPagIbigChecked(selectedPosition.benefits.pagIbig);
      setPhilHealthChecked(selectedPosition.benefits.philHealth);
      setLeaveChecked(selectedPosition.benefits.leave);
      setThirteenthMonthChecked(selectedPosition.benefits.thirteenthMonth);
    } else {
      resetCheckboxes();
    }
  }, [employeePosition]);

  const fetchBenefits = async () => {
    try {
      const response = await axios.get("http://localhost:8055/benefits");
      setBenefits(response.data);
    } catch (error) {
      console.error("Error fetching benefits:", error);
    }
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    const benefitData = {
      employeeName,
      employeePosition,
      sss: ssSChecked,
      pagIbig: pagIbigChecked,
      philHealth: philHealthChecked,
      leave: leaveChecked,
      thirteenthMonth: thirteenthMonthChecked,
    };

    if (editIndex !== null) {
      try {
        await axios.put(
          `http://localhost:8055/benefits/${benefits[editIndex]._id}`,
          benefitData
        );
        const updatedBenefits = [...benefits];
        updatedBenefits[editIndex] = {
          ...updatedBenefits[editIndex],
          ...benefitData,
        };
        setBenefits(updatedBenefits);
        setEditIndex(null);
        showNotification("Employee's Benefits updated successfully!", "success");
      } catch (error) {
        showNotification("Error updating benefit", "error");
        console.error("Error updating benefit:", error);
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:8055/benefits",
          benefitData
        );
        setBenefits([...benefits, response.data]);
        showNotification("Employee's Benefits added successfully!", "success");
      } catch (error) {
        showNotification("Error adding benefit", "error");
        console.error("Error adding benefit:", error);
      }
    }
    resetForm();
  };

  const handleEdit = (index) => {
    const benefit = benefits[index];
    setEmployeeName(benefit.employeeName);
    setEmployeePosition(benefit.employeePosition);
    setSssChecked(benefit.sss);
    setPagIbigChecked(benefit.pagIbig);
    setPhilHealthChecked(benefit.philHealth);
    setLeaveChecked(benefit.leave);
    setThirteenthMonthChecked(benefit.thirteenthMonth);
    setEditIndex(index);
  };

  const handleDelete = async (index) => {
    const confirmed = window.confirm("Are you sure you want to delete this?");
    if (!confirmed) {
      console.log("Deletion cancelled.");
      return; // Exit the function if cancelled
    } else {
      console.log("Item will be deleted."); // Log or handle the confirmation if needed
    }
    
    try {
      await axios.delete(
        `http://localhost:8055/benefits/${benefits[index]._id}`
      );
      const updatedBenefits = benefits.filter((_, i) => i !== index);
      setBenefits(updatedBenefits);
      showNotification("Employee's Benefits deleted successfully!", "success");
    } catch (error) {
      showNotification("Error deleting benefit", "error");
      console.error("Error deleting benefit:", error);
    }
  };
  

  const resetForm = () => {
    setEmployeeName("");
    setEmployeePosition("");
    resetCheckboxes();
  };

  const resetCheckboxes = () => {
    setSssChecked(false);
    setPagIbigChecked(false);
    setPhilHealthChecked(false);
    setLeaveChecked(false);
    setThirteenthMonthChecked(false);
  };

  const filteredBenefits = benefits.filter((benefit) =>
    benefit.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type,
    });
    setTimeout(() => {
      setNotification({
        show: false,
        message: "",
        type: "",
      });
    }, 3000); // Hide notification after 3 seconds
  };

  return (
    <div className="bg-[#F0F0F0] mt-16">
      <div className="bg-[#F0F0F0] md:grid-cols-2 gap-4 mt-8 p-4">
        {notification.show && (
          <div
            className={`fixed top-20 right-5 p-4 border rounded flex items-center  space-x-2 transition-opacity duration-500 ease-in-out ${
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

        <div className="bg-[#F0F0F0]  rounded-lg mb-6">
          <form
            className="bg-[white] shadow-md rounded-lg p-4 sm:p-3 mb-4 sm:mb-8"
            onSubmit={handleAddOrUpdate}
          >
            <h1 className="text-3xl font-bold mb-4 p-4 text-gray-800">
            Employee's  Benefits
            </h1>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Search Employee
                </label>
                <input
                  type="text"
                  placeholder="Search Employee's Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#090367]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Employee's name
                </label>
                <input
                  type="text"
                  placeholder="Employee's Name"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  required
                  className="border border-gray-300 p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-[#090367]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Position
                </label>
                <select
                  value={employeePosition}
                  onChange={(e) => setEmployeePosition(e.target.value)}
                  required
                  className="border border-gray-300 p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-[#090367]"
                >
                  <option value="">Choose a Position</option>
                  {positions.map((position, index) => (
                    <option key={index} value={position.name}>
                      {position.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Benefits:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="flex items-center">
                    <input
                      id="sss"
                      type="checkbox"
                      checked={ssSChecked}
                      onChange={(e) => setSssChecked(e.target.checked)}
                      className="focus:ring-[#389485] text-[#389485] border-gray-300 rounded"
                    />
                    <label
                      htmlFor="sss"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      SSS
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="pagIbig"
                      type="checkbox"
                      checked={pagIbigChecked}
                      onChange={(e) => setPagIbigChecked(e.target.checked)}
                      className="focus:ring-[#389485] text-[#389485] border-gray-300 rounded"
                    />
                    <label
                      htmlFor="pagIbig"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Pag-Ibig
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="philHealth"
                      type="checkbox"
                      checked={philHealthChecked}
                      onChange={(e) => setPhilHealthChecked(e.target.checked)}
                      className="focus:ring-[#389485] text-[#389485] border-gray-300 rounded"
                    />
                    <label
                      htmlFor="philHealth"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      PhilHealth
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="leave"
                      type="checkbox"
                      checked={leaveChecked}
                      onChange={(e) => setLeaveChecked(e.target.checked)}
                      className="focus:ring-[#389485] text-[#389485] border-gray-300 rounded"
                    />
                    <label
                      htmlFor="leave"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      leave
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="thirteenthMonth"
                      type="checkbox"
                      checked={thirteenthMonthChecked}
                      onChange={(e) =>
                        setThirteenthMonthChecked(e.target.checked)
                      }
                      className="focus:ring-[#389485] text-[#389485] border-gray-300 rounded"
                    />
                    <label
                      htmlFor="thirteenthMonth"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      13th Month
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-2 ml-8">
                <button
                  type="submit"
                  className="mt-4 py-2 px-4 bg-[#090367] text-white font-semibold rounded-md shadow-md hover:bg-[#EA0D10] transition-colors duration-200"
                >
                  {editIndex !== null ? "Update Benefit" : "Add Benefit"}
                </button>
              </div>
            </div>
          </form>

          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead className="min-w-full bg-white shadow-md rounded-lg">
                <tr className="bg-[#090367] text-white text-xs sm:text-sm leading-normal">
                  <th className="border px-4 sm:px-6 py-2">Employee Name</th>
                  <th className="border px-4 sm:px-6 py-2">Position</th>
                  <th className="border px-4 sm:px-6 py-2">SSS</th>
                  <th className="border px-4 sm:px-6 py-2">Pag-Ibig</th>
                  <th className="border px-4 sm:px-6 py-2">PhilHealth</th>
                  <th className="border px-4 sm:px-6 py-2">Leave</th>
                  <th className="border px-4 sm:px-6 py-2">13th Month</th>
                  <th className="border px-4 sm:px-6 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className=" text-xs sm:text-sm">
                {filteredBenefits.length > 0 ? (
                  filteredBenefits.map((benefit, index) => (
                    <tr
                      key={index}
                      className="text-xs sm:text-sm  bg-white hover:bg-gray-100"
                    >
                      <td className="border border-gray-300 p-2">
                        {benefit.employeeName}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {benefit.employeePosition}
                      </td>
                      <td className="border  border-gray-300 p-2">
                        {benefit.sss ? (
                          <FaCheckCircle className="text-green-600" />
                        ) : (
                          <FaTimesCircle className="text-red-600" />
                        )}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {benefit.pagIbig ? (
                          <FaCheckCircle className="text-green-600" />
                        ) : (
                          <FaTimesCircle className="text-red-600" />
                        )}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {benefit.philHealth ? (
                          <FaCheckCircle className="text-green-600" />
                        ) : (
                          <FaTimesCircle className="text-red-600" />
                        )}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {benefit.leave ? (
                          <FaCheckCircle className="text-green-600" />
                        ) : (
                          <FaTimesCircle className="text-red-600" />
                        )}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {benefit.thirteenthMonth ? (
                          <FaCheckCircle className="text-green-600" />
                        ) : (
                          <FaTimesCircle className="text-red-600" />
                        )}
                      </td>
                      <td className="border border-gray-300 p-2 flex justify-center">
                        <button
                          onClick={() => handleEdit(index)}
                          className="cursor-pointer text-blue-500 hover:text-[#090367]"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="cursor-pointer text-red-500 hover:text-[#EA0D10]"
                        >
                          <DeleteIcon />
                        </button>
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
        <footer className="bg-white mt-36 p-4 rounded-md shadow-md">
          <p>2024 Hospital Management System. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Benefits;
