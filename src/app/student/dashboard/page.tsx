"use client";

import Cookies from "js-cookie";
import * as jose from "jose";
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
  Users,
  Book,
  Star,
  

} from "lucide-react";
import Link from "next/link";
import { Teachers } from "next/font/google";

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

interface StudentData {
  name: string;
  username: string;
  class_id: number | string | null;
  id: number | string | null;
}

export default function DashboardPage() {
  let mStudentData = {
    name: "Guest",
    username: "unknown",
    id: null,
    class_id: null,
  };

  // Helper fungsi untuk mendapatkan string tanggal format YYYY-MM-DD
  const getFormattedDate = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split("T")[0];
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<TodaySchedule[]>([]);
  const [studentData, setStudentData] = useState<StudentData>(mStudentData);

  // State baru untuk Date Range (Default: Hari ini s.d 7 hari ke depan)
  const [startDate, setStartDate] = useState<string>(getFormattedDate(0));
  const [endDate, setEndDate] = useState<string>(getFormattedDate(7));

  useEffect(() => {
    const token = localStorage.getItem("student_session_token");
    const studentSession = localStorage.getItem("student_data");
    console.log("JWT token:", token);

    const verifyToken = () => {
      if (token && token !== "light") {
        try {
          console.log("studentdata:", studentSession);
          const studentSessionJson = JSON.parse(studentSession || "{}");

          setStudentData(studentSessionJson);

          // Fetch awal menggunakan tanggal default
          fetchTodayPresence(studentSessionJson.class_id, startDate, endDate);
        } catch (e) {
          console.error("JWT verification failed:", e);
          setError("Session invalid or expired");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  // Memicu fetch ulang secara otomatis ketika filter tanggal berubah oleh user
  useEffect(() => {
    if (studentData.class_id) {
      fetchTodayPresence(studentData.class_id, startDate, endDate);
    }
  }, [startDate, endDate]);

  // Fungsi fetch yang sudah terintegrasi dengan parameter tanggal eksternal
  const fetchTodayPresence = async (
    classId: string | number | null,
    start: string,
    end: string,
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Integrasi parameter ke API query string
      const res = await fetch(
        `/api/schedule?class_id=${classId}&start_date=${start}&end_date=${end}`,
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
      return datetime;
    }
  };

  return (
    <MainStudentLayout>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Halo <b>{studentData.name}</b> ! Ringkasan jadwal hari ini dan akses
            cepat.
          </p>
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
            onClick={() =>
              fetchTodayPresence(studentData.class_id, startDate, endDate)
            }
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-red-300 hover:bg-red-100 transition font-semibold"
          >
            Coba lagi
          </button>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
              <p className="text-lg font-black text-gray-900">Jadwal harian</p>

              {/* --- AREA DATE RANGE YANG SUDAH DIPERBARUI --- */}
              <div className="mt-3 flex flex-wrap items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Dari Tanggal
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
                <div className="text-gray-400 self-end mb-2 hidden sm:block">
                  s/d
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Sampai Tanggal
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>
              {/* ------------------------------------------- */}

              <div className="mt-4 space-y-3">
                {rows.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <Search size={20} />
                    </div>
                    <p className="mt-3 font-semibold text-gray-800">
                      Belum ada presensi pada rentang tanggal ini
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Silakan ganti rentang tanggal atau scan QR dari menu “Scan
                      QR”.
                    </p>
                  </div>
                ) : (
                  rows.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div>
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">
                              Mata Pelajaran
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Book size={18} className="text-blue-600" />
                            </div>
                            <p className="font-bold text-gray-900 truncate">
                              {item.mapel_name || "-"}
                            </p>
                          </div>
                        </div>

                        <div>
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">
                              Guru
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Star size={18} className="text-blue-600" />
                            </div>
                            <p className="font-bold text-gray-900 truncate">
                              {item.teacher_name || "-"}
                            </p>
                          </div>
                        </div>

                        

                        <div>
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">
                              Waktu
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Clock size={18} className="text-blue-600" />
                            </div>
                            <p className="font-bold text-gray-900 truncate">
                              {formatTime(item.start_at)} -{" "}
                              {formatTime(item.end_at)}
                            </p>
                          </div>
                        </div>

                      <div>
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">
                            Kelas
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Users size={18} className="text-blue-600" />
                          </div>
                          <span className="font-bold text-gray-900 truncate">
                            {item.class_name || "-"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">
                            Tanggal
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
  );
}
