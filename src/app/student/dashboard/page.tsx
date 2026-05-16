"use client";

import React, { useEffect, useMemo, useState } from "react";
import MainStudentLayout from "@/app/components/student/MainStudentLayout";
import { CalendarCheck, Clock, Loader, Percent, Search, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";

type TodayPresence = {
  id: number | string;
  scan_in?: string;
  tanggal?: string;
  mapel_name?: string;
  guru_name?: string;
};
//se client: Wajib digunakan karena kita menggunakan state
//  (useState) dan lifecycle (useEffect) yang berjalan di browser.
//  Tanpa ini, Next.js akan menganggap file ini sebagai komponen server dan tidak akan bisa menggunakan fitur-fitur tersebut.//



export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<TodayPresence[]>([]);

  const STUDENT_ID = 2;
// Fungsi untuk fetch data presensi hari ini dari API. Kita buat async function agar mudah menggunakan async/await dan menangani loading serta error dengan baik.//
  const fetchTodayPresence = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/journal-student?student_id=${STUDENT_ID}&today_only=true`);
      const result = await res.json();

      if (!result?.status) {
        setRows([]);
        setError(result?.message || "Gagal memuat data dashboard");
        return;
      }

      setRows(Array.isArray(result.data) ? result.data : []);
    } catch (e) {
      setRows([]);
      setError(e instanceof Error ? e.message : "Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  };

// Fetch data saat komponen pertama kali dimuat. Kita bisa tambahkan dependency lain jika ingin refetch saat kondisi tertentu berubah.//


  useEffect(() => {
    fetchTodayPresence();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const total = rows.length;

    // Tidak ada field status khusus di data /api/journal-student yang dipakai presence.
    // Maka metrik “tercatat” = jumlah data yang sukses tercatat.
    // Kita asumsikan semua data yang datang dari API adalah data yang berhasil tercatat, karena API ini memang untuk menampilkan data presensi yang sudah terjadi. Jadi kita bisa langsung gunakan total sebagai jumlah yang tercatat.
    const recorded = rows.length;

    const uniqueMapel = new Set(rows.map((r) => r.mapel_name).filter(Boolean));
    const uniqueTeachers = new Set(rows.map((r) => r.guru_name).filter(Boolean));

// Untuk menghitung presence score, kita bisa buat rumus sederhana seperti:
// presence_score = (jumlah mapel unik yang tercatat / total mapel hari itu) * 100
// Namun karena kita tidak punya data total mapel hari itu, kita bisa buat asumsi:


    const score = total === 0 ? 0 : Math.min(100, Math.round((recorded / Math.max(1, uniqueMapel.size)) * 50 + 50));

    const lastThree = rows
      .slice()
      .sort((a, b) => {
        const da = a.scan_in ? new Date(a.scan_in).getTime() : 0;
        const db = b.scan_in ? new Date(b.scan_in).getTime() : 0;
        return db - da;
      })
      .slice(0, 3);
// Gunakan useMemo untuk menghitung statistik dari data yang sudah di-fetch. Ini membantu menghindari perhitungan ulang yang tidak perlu saat state lain berubah.//
    return { total, recorded, uniqueMapelCount: uniqueMapel.size, uniqueTeachersCount: uniqueTeachers.size, score, lastThree };
  }, [rows]);

  const formatTime = (datetime?: string) => {
    if (!datetime) return "-";
    try {
      const d = new Date(datetime);
      return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "-";
    }
  };


// Gunakan useMemo untuk menghitung statistik dari data yang sudah di-fetch. Ini membantu menghindari perhitungan ulang yang tidak perlu saat state lain berubah.//


  return (
    <MainStudentLayout>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Ringkasan presensi hari ini dan akses cepat.</p>
        </div>

        <div className="flex items-center gap-3">
          
          <Link
            href="/student/history"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-800 font-semibold shadow-sm hover:border-gray-300 transition"
          >
            <Clock size={18} />
            Riwayat
          </Link>
        </div>
      </div>
      

      {loading ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-center gap-3">
            <Loader className="animate-spin text-blue-600" />
            <p className="text-gray-700 font-semibold">Memuat ringkasan presensi…</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-800">
          <p className="font-bold">Terjadi kesalahan</p>
          <p className="mt-1 text-sm">{error}</p>
          <button
            onClick={fetchTodayPresence}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-red-300 hover:bg-red-100 transition font-semibold"
          >
            Coba lagi
          </button>
        </div>
      ) : (
        <>
          

          {/* Quick list */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-black text-gray-900">Ringkasan hari ini</p>
                  <p className="text-sm text-gray-500 mt-1">Maksimal 3 presensi terakhir.</p>
                </div>
                <Link
                  href="/student/history"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
                >
                  Lihat semua
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {stats.lastThree.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <Search size={20} />
                    </div>
                    <p className="mt-3 font-semibold text-gray-800">Belum ada presensi hari ini</p>
                    <p className="text-sm text-gray-500 mt-1">Silakan scan QR dari menu “Scan QR”.</p>
                  </div>
                ) : (
                  stats.lastThree.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate">{item.mapel_name || "-"}</p>
                        <p className="text-sm text-gray-600 truncate">{item.guru_name || "-"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
                          <Clock size={16} className="text-gray-700" />
                        </div>
                        <p className="font-semibold text-gray-800 whitespace-nowrap">{formatTime(item.scan_in)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
              <p className="text-lg font-black text-gray-900">Akses cepat</p>
              <p className="text-sm text-gray-500 mt-1">Buka menu penting tanpa cari-cari.</p>

              <div className="mt-4 space-y-3">
                <Link
                  href="/student/presence"
                  className="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
                      <CalendarCheck size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Presence</p>
                      <p className="text-sm text-gray-600">Scan QR untuk hari ini</p>
                    </div>
                  </div>
                  <span className="text-gray-400">→</span>
                </Link>

                <Link
                  href="/student/history"
                  className="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-700">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">History</p>
                      <p className="text-sm text-gray-600">Riwayat presensi & catatan</p>
                    </div>
                  </div>
                  <span className="text-gray-400">→</span>
                </Link>

                <Link
                  href="/student/profile"
                  className="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Profile</p>
                      <p className="text-sm text-gray-600">Informasi akun</p>
                    </div>
                  </div>
                  <span className="text-gray-400">→</span>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </MainStudentLayout>
    // Gunakan useMemo untuk menghitung statistik dari data yang sudah di-fetch. Ini membantu menghindari perhitungan ulang yang tidak perlu saat state lain berubah.//
    // Catatan: untuk tugas ini, fokus utama adalah menampilkan data dari /api/journal-student dengan baik di dashboard. Kita tidak perlu membuat API baru atau mengubah data yang dikirim. Jadi kita akan menggunakan data yang ada untuk membuat ringkasan dan tampilan yang informatif bagi siswa.//
    // Tugas ini juga menekankan pada penggunaan React hooks (useState, useEffect, useMemo) untuk mengelola state dan efek samping dengan baik, serta membuat UI yang responsif dan user-friendly.//
    // Jangan lupa untuk menjaga konsistensi dengan desain dan pola yang sudah ada di aplikasi, serta memastikan bahwa dashboard ini memberikan nilai tambah bagi siswa dalam melihat ringkasan presensi mereka hari ini.//
  );
}

