"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaHome,
  FaTimes,
  FaSignOutAlt,
  FaBars,
  FaBook,
  FaSchool,
  FaUserGraduate,
  FaCalendarAlt,
  FaUser,
  FaPen,
  FaQrcode,
} from "react-icons/fa";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { name: "Dashboard", icon: FaHome, path: "/admin/dashboard" },
    { name: "Mapel", icon: FaBook, path: "/admin/mapel" },
    { name: "Class", icon: FaSchool, path: "/admin/master-class" },
    { name: "Students", icon: FaUserGraduate, path: "/admin/students" },
    { name: "Schedule", icon: FaCalendarAlt, path: "/admin/schedule" },
    { name: "Teacher", icon: FaUser, path: "/admin/teacher" },
    { name: "Journal", icon: FaPen, path: "/admin/journal" },
    { name: "Quick Scan", icon: FaQrcode, path: "/admin/quick-scan" },
  ];

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="flex h-screen" style={{backgroundColor: 'var(--background)'}}>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 ease-in-out
        text-gray-700 flex flex-col fixed md:relative z-20 h-full shadow-xl`}
        style={{background: 'linear-gradient(to bottom, var(--primary-light-purple), var(--secondary-light-blue))'}}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b" style={{borderColor: 'var(--accent-light-blue)'}}>
          <span
            className={`font-bold text-lg tracking-wide transition-opacity ${
              !sidebarOpen && "opacity-0"
            }`}
            style={{color: 'var(--primary-light-purple)'}}
          >
            Admin Panel
          </span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/20 transition"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                    ${
                      pathname === item.path
                        ? "text-white"
                        : "text-gray-600 hover:bg-white/30"
                    }`}
                  style={pathname === item.path ? {backgroundColor: 'var(--accent-light-blue)', color: 'white'} : {}}
                >
                  <item.icon className="text-xl group-hover:scale-110 transition" />
                  <span
                    className={`text-sm font-medium transition-opacity ${
                      !sidebarOpen && "opacity-0"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t" style={{borderColor: 'var(--accent-light-blue)'}}>
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 w-full p-3 rounded-xl
            hover:bg-red-300 transition-all"
            style={{color: 'var(--primary-light-purple)'}}
          >
            <FaSignOutAlt className="text-xl group-hover:rotate-12 transition" />
            <span
              className={`text-sm font-medium ${
                !sidebarOpen && "hidden"
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-20 md:ml-0 overflow-auto p-6 md:p-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}