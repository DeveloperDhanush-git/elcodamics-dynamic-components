import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";

const Settings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [hasEdited, setHasEdited] = useState(false); // Track if user made changes

  const handleEditClick = () => {
    if (isEditing) {
      // If already editing and clicked again, show alert and disable editing
      alert("Successfully Edited!");
      setIsEditing(false);
    } else {
      // Enable editing for the first time
      setIsEditing(true);
      setHasEdited(true); // Track changes
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">General Settings</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">Company Profile</h2>
          <p className="text-sm text-gray-500">This will be displayed on your profile</p>
        </div>
        <button
          className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-lg flex items-center mr-2"
          onClick={handleEditClick}
        >
          <FaEdit className="mr-2" /> {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      {/* Profile Name Section */}
      <div className="pb-6 border-b border-gray-300 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-lg font-semibold">Profile Name</h2>
            <p className="text-sm text-gray-500">This will be displayed on your profile</p>
          </div>
          <div className="md:col-span-2 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Display name"
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">URL</label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="co.co/profile/Displayname"
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Other Information Section */}
      <div className="pb-6 border-b border-gray-300 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h2 className="text-lg font-semibold">Other Information</h2>
            <p className="text-sm text-gray-500">Update your company logo and then choose where to place it.</p>
          </div>
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="+88 0234 123 45678"
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="www.yourinfo@gmail.com"
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Company Logo Upload Section */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h2 className="text-lg font-semibold">Other Information</h2>
            <p className="text-sm text-gray-500">Update your company logo and then choose where to place it.</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Company Logo</label>
            <div className="flex items-center">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <p className="mb-2 text-sm text-gray-500">📂 Drag & Drop file here</p>
                  <p className="text-xs text-gray-500">or click to browse (4MB max)</p>
                </div>
                <input type="file" className="hidden" disabled={!isEditing} />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
