"use client";


import {
  Calendar,
  CalendarCheck,
  Clock,
  Loader,
  Percent,
  Search,
  ShieldCheck,
  Users,
  Book,
  Star,
} from "lucide-react";
import Link from "next/link";




export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-black bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Journal App
          </div>
          <div className="flex gap-4">
            <Link href="/admin-login" className="px-4 py-2 text-gray-700 hover:text-purple-600 font-semibold transition">Admin</Link>
            <Link href="/student-login" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-semibold transition">Student</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-50 via-purple-50 to-blue-50 py-20 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl sm:text-6xl font-black mb-6 text-gray-900 leading-tight">
                Kelola Jurnal Pembelajaran dengan <span className="bg-linear-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">Mudah & Aman</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Platform digital modern untuk mengelola jurnal pembelajaran, presensi, dan data akademik dengan fitur lengkap dan interface yang intuitif.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div>
                  <div className="text-3xl font-black bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">100%</div>
                  <div className="text-sm text-gray-600 font-semibold">Aman & Terenkripsi</div>
                </div>
                <div>
                  <div className="text-3xl font-black bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">24/7</div>
                  <div className="text-sm text-gray-600 font-semibold">Akses Online</div>
                </div>
                <div>
                  <div className="text-3xl font-black bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">0 Min</div>
                  <div className="text-sm text-gray-600 font-semibold">Setup Cepat</div>
                </div>
              </div>

              
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-purple-400 to-blue-400 rounded-2xl blur-3xl opacity-20"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                    <span className="text-gray-700 font-semibold">✓ Manajemen Data Lengkap</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span className="text-gray-700 font-semibold">✓ Laporan Real-time</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                    <span className="text-gray-700 font-semibold">✓ Interface User-friendly</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span className="text-gray-700 font-semibold">✓ Support Multi-device</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-4 text-gray-900">Fitur Unggulan</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Semua yang Anda butuhkan untuk mengelola jurnal pembelajaran dengan efisien</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Calendar />, title: 'Dashboard Analytics', desc: 'Pantau semua data pembelajaran dalam satu dashboard intuitif' },
              { icon: <Users />, title: 'Manajemen Pengguna', desc: 'Kelola admin, guru, dan siswa dengan mudah dan terstruktur' },
              { icon: <Clock />, title: 'Jadwal Terjadwal', desc: 'Atur jadwal pembelajaran dan kelas dengan sistem yang fleksibel' },
              { icon: <Search />, title: 'Tracking Presensi', desc: 'Catat dan pantau presensi siswa secara real-time' },
              { icon: <Book />, title: 'Jurnal Digital', desc: 'Buat dan kelola jurnal pembelajaran dengan fitur lengkap' },
              { icon: <ShieldCheck />, title: 'Keamanan Terjamin', desc: 'Data tersimpan aman dengan enkripsi tingkat enterprise' },
            ].map((feature, idx) => (
              <div key={idx} className="group bg-white rounded-xl p-8 border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal Sections */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-4 text-gray-900">Pilih Portal Anda</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Akses sesuai dengan peran Anda di sistem</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Admin Portal */}
            <div className="group relative bg-white rounded-2xl overflow-hidden border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 hover:shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-purple-600 to-purple-400"></div>
             
             
              <div className="p-10">
                <h3 className="text-3xl font-black text-purple-700 mb-4">Admin Portal</h3>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Kelola seluruh sistem pembelajaran dengan kontrol penuh atas data siswa, guru, kelas, dan laporan.
                </p>

                <div className="space-y-3 mb-10">
                  {[
                    'Manajemen Data Siswa & Guru',
                    'Pengaturan Kelas & Mata Pelajaran',
                    'Penjadwalan Pembelajaran',
                    'Monitoring Presensi & Kehadiran',
                    'Laporan Jurnal Pembelajaran Komprehensif'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-lg font-bold text-purple-600 shrink-0">●</span>
                      <span className="text-gray-700 font-semibold">{item}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/admin-login"
                  className="w-full py-4 px-6 rounded-lg font-black text-white bg-linear-to-r from-purple-600 to-purple-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block text-center text-lg"
                >
                  Masuk Sebagai Admin
                </Link>
              </div>
            </div>

            {/* Student Portal */}
            <div className="group relative bg-white rounded-2xl overflow-hidden border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 hover:shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-600 to-cyan-400"></div>
              
              <div className="p-10">
                <h3 className="text-3xl font-black text-blue-700 mb-4">Student Portal</h3>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Akses jadwal pembelajaran, catat kehadiran, dan pantau riwayat akademik Anda dengan mudah.
                </p>

                <div className="space-y-3 mb-10">
                  {[
                    'Lihat Jadwal Pembelajaran',
                    'Catat Presensi Harian Otomatis',
                    'Akses Jurnal Pembelajaran',
                    'Pantau Riwayat Akademik',
                    'Kelola Profil Pribadi Lengkap'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-lg font-bold text-blue-600 shrink-0">●</span>
                      <span className="text-gray-700 font-semibold">{item}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/student-login"
                  className="w-full py-4 px-6 rounded-lg font-black text-white bg-linear-to-r from-blue-600 to-cyan-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block text-center text-lg"
                >
                  Masuk Sebagai Siswa
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-purple-600 via-purple-500 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">Siap Untuk Memulai?</h2>
          <p className="text-xl text-purple-100 mb-8">Akses portal Anda sekarang dan mulai kelola jurnal pembelajaran dengan lebih efisien</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/admin-login"
              className="px-8 py-4 rounded-lg font-black text-white border-2 border-white hover:bg-white hover:text-purple-500 transition-all duration-300 hover:-translate-y-1"
            >
              Admin Login
            </Link>
            <Link 
              href="/student-login"
              className="px-8 py-4 rounded-lg font-black text-white border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300 hover:-translate-y-1"
            >
              Student Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-gray-800">
            <div>
              <div className="text-2xl font-black bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">Journal App</div>
              <p className="text-sm">Sistem Manajemen Jurnal Pembelajaran Digital</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/admin-login" className="hover:text-purple-400 transition">Admin</Link></li>
                <li><Link href="/student-login" className="hover:text-blue-400 transition">Student</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <p className="text-sm">Hubungi kami untuk dukungan teknis</p>
            </div>
          </div>
          <div className="text-center text-sm">
            <p>© 2026 Journal App. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
