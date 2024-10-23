import React, { useState } from "react";
import { IconButton } from "@mui/material";
import { Menu as MenuIcon, AccountCircle, ExpandMore, Person, ExitToApp } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [showDialog, setShowDialog] = useState(false); // For animation control
  const navigate = useNavigate();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    setOpenLogoutDialog(true); // Open the logout confirmation modal
    setTimeout(() => {
      setShowDialog(true); // Trigger the fade-in effect
    }, 100); // Delay to ensure smooth animation
  };

  const handleLogout = () => {
    setShowDialog(false); // Trigger fade-out effect
    setTimeout(() => {
      onLogout();
      navigate("/login");
    }, 300); // Wait for fade-out before redirect
  };

  const handleCloseDialog = () => {
    setShowDialog(false); // Trigger fade-out effect
    setTimeout(() => {
      setOpenLogoutDialog(false); // Close the dialog after animation
    }, 300); // Match the duration with the CSS transition
  };

  return (
    <header className="fixed bg-[#090367] py-4 px-4 flex justify-between items-center transition-all duration-300 text-white w-full">
      {/* Sidebar Toggle Button */}
      <IconButton onClick={toggleSidebar} sx={{ color: "white" }}>
        <MenuIcon />
      </IconButton>

      {/* User Profile Dropdown */}
      <div className="relative">
        <IconButton onClick={handleMenuClick} sx={{ color: "white" }}>
          <AccountCircle />
          <ExpandMore sx={{ ml: 1, color: "white" }} />
        </IconButton>

        {anchorEl && (
          <div
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
            onMouseLeave={handleCloseMenu}
          >
            <Link to="/adminprofile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              <Person className="mr-2" />
              Profile
            </Link>
            <button
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={handleLogoutClick}
            >
              <ExitToApp className="mr-2" />
              Logout
            </button>
          </div>
        )}

        {/* Logout Confirmation Dialog */}
        {openLogoutDialog && (
          <div
            className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out ${showDialog ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
          >
            <div
              className={`bg-white p-6 rounded-lg shadow-lg w-full max-w-md transform transition-transform duration-300 ease-in-out ${showDialog ? 'scale-100' : 'scale-95'}`}
            >
              <h2 className="text-lg font-semibold mb-4 text-black">Are you sure you want to logout?</h2>
              <p className="text-gray-700 mb-6">
                You will be redirected to the login page after logging out.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCloseDialog}
                  className="bg-gray-200 px-4 py-2 rounded-lg text-gray-800 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-4 py-2 rounded-lg text-white hover:bg-[#EA0D10]"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
