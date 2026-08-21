import { useState } from "react";

export default function Navbar() {

  const [open, setOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6 relative">

      <h2 className="text-lg font-semibold text-gray-800">
        Student Project Management System
      </h2>

      <div className="flex items-center gap-4 relative">

        <div className="text-sm text-gray-600">
          Welcome, {user?.name || "Student"}
        </div>

        {/* Avatar */}
        <div
          onClick={() => setOpen(!open)}
          className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center cursor-pointer"
        >
          {user?.name?.charAt(0) || "S"}
        </div>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-12 w-48 bg-white border rounded-lg shadow-md p-3 z-50">

            <p className="text-sm font-medium text-gray-800">
              {user?.name}
            </p>

            <p className="text-xs text-gray-500 mb-3">
              {user?.email}
            </p>

            <button
              onClick={handleLogout}
              className="w-full text-left text-sm text-red-500 hover:bg-red-50 px-2 py-2 rounded"
            >
              Logout
            </button>

          </div>
        )}

      </div>
    </div>
  );
}