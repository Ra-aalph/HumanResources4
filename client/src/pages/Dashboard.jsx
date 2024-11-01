import React, { useEffect, useState } from "react";
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
import { FaUsers } from "react-icons/fa";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NightlightIcon from "@mui/icons-material/Nightlight";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import FlagIcon from "@mui/icons-material/Flag";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";

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
  const [shiftCounts, setShiftCounts] = useState({});
  const [leaveCounts, setLeaveCounts] = useState({});
  const [overtimeData, setOvertimeData] = useState({ labels: [], data: [] });
  const [benefitsData, setBenefitsData] = useState({
    labels: ["SSS", "Pag-Ibig", "PhilHealth", "Paid Leave", "13th Month"],
    datasets: [
      {
        label: "Benefits",
        data: [0, 0, 0, 0, 0], // Initialize with zeros
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
  });
  const [ratingsData, setRatingsData] = useState({
    labels: [],
    datasets: [
      {
        label: "Incentives Ratings",
        data: [],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchShiftCounts = async () => {
      try {
        const response = await fetch("http://localhost:8055/shifts");
        const data = await response.json();
        const counts = data.reduce((acc, shift) => {
          const { shiftType } = shift;
          acc[shiftType] = (acc[shiftType] || 0) + 1;
          return acc;
        }, {});
        setShiftCounts(counts);
      } catch (error) {
        console.error("Error fetching shift counts:", error);
      }
    };

    const fetchLeaveCounts = async () => {
      try {
        const response = await fetch("http://localhost:8055/leaves");
        const data = await response.json();
        const counts = data.reduce((acc, leave) => {
          const { status } = leave;
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        setLeaveCounts(counts);
      } catch (error) {
        console.error("Error fetching leave counts:", error);
      }
    };

    const fetchOvertimeData = async () => {
      try {
        const response = await fetch("http://localhost:8055/overtimes");
        const data = await response.json();
        const sortedData = data
          .sort((a, b) => b.overtimeHours - a.overtimeHours)
          .slice(0, 4);

        const labels = sortedData.map(item => item.name);
        const overtimeHours = sortedData.map(item => item.overtimeHours);

        setOvertimeData({
          labels,
          data: overtimeHours,
        });
      } catch (error) {
        console.error("Error fetching overtime data:", error);
      }
    };

    const fetchBenefitsData = async () => {
      try {
        const response = await fetch("http://localhost:8055/benefits");
        const data = await response.json();

        // Extracting the required benefit values
        const sssCount = data.reduce((acc, benefit) => acc + benefit.sss, 0);
        const pagIbigCount = data.reduce((acc, benefit) => acc + benefit.pagIbig, 0);
        const philHealthCount = data.reduce((acc, benefit) => acc + benefit.philHealth, 0);
        const leaveCount = data.reduce((acc, benefit) => acc + benefit.leave, 0);
        const thirteenthMonthCount = data.reduce((acc, benefit) => acc + benefit.thirteenthMonth, 0);

        // Update the benefits chart data
        setBenefitsData(prevState => ({
          ...prevState,
          datasets: [
            {
              ...prevState.datasets[0],
              data: [
                sssCount,
                pagIbigCount,
                philHealthCount,
                leaveCount,
                thirteenthMonthCount,
              ],
            },
          ],
        }));
      } catch (error) {
        console.error("Error fetching benefits data:", error);
      }
    };

    // New function to fetch incentives data
    const fetchIncentivesData = async () => {
      try {
        const response = await fetch("http://localhost:8055/incentives");
        const data = await response.json();

        // Extracting names and incentives for the ratings graph
        const incentivesData = data.map(item => ({
          name: item.name,
          incentives: item.incentives,
        }));

        // Sort by incentives and get top 4
        const topIncentives = incentivesData
          .sort((a, b) => b.incentives - a.incentives)
          .slice(0, 4);

        const names = topIncentives.map(item => item.name);
        const incentives = topIncentives.map(item => item.incentives);

        setRatingsData({
          labels: names,
          datasets: [
            {
              ...ratingsData.datasets[0],
              data: incentives,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching incentives data:", error);
      }
    };

    fetchShiftCounts();
    fetchLeaveCounts();
    fetchOvertimeData();
    fetchBenefitsData();
    fetchIncentivesData(); // Fetch incentives data on component mount
  }, []);

  // Overtime Chart Data (Unchanged)
  const overtimeChartData = {
    labels: overtimeData.labels,
    datasets: [
      {
        label: "Overtime Hours (This Month)",
        data: overtimeData.data,
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
        text: "Employee's Overtime Hours Graph",
      },
    },
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

  const benefitsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Employee's Benefits Distribution Graph",
      },
    },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-200 text-green-800";
      case "Rejected":
        return "bg-red-200 text-red-800";
      case "Pending":
      default:
        return "bg-yellow-200 text-yellow-800";
    }
  };
  return (
    <div className="bg-[#F0F0F0]">
      {/* Welcome Message */}
      <div className="bg-white mt-16 p-6 rounded-md shadow-lg">
        <p className="text-xl text-[#090367] font-semibold">Dashboard</p>
      </div>

      <div className="bg-[#F0F0F0] grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Compensation Section */}
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Compensation</h2>
          <div className="mb-4" style={{ height: "200px" }}>
            <Bar data={overtimeChartData} options={overtimeOptions} />
          </div>
          <div className="mb-4" style={{ height: "200px" }}>
            <Bar data={ratingsData} options={ratingsOptions} />
          </div>

          {/* Shift Counts Display */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaUsers className="mr-2" />
              Employee's Shift Counts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Object.entries(shiftCounts).map(([shiftType, count]) => (
                <div
                  key={shiftType}
                  className="flex items-center p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Conditional Icons */}
                  {shiftType === "Regular Shift" && (
                    <AccessTimeIcon
                      className="mr-3 text-blue-600"
                      fontSize="large"
                    />
                  )}
                  {shiftType === "Night Shift" && (
                    <NightlightIcon
                      className="mr-3 text-indigo-700"
                      fontSize="large"
                    />
                  )}
                  {shiftType === "Weekend Shift" && (
                    <WbSunnyIcon
                      className="mr-3 text-yellow-600"
                      fontSize="large"
                    />
                  )}
                  {shiftType === "Holiday Shift" && (
                    <FlagIcon className="mr-3 text-red-600" fontSize="large" />
                  )}

                  <span className="text-base font-medium">
                    {shiftType}: <span className="font-bold">{count}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Benefits</h2>
          <div className="mb-4" style={{ height: "400px" }}>
            <Pie data={benefitsData} options={benefitsOptions} />
          </div>

          {/* Leave Counts Display */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaUsers className="mr-2" />
              Employee's Leave Requests
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Object.entries(leaveCounts).map(([status, count]) => (
                <div
                  key={status}
                  className={`flex items-center p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ${getStatusColor(
                    status
                  )}`}
                >
                  {/* Conditional Icons */}
                  {status === "Approved" && (
                    <CheckCircleIcon className="mr-3" fontSize="large" />
                  )}
                  {status === "Rejected" && (
                    <CancelIcon className="mr-3" fontSize="large" />
                  )}
                  {status === "Pending" && (
                    <HourglassEmptyIcon className="mr-3" fontSize="large" />
                  )}

                  <span className="text-base font-medium">
                    {status}: <span className="font-bold">{count}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
