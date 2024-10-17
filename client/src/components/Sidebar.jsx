import React from "react";
import { Link } from "react-router-dom";
import GridViewIcon from "@mui/icons-material/GridView"; // Import icons
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Import icons
import RedeemIcon from "@mui/icons-material/Redeem"; // Import icons
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"; // Import icons
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import AvTimerIcon from "@mui/icons-material/AvTimer";

const Sidebar = ({ isOpen }) => {
  return (
    <div
      className={`fixed left-0 top-0 h-full bg-[#090367] text-white w-64 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="flex justify-center items-center p-4 mt-2">
        <h1 className={`text-2xl font-bold ${!isOpen && "hidden"}`}>
          <span className="text-[#EA0D10]">HR</span> HOSPITAL
        </h1>
      </div>

      <nav className="flex flex-col p-5 mt-10">
        <span className={`text-sm ${!isOpen && "hidden"}`}>DASHBOARD</span>
        <Link
          to="/"
          className="flex items-center p-2 mt-5 hover:bg-[#EA0D10] rounded-md"
        >
          <GridViewIcon />
          <span className={`ml-4 ${!isOpen && "hidden"}`}>Dashboard</span>
        </Link>

        <br />
        <span className={`text-sm ${!isOpen && "hidden"}`}>COMPENSATION</span>
        <Link
          to="/overtimemanagement"
          className="flex items-center p-2 mt-5 hover:bg-[#EA0D10] rounded-md"
        >
          <AccessTimeIcon />
          <span className={`ml-4 ${!isOpen && "hidden"}`}>Overtime</span>
        </Link>
        <Link
          to="/shift"
          className="flex items-center p-2 mt-5 hover:bg-[#EA0D10] rounded-md"
        >
          <AvTimerIcon />
          <span className={`ml-4 ${!isOpen && "hidden"}`}>Shift</span>
        </Link>
        <Link
          to="/incentives"
          className="flex items-center p-2 mt-5 hover:bg-[#EA0D10] rounded-md"
        >
          <RedeemIcon />
          <span className={`ml-4 ${!isOpen && "hidden"}`}>Incentives</span>
        </Link>
        <br />
        <span className={`text-sm ${!isOpen && "hidden"}`}>BENEFITS</span>
        <Link
          to="/benefits"
          className="flex items-center p-2 mt-5 hover:bg-[#EA0D10] rounded-md"
        >
          <MedicalServicesOutlinedIcon />
          <span className={`ml-4 ${!isOpen && "hidden"}`}>Benefits</span>
        </Link>
        <Link
          to="/leave"
          className="flex items-center p-2 mt-5 hover:bg-[#EA0D10] rounded-md"
        >
          <CalendarMonthIcon />
          <span className={`ml-4 ${!isOpen && "hidden"}`}>Leave</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
