"use client";

import React, { useState, useMemo, useEffect } from 'react';
import MainStudentLayout from '@/app/components/student/MainStudentLayout';
import { Calendar, Clock, Search, X, Loader } from 'lucide-react';

interface HistoryRecord {
  id: number;
  tanggal: string;
  mapel_name: string;
  guru_name: string;
  scan_in: string;
  scan_out?: string;
  notes?: string;
}

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [historyData, setHistoryData] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch history data from API
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get student_id from localStorage (set during login)
        const userDataStr = localStorage.getItem('user_data');
        let studentId = null;

        if (userDataStr) {
          try {
            const userData = JSON.parse(userDataStr);
            studentId = userData.id;
          } catch {
            console.error('Failed to parse user_data');
          }
        }

        if (!studentId) {
          setError('Student ID not found. Please log in again.');
          setLoading(false);
          return;
        }

        // Build query parameters
        let queryParams = `student_id=${studentId}&limit=100`;

        if (startDate) {
          queryParams += `&date_from=${startDate}`;
        }
        if (endDate) {
          queryParams += `&date_to=${endDate}`;
        }
        if (searchQuery) {
          queryParams += `&search=${encodeURIComponent(searchQuery)}`;
        }

        const response = await fetch(`/api/journal?${queryParams}`);
        const result = await response.json();

        if (result.status && result.data) {
          setHistoryData(result.data);
        } else {
          setError(result.message || 'Failed to fetch data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch history data');
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search and fetch
    const timer = setTimeout(() => {
      fetchHistory();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, startDate, endDate]);

  // Filter data based on search (client-side for better UX)
  const filteredHistory = useMemo(() => {
    return historyData;
  }, [historyData]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
  };

  const formatTime = (datetime: string) => {
    if (!datetime) return '-';
    try {
      const date = new Date(datetime);
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Presensi</h1>
        <p className="text-gray-500">Lihat catatan presensi dan data pembelajaran Anda.</p>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter</h2>

        {/* Search Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Cari Pelajaran atau Guru</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Ketik nama pelajaran atau nama guru..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        {(searchQuery || startDate || endDate) && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X size={16} />
            Bersihkan Filter
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader size={32} className="text-indigo-600 animate-spin" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Results Count */}
      {!loading && (
        <div className="mb-4 text-sm text-gray-600">
          Menampilkan <span className="font-semibold">{filteredHistory.length}</span> data
        </div>
      )}

      {/* History List */}
      {!loading && filteredHistory.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Date */}
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Tanggal</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar size={18} className="text-indigo-600" />
                    <span className="font-semibold text-gray-800">{formatDate(item.tanggal)}</span>
                  </div>
                </div>

                {/* Subject Name */}
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Pelajaran</span>
                  <span className="font-semibold text-gray-800 mt-1">{item.mapel_name || '-'}</span>
                </div>

                {/* Teacher */}
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Guru</span>
                  <span className="font-semibold text-gray-800 mt-1">{item.guru_name || '-'}</span>
                </div>

                {/* Presence Time */}
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Waktu Presensi</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={18} className="text-green-600" />
                    <span className="font-semibold text-gray-800">{formatTime(item.scan_in)}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-end">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                    Hadir
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !loading && filteredHistory.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Search size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold text-gray-600 mb-1">Tidak ada data</h3>
          <p className="text-gray-500">Coba sesuaikan filter atau pencarian Anda</p>
        </div>
      ) : null}
    </MainStudentLayout>
  );
}


