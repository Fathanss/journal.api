// components/MainStudentLayout.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarCheck, History, User } from "lucide-react";

const MENU_ITEMS = [
  { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { name: "Presence", href: "/student/presence", icon: CalendarCheck },
  { name: "History", href: "/student/history", icon: History },
  { name: "Profile", href: "/student/profile", icon: User },
];

export default function MainStudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  //
  return (
    <div
      className="flex flex-col md:flex-row min-h-screen"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside
        className="hidden md:flex flex-col w-64 h-screen sticky top-0 shadow-lg"
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
        }}
      >
        <div
          className="p-8 font-bold text-2xl border-b"
          style={{
            color: "white",
            borderBottomColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 bg-white rounded-lg flex items-center justify-center"
              style={{ color: "#1e3a8a", fontWeight: "bold" }}
            >
              S
            </div>
            <span>Student Journal</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-3">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                pathname === item.href
                  ? "bg-white shadow-md"
                  : "text-purple-700 hover:bg-purple-700 hover:bg-opacity-10"
              }`}
              style={
                pathname === item.href
                  ? { color: "#1e3a8a" }
                  : { color: "white" }
              }
            >
              <item.icon size={22} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
        {/* Di dalam Link, terdapat logika kondisional (menggunakan ternary operator ${... ? ... : ...}) untuk mengecek apakah pathname (halaman saat ini) sama dengan item.href:
        flex items-center: Membuat ikon dan teks sejajar secara horizontal di tengah secara vertikal.
        gap-3: Memberikan jarak antara ikon dan teks.
        rounded-xl: Membuat sudut tombol menu menjadi sangat membulat (extra large).
        transition-all duration-300: Membuat perubahan warna (saat hover atau saat diklik) terasa halus selama 0,3 detik, tidak berubah secara kaget. */}

        <div
          className="p-4 border-t"
          style={{ borderTopColor: "rgba(255, 255, 255, 0.2)" }}
        >
          <div className="text-white text-xs opacity-75 text-center">
            © 2024 Journal App
          </div>
        </div>
      </aside>

      {/* Main Content Area */}

      <main className="flex-1 ml-20 md:ml-0 overflow-auto p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 min-h-full">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation (Hidden on Desktop) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 shadow-2xl flex justify-around items-center h-16 px-2"
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
        }}
      >
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 rounded-xl mx-1 ${
              pathname === item.href ? "" : ""
            }`}
            style={
              pathname === item.href
                ? {
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                  }
                : { color: "rgba(255, 255, 255, 0.7)" }
            }
          >
            <item.icon size={24} />
            <span className="text-[10px] mt-1">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
    //
  );
}