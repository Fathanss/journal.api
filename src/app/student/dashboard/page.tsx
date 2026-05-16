"use client";

import React, { useEffect, useMemo, useState } from "react";
import MainStudentLayout from "@/app/components/student/MainStudentLayout";
import {
  Calendar,
  CalendarCheck,
  Clock,
  Loader,
  Percent,
  Search,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

type TodaySchedule = {
  id: number | string;
  mapel_id?: number;
  class_id?: number;
  teacher_id?: number;
  mapel_name?: string;
  teacher_name?: string;
  class_name?: string;
  start_at?: string;
  end_at?: string;
  date?: string;
};
//se client: Wajib digunakan karena kita menggunakan state
//  (useState) dan lifecycle (useEffect) yang berjalan di browser.
//  Tanpa ini, Next.js akan menganggap file ini sebagai komponen server dan tidak akan bisa menggunakan fitur-fitur tersebut.//

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<TodaySchedule[]>([]);

  const STUDENT_ID = 2;
  // Fungsi untuk fetch data presensi hari ini dari API. Kita buat async function agar mudah menggunakan async/await dan menangani loading serta error dengan baik.//
  const fetchTodayPresence = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `/api/schedule?student_id=${STUDENT_ID}&today_only=true`,
      );
      const result = await res.json();

      if (result.status) {
        setRows(Array.isArray(result.data) ? result.data : []);
      }
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

  const formatTime = (datetime?: string) => {
    if (!datetime) return "-";
    try {
      const d = new Date(datetime);
      return d.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  // Add 'undefined' and 'null' to the parameter type
  const formatDate = (datetime: string | undefined | null) => {
    if (!datetime) return "-";
    try {
      const date = new Date(datetime);
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return datetime; // Note: if datetime is null/undefined, it won't hit here because of the guard above
    }
  };

  // Gunakan useMemo untuk menghitung statistik dari data yang sudah di-fetch. Ini membantu menghindari perhitungan ulang yang tidak perlu saat state lain berubah.//

  return (
    <MainStudentLayout>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Ringkasan jadwal hari ini dan akses cepat.
          </p>
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
            <p className="text-gray-700 font-semibold">
              Memuat ringkasan presensi…
            </p>
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
              <p className="text-lg font-black text-gray-900">
                Jadwal hari ini
              </p>
              
              <div className="mt-4 space-y-3">
                {rows.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <Search size={20} />
                    </div>
                    <p className="mt-3 font-semibold text-gray-800">
                      Belum ada presensi hari ini
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Silakan scan QR dari menu “Scan QR”.
                    </p>
                  </div>
                ) : (
                  rows.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate">
                          {item.mapel_name || "-"}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {item.teacher_name || "-"}
                        </p>
                      </div>

                      <div>
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">
                            ⏰ Waktu
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900 truncate">
                            {formatTime(item.start_at)} -{" "}
                            {formatTime(item.end_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">
                          🏫 Kelas
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 truncate">
                            {item.class_name || "-"}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">
                          📅 Tanggal
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Calendar size={18} className="text-blue-600" />
                          </div>
                          <span className="font-bold text-gray-800">
                            {formatDate(item.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
              <p className="text-lg font-black text-gray-900">Akses cepat</p>
              <p className="text-sm text-gray-500 mt-1">
                Buka menu penting tanpa cari-cari.
              </p>

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
                      <p className="text-sm text-gray-600">
                        Scan QR untuk hari ini
                      </p>
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
                      <p className="text-sm text-gray-600">
                        Riwayat presensi & catatan
                      </p>
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
