import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  // Overtime Data
  const overtimeData = {
    labels: ["Jose Manalo", "Coco Martin", "Vic Sotto", "Lebron James"],
    datasets: [
      {
        label: "Overtime Hours (This Month)",
        data: [5, 2, 7, 10],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const overtimeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Overtime Hours Graph",
      },
    },
  };

  // Employee Ratings Data
  const ratingsData = {
    labels: ["Jose Manalo", "Coco Martin", "Vic Sotto", "Lebron James"],
    datasets: [
      {
        label: "Ratings (1-5)",
        data: [5, 3, 4, 2],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const ratingsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Employee's Incentives Ratings Graph",
      },
    },
  };

  // Employee Benefits Data
  const benefitsData = {
    labels: ["SSS", "Pag-Ibig", "PhilHealth", "Paid Leave", "13th Month"],
    datasets: [
      {
        label: "Benefits",
        data: [6, 6, 6, 6, 6],
        backgroundColor: [
          "rgba(0, 47, 108, 1)",
          "rgba(255, 204, 0, 1)",
          "rgba(0, 128, 0, 1)",
          "rgba(205, 127, 50, 1)",
          "rgba(147, 112, 219, 1)",
        ],
        borderColor: [
          "rgba(0, 47, 108, 1)",
          "rgba(255, 204, 0, 1)",
          "rgba(0, 128, 0, 1)",
          "rgba(205, 127, 50, 1)",
          "rgba(147, 112, 219, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const benefitsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Benefits Distribution Graph",
      },
    },
  };

  // Leave List Data
  const leaveData = [
    {
      name: "Jose Manalo",
      position: "Nurse",
      type: "Sick Leave",
      startDate: "10/01/2024",
      endDate: "10/05/2024",
      status: "Approved",
    },
    {
      name: "Lebron James",
      position: "Doctor",
      type: "Vacation Leave",
      startDate: "09/15/2024",
      endDate: "09/15/2024",
      status: "Pending",
    },
    {
      name: "Kai Sotto",
      position: "Nurse",
      type: "Vacation Leave",
      startDate: "10/19/2024",
      endDate: "10/25/2024",
      status: "Rejected",
    },
  ];

  // Shift Differential Data
  const shiftData = [
    {
      name: "Jose Manalo",
      position: "Nurse",
      shiftType: "Night Shift",
    },
    {
      name: "Lebron James",
      position: "Doctor",
      shiftType: "Weekend Shift",
    },
    {
      name: "Coco Martin",
      position: "Nurse",
      shiftType: "Holiday Shift",
    },
  ];

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
    <div className="bg-[#F0F0F0]">
      {/* Welcome Message */}
      <div className="bg-white mt-16 p-6 rounded-md shadow-lg">
        <p className="text-xl text-[#090367] font-semibold">Dashboard</p>
        <h1 className="text-4xl font-bold mt-2">Welcome, Juan Dela Cruz!</h1>
      </div>

      <div className="bg-[#F0F0F0] grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Compensation Section */}
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Compensation</h2>
          <div className="mb-4" style={{ height: "200px" }}>
            <Bar data={overtimeData} options={overtimeOptions} />
          </div>
          <div className="mb-4" style={{ height: "200px" }}>
            <Bar data={ratingsData} options={ratingsOptions} />
          </div>

          {/* Shift Differential Management Table */}
          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2">
              Employee Shift Differential List
            </h3>
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead className="bg-gray-100">
                <tr className="bg-[#090367] text-white text-xs sm:text-sm leading-normal">
                  <th className="py-1 px-2 border">Employee Name</th>
                  <th className="py-1 px-2 border">Position</th>
                  <th className="py-1 px-2 border">Shift Type</th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm">
                {shiftData.map((shift, index) => (
                  <tr
                    key={index}
                    className="text-xs sm:text-sm bg-white hover:bg-gray-100"
                  >
                    <td className="py-1 px-2 border">{shift.name}</td>
                    <td className="py-1 px-2 border">{shift.position}</td>
                    <td className="py-1 px-2 border">{shift.shiftType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Benefits</h2>
          <div className="mb-4" style={{ height: "400px" }}>
            <Pie data={benefitsData} options={benefitsOptions} />
          </div>

          {/* Leave Management Table */}
          <h3 className="text-md font-semibold mb-2">Employee Leave List</h3>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md table-container">
           
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead className="bg-gray-100">
                <tr className="bg-[#090367] text-white text-xs sm:text-sm leading-normal">
                  <th className="py-1 px-2 border">Employee Name</th>
                  <th className="py-1 px-2 border">Position</th>
                  <th className="py-1 px-2 border">Leave Type</th>
                  <th className="py-1 px-2 border">Start</th>
                  <th className="py-1 px-2 border">End</th>
                  <th className="py-1 px-2 border">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm">
                {leaveData.map((leave, index) => (
                  <tr
                    key={index}
                    className="text-xs sm:text-sm bg-white hover:bg-gray-100"
                  >
                    <td className="py-1 px-2 border">{leave.name}</td>
                    <td className="py-1 px-2 border">{leave.position}</td>
                    <td className="py-1 px-2 border">{leave.type}</td>
                    <td className="py-1 px-2 border">{leave.startDate}</td>
                    <td className="py-1 px-2 border">{leave.endDate}</td>
                    <td className={`py-1 px-2 border ${getStatusColor(leave.status)}`}>
                      {leave.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <footer className="bg-white mt-32 p-4 rounded-md shadow-md">
        <p>2024 Hospital Management System. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
