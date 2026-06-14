"use client";

import Swal from "sweetalert2";
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
  const handleLogout = async () => {
  
          const result = await Swal.fire({
              title: "Apakah kamu yakin?",
              text: "Kamu akan keluar dari akun ini.",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#d33",
              cancelButtonColor: "#3085d6",
              confirmButtonText: "ya, keluar!",
          });
  
          if (result.isConfirmed) {
              try {
                  handleRedirectLogout();
              } catch (err) {
                  Swal.fire("Error!", "Failed to delete record.", "error");
              }
          }
      };

  const handleRedirectLogout = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (token) {
        const response = await fetch("/api/auth/admin-logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          // Clear localStorage
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          
          // Redirect to login
          router.push("/admin-login");
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local storage and redirect on error
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      router.push("/admin-login");
    }
  };

  return (
    <div className="flex h-screen" style={{backgroundColor: 'var(--background)'}}>
      {/*  flex
Mengaktifkan mode Flexbox. Ini adalah "fondasi" agar elemen-elemen di dalam div tersebut bisa diatur posisinya dengan mudah (misalnya dibuat sejajar ke samping atau ke bawah, ditaruh di tengah, dll).
h-screen
Singkatan dari Height: 100vh. Ini membuat tinggi div tersebut memenuhi seluruh layar perangkat pengguna (dari atas sampai bawah). Tanpa ini, tinggi div biasanya hanya akan mengikuti sebanyak apa konten di dalamnya.
style={{backgroundColor: 'var(--background)'}}
Meskipun ini bukan class name melainkan inline style, bagian ini berfungsi untuk:
Memberikan warna latar belakang (background) pada elemen tersebut.
Mengambil nilai warna dari CSS Variable bernama --background. Biasanya teknik ini digunakan agar warna bisa berubah otomatis saat berganti tema (misalnya dari Light Mode ke Dark Mode).*/}
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
            style={{color: 'var(--black)'}}
          >
            Admin Panel
          </span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/25 transition"
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
        <div className="p-4 border-t" style={{borderColor: 'var(--black)'}}>
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 w-full p-3 rounded-xl
            hover:bg-white/25 transition-all"
            style={{color: 'var(--black)'}}
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