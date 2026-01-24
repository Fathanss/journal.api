"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    FaHome,
    FaTimes,
    FaSignOutAlt,
    FaBars
} from "react-icons/fa";
import layout from "../layout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const menuItems = [
        { name: "Dashboard", icon: FaHome, path: "/admin/dashboard" },
    ];

    const handleLogout = async () => {
        // Call logout api or just clear cookie
        // For now simplistic redirect
        // Ideally call /api/auth-logout
        router.push("/login");
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`bg-fuchsia-900 text-white transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"
                    } flex flex-col fixed md:relative z-20 h-full`}
            >
                <div className="p-4 flex items-center justify-between border-b border-fuchsia-800">
                    <span className={`font-bold text-xl ${!sidebarOpen && "hidden"}`}>Admin Panel</span>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-fuchsia-800 rounded">
                        {sidebarOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-2 px-2">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    className={`flex items-center p-3 rounded-lg transition-colors ${pathname === item.path
                                        ? "bg-fuchsia-700 text-white"
                                        : "text-fuchsia-100 hover:bg-fuchsia-800"
                                        }`}
                                >
                                    <item.icon className="text-xl" />
                                    <span className={`ml-3 whitespace-nowrap ${!sidebarOpen && "hidden"}`}>
                                        {item.name}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4 border-t border-fuchsia-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full p-3 rounded-lg text-fuchsia-100 hover:bg-fuchsia-800 transition-colors"
                    >
                        <FaSignOutAlt className="text-xl" />
                        <span className={`ml-3 whitespace-nowrap ${!sidebarOpen && "hidden"}`}>
                            Logout
                        </span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
