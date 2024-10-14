import React, { useState } from "react";
import { FaUserAlt, FaEnvelope, FaPhone, FaCamera } from "react-icons/fa";
import Profile from "../images/profile.png"; 

const AdminProfile = () => {
  const [open, setOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [adminDetails, setAdminDetails] = useState({
    name: "Juan Dela Cruz",
    email: "adminhr@nodadohospital.com",
    phone: "+1234567890",
    position: "HR Admin",
    profilePicture: Profile, // Use the imported image
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminDetails((prevDetails) => ({
          ...prevDetails,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    handleClose();
  };

  const handleChangePasswordOpen = () => {
    setChangePasswordOpen(true);
  };

  const handleChangePasswordClose = () => {
    setChangePasswordOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleChangePasswordSave = () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    console.log("Changing password from", currentPassword, "to", newPassword);
    handleChangePasswordClose();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <div className="relative">
          <img
            alt={adminDetails.name}
            src={adminDetails.profilePicture}
            className="w-24 h-24 rounded-full"
          />
          <label htmlFor="upload-image" className="absolute bottom-0 right-0 mb-2 mr-2 cursor-pointer">
            <FaCamera className="text-white bg-[#090367] rounded-full p-1" />
          </label>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="upload-image"
            type="file"
            onChange={handleImageChange}
          />
        </div>
        <h2 className="text-xl font-semibold mt-4">{adminDetails.name}</h2>
        <span className="text-gray-600 mb-2">{adminDetails.position}</span>
        <div className="flex flex-col items-start mt-2 w-full">
          <div className="flex items-center mt-2">
            <FaUserAlt className="text-gray-600 mr-2" />
            <span className="text-gray-800">{adminDetails.name}</span>
          </div>
          <div className="flex items-center mt-2">
            <FaEnvelope className="text-gray-600 mr-2" />
            <span className="text-gray-800">{adminDetails.email}</span>
          </div>
          <div className="flex items-center mt-2">
            <FaPhone className="text-gray-600 mr-2" />
            <span className="text-gray-800">{adminDetails.phone}</span>
          </div>
        </div>
        <div className="flex space-x-2 mt-4">
          <button
            className="bg-[#090367] text-white py-2 px-4 rounded hover:bg-red-600"
            onClick={handleClickOpen}
          >
            Edit profile
          </button>
          <button
            className="border border-[#090367] text-[#090367] py-2 px-4 rounded hover:border-red-600 hover:text-red-600"
            onClick={handleChangePasswordOpen}
          >
            Change password
          </button>
        </div>
        {/* Modal for Editing Profile */}
        {open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-500 ease-in-out">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
              <div className="flex flex-col items-center mb-4">
                <img
                  alt={adminDetails.name}
                  src={adminDetails.profilePicture}
                  className="w-24 h-24 rounded-full"
                />
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="upload-image-edit"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="upload-image-edit">
                  <span className="cursor-pointer">
                    <FaCamera />
                  </span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Employee's Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={adminDetails.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="border border-gray-300 rounded p-2 w-full mb-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={adminDetails.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="border border-gray-300 rounded p-2 w-full mb-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Cellphone Number:
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={adminDetails.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="border border-gray-300 rounded p-2 w-full mb-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Position:
                </label>
                <input
                  type="text"
                  name="position"
                  value={adminDetails.position}
                  onChange={handleChange}
                  placeholder="Position"
                  className="border border-gray-300 rounded p-2 w-full mb-2"
                  disabled
                />
              </div>
              <div className="flex justify-end mt-4">
                <button className="mr-2" onClick={handleClose}>
                  Cancel
                </button>
                <button
                  className="bg-[#090367] text-white py-2 px-4 rounded"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Modal for Changing Password */}
        {changePasswordOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-500 ease-in-out">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Change Password</h3>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Current Password:
                </label>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="border border-gray-300 rounded p-2 w-full mb-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  New Password:
                </label>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border border-gray-300 rounded p-2 w-full mb-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Confirm New Password:
                </label>
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border border-gray-300 rounded p-2 w-full mb-4"
                />
              </div>
              <div className="flex justify-end">
                <button className="mr-2" onClick={handleChangePasswordClose}>
                  Cancel
                </button>
                <button
                  className="bg-[#090367] text-white py-2 px-4 rounded"
                  onClick={handleChangePasswordSave}
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
