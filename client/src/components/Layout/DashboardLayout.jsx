import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import GuideSidebar from "./GuideSidebar"
import { useState } from "react";
import CoordinatorSidebar from "./CoordinatorSidebar";

export default function DashboardLayout({ children }) {

  const [collapsed, setCollapsed] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  

  const renderSidebar = () => {
    switch (role) {
      case "coordinator":
        return (
          <CoordinatorSidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
        );

      case "guide":
        return (
          <GuideSidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
        );

      case "student":
        return (
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
        );
    }
  };

  return (
    <div className="flex">

      {/* <GuideSidebar collapsed={collapsed} setCollapsed={setCollapsed} /> */}
      {/* <CoordinatorSidebar collapsed={collapsed} setCollapsed={setCollapsed} /> */}
      {/* <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} /> */}

      {renderSidebar()}

      <div className={`flex flex-col flex-1 ${collapsed ? "ml-14" : "ml-64"} h-screen bg-gray-50`}>

        <Navbar />

        <main className="p-5 overflow-y-auto flex-1 scroll-smooth">
          {children}
        </main>

      </div>

    </div>
  )
}