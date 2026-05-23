//http://localhost:3000/admin/dashboard//
"use client";
import { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

// 1. Register the components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);



export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [summaryData, setSummaryData] = useState({
        total_journal: 0,
        count_late: 0,
        count_on_time: 0,
        total_mapel: 0,
    });

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await fetch("/api/summay-journal");
                const result = await res.json();
                if (result.status && result.data && result.data.length > 0) {
                    setSummaryData(result.data[0]);
                }
            } catch (error) {
                console.error("Error fetching summary:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

   

    // 1. Data for Pie Chart
    const pieData = {
        labels: ["Tepat waktu", "Terlambat"],
        datasets: [
            {
                data: [summaryData.count_on_time, summaryData.count_late],
                backgroundColor: [
                    "rgba(34, 197, 94, 0.5)", // Green
                    "rgba(239, 68, 68, 0.5)", // Red
                ],
                borderColor: ["rgb(34, 197, 94)", "rgb(239, 68, 68)"],
                borderWidth: 1,
            },
        ],
    };
   

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> 
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Journal</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        {summaryData.total_journal}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Terlambat</h3>
                    <p className="text-3xl font-bold text-red-600 mt-2">
                        {summaryData.count_late}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Tepat Waktu</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                        {summaryData.count_on_time}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Mapel</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                        {summaryData.total_mapel}
                    </p>
                </div>
            </div>

             {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart Container */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-700 font-semibold mb-4">Kedatangan siswa/siswi</h3>
                    <div className="h-[300px] flex justify-center">
                        <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div> 
            </div>
        </div>
    );
} 

