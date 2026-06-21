"use client";

import React, { useState, useMemo, useEffect } from 'react';
import MainStudentLayout from '@/app/components/student/MainStudentLayout';
import { Calendar, Clock, Search, X, Loader, Book, Star } from 'lucide-react';

interface HistoryRecord {
  id: number;
  participants_id: number;
  check_in: string;
  check_out: string;
  status: string;
  notes?: string;
  student_name: string;
  student_id: number;
  mapel_name: string;
  day: string;
  start_at: string;
  end_at: string;
  teacher_name: string;
}

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [historyData, setHistoryData] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [histories, setHistories] = useState<HistoryRecord[]>([]);
  const STUDENT_ID = 2; // This should ideally come from user context or localStorage

const fetchHistoryData = async () => {
    try {
      const response = await fetch(
        `/api/history?student_id=${STUDENT_ID}`,
      );
      const result = await response.json();

      if (result.status) {
        // Map the API data to your UI structure
        const formattedData = result.data.map((item: any) => ({
          id: item.id,
          teacher_name: item.guru_name,
          mapel_name: item.mapel_name,
          day: item.tanggal ,
          check_in: item.scan_in,
          status: item.notes,

        }));
        setHistories(formattedData);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Failed to fetch journal:", error);
    }
  };

  // Fetch history data from API
  useEffect(() => {
   
    fetchHistoryData();
  }, []);

  // Filter data based on search and date range (client-side)
  const filteredHistory = useMemo(() => {
    let filtered = histories;

    // Filter by search query (mapel_name or teacher_name)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.mapel_name?.toLowerCase().includes(query) || false) ||
          (item.teacher_name?.toLowerCase().includes(query) || false)
      );
    }

    // Filter by date range
    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter((item) => new Date(item.check_in) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((item) => new Date(item.check_in) <= end);
    }

    return filtered;//filtern data//
  }, [histories, searchQuery, startDate, endDate]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
  };

  const formatTime = (datetime: string) => {
    if (!datetime) return '-';
    try {
      const date = new Date(datetime);
      return date.toLocaleTimeString('id-ID', 
        {
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    } catch {
      return datetime;
    }
  };

  const formatDate = (datetime: string) => {
    if (!datetime) return '-';
    try {
      const date = new Date(datetime);
      return date.toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch {
      return datetime;
    }
  };

  return (
    <MainStudentLayout>
      {/* Header */}
      <div className="mb-8 bg-linear-to-r from-blue-600 to-blue-700 rounded-2xl p-8 shadow-lg">
        <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">Riwayat Presensi</h1>
        <p className="text-blue-100 text-lg font-medium">Lihat catatan presensi dan data pembelajaran Anda.</p>
      </div>

      {/* Filter Section */}
      <div className="bg-linear-to-br from-white to-blue-50 rounded-2xl border-2 border-blue-200 p-8 mb-6 shadow-lg">
        <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center">
          <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
          Filter Data
        </h2>

        {/* Search Field */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-blue-900 mb-2">Cari Pelajaran atau Guru</label>
          <div className="relative group">
            <Search className="absolute left-4 top-4 text-blue-500 group-hover:text-blue-600 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Ketik nama pelajaran atau nama guru..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border-2 border-blue-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300 shadow-sm hover:shadow-md"
            />
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-bold text-blue-900 mb-2">Tanggal Mulai</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3.5 border-2 border-blue-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300 shadow-sm hover:shadow-md"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-blue-900 mb-2">Tanggal Akhir</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3.5 border-2 border-blue-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300 shadow-sm hover:shadow-md"
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        {(searchQuery || startDate || endDate) && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <X size={16} />
            Bersihkan Filter
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 p-4 rounded-full bg-linear-to-r from-blue-500 to-blue-600">
            <Loader size={40} className="text-white animate-spin" />
          </div>
          <p className="text-blue-700 font-semibold">Memuat data presensi Anda...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-linear-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-2xl p-6 mb-6 shadow-md">
          <p className="text-red-700 font-semibold text-lg">{error}</p>
        </div>
      )}

      {/* Results Count */}
      {!loading && (
        <div className="mb-6 text-blue-900 font-bold text-lg">
          Menampilkan <span className="text-blue-600 text-2xl">{filteredHistory.length}</span> data presensi
        </div>
      )}

      {/* History List */}
      {!loading && filteredHistory.length > 0 ? (
        <div className="grid grid-cols-1 gap-5">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-linear-to-br from-white to-blue-50 rounded-2xl border-2 border-blue-200 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Date */}
                <div className="flex flex-col">
                  <span className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1"> Tanggal</span>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar size={18} className="text-blue-600" />
                    </div>
                    <span className="font-bold text-gray-800">{formatDate(item.check_in)}</span>
                  </div>
                </div>

                {/* Presence Time */}
                <div className="flex flex-col">
                  <span className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1"> Presensi</span>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Clock size={18} className="text-green-600" />
                    </div>
                    <span className="font-bold text-gray-800">{formatTime(item.check_in)}</span>
                  </div>
                </div>

                {/* Subject Name */}
                <div className="flex flex-col">
                  <span className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Pelajaran</span>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Book size={18} className="text-green-600" />
                    </div>
                  <span className="font-bold text-gray-800 bg-blue-50 px-3 py-2 rounded-lg">{item.mapel_name || '-'}</span>
                  </div>
                </div>

                {/* Teacher */}
                <div className="flex flex-col">
                  <span className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1"> Guru</span>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Star size={18} className="text-green-600" />
                    </div>
                  <span className="font-bold text-gray-800 bg-blue-50 px-3 py-2 rounded-lg">{item.teacher_name || '-'}</span>
                  </div>
                </div>

                

                {/* Status Badge */}
                <div className="flex items-end">
                  <span className="px-4 py-2.5 rounded-full text-xs font-black text-white bg-linear-to-r from-green-500 to-green-600 shadow-lg border-2 border-green-300">
                    ✓ {item.status || 'Hadir'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !loading && filteredHistory.length === 0 ? (
        <div className="bg-linear-to-br from-white to-blue-50 rounded-2xl border-2 border-blue-200 p-16 text-center shadow-lg">
          <div className="mb-4 inline-block p-4 bg-blue-100 rounded-full">
            <Search size={48} className="text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-blue-900 mb-2">Tidak ada data</h3>
          <p className="text-blue-700 font-medium">Coba sesuaikan filter atau pencarian Anda</p>
        </div>
      ) : null}
    </MainStudentLayout>
  );
}


