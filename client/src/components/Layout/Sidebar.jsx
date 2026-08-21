import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  PlusSquare,
  Upload,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  User2,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/student-dashboard",
  },
  {
    name: "Guide",
    icon: User2,
    path: "/student/guide",
  },
  {
    name: "Create Project",
    icon: PlusSquare,
    path: "/student/create-project",
  },
  {
    name: "Upload Files",
    icon: Upload,
    path: "/student/submission",
  },
  {
    name: "Feedback",
    icon: MessageSquare,
    path: "/student/feedback",
  },
];

export default function Sidebar({ collapsed, setCollapsed }) {

  const user = JSON.parse(localStorage.getItem("user"));
  // const [collapsed, setCollapsed] = useState(false)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div
      className={`fixed h-screen bg-white border-r border-gray-200 shadow-md transition-all duration-300 
    ${collapsed ? "w-19" : "w-64"} flex flex-col`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 text-white flex items-center justify-center rounded-md font-bold">
              P
            </div>
            {!collapsed && (
              <span className="text-lg font-semibold text-gray-800">
                ProjectHub
              </span>
            )}
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-gray-200"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu */}
      <div className="flex flex-col gap-2 mt-4 px-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg transition-all
                ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 border border-indigo-200 shadow"
                    : "text-gray-600 hover:bg-gray-100 hover:translate-x-1"
                }`
              }
            >
              <Icon size={20} />

              {!collapsed && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Info */}
      {/* <div className="px-3 py-3 border-t">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-500 text-white flex items-center justify-center rounded-full">
            {user?.name?.charAt(0)}
          </div>

          {!collapsed && (
            <div>
              <p className="text-sm font-medium text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500">Student</p>
            </div>
          )}
        </div>
      </div> */}

      {/* Bottom Logout */}
      <div className="mt-auto p-3 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition"
        >
          <LogOut size={20} />

          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}
