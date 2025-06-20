"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CreditCard,
  History,
  BarChart2,
  File,
  Clock,
} from "lucide-react";

const sidebarItems = [
  { name: "Dashboard", path: "", icon: LayoutDashboard },
  { name: "Sync/Add Bills", path: "/bills", icon: File },
  { name: "Payments", path: "/payments", icon: CreditCard },
  { name: "Analyze Bills", path: "/analyze-bills", icon: BarChart2 },
  { name: "Upcoming Bills", path: "/upcoming-bills", icon: Clock },
  { name: "Past Transactions", path: "/past-transactions", icon: History },
];

function Sidebar() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [active,setActive] = useState("Dashboard");
  return (
    <aside
      className={`bg-white shadow-md transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-4 flex items-center justify-between">
        {!sidebarCollapsed && (
          <h1 className="text-xl font-semibold text-gray-800">
            PayVault.ai
          </h1>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {sidebarCollapsed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19 7-7-7-7" />
              <path d="M5 12h14" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 5-7 7 7 7" />
              <path d="M19 12H5" />
            </svg>
          )}
        </button>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.name} className={`${item.name === active ? "bg-blue-700 text-white rounded-lg font-semibold" :""}`}>
              <Link
                href={`${item.name == "Dashboard" ? "/":`/dashboard${item.path}`}`}
                className={`flex items-center p-3 rounded-lg ${item.name === active?"hover:bg-blue-600":"hover:bg-gray-100"} transition-colors ${
                  sidebarCollapsed ? "justify-center" : ""
                }`}
                onClick={()=>setActive(item.name)}
              >
                <item.icon className={`w-5 h-5 ${item.name === active?"text-white":"text-gray-600"}`} />
                {!sidebarCollapsed && (
                  <span className={`ml-3 ${item.name === active?"text-white":"text-gray-700"}`}>{item.name}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
