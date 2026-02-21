"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaHome,
  FaTimes,
  FaSignOutAlt,
  FaBars,
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
    { name: "Mapel", icon: FaHome, path: "/admin/mapel" },
  ];

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="flex h-screen linier-gradient-to-br from-slate-100 to-slate-200">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 ease-in-out
        linear-gradient-to-b from-fuchsia-900 to-purple-900
        text-white flex flex-col fixed md:relative z-20 h-full shadow-xl`}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <span
            className={`font-bold text-lg tracking-wide transition-opacity ${
              !sidebarOpen && "opacity-0"
            }`}
          >
            Admin Panel
          </span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition"
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
                        ? "bg-white/20 shadow-md"
                        : "hover:bg-white/10"
                    }`}
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
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 w-full p-3 rounded-xl
            text-white/90 hover:bg-red-500/80 transition-all"
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