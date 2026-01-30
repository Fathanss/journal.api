
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

   // 2. Data for Bar Chart
    const barData = {
        labels: ["Kelas 10", "Kelas 11", "Kelas 12"],
        datasets: [
            {
                label: "Jumlah Siswa",
                data: [12, 19, 10],
                backgroundColor: "rgba(59, 130, 246, 0.5)", // Blue
                borderColor: "rgb(59, 130, 246)",
                borderWidth: 1,
            },
        ],
    };

    // 3. Data for Pie Chart
    const pieData = {
        labels: ["Lunas", "Belum Bayar"],
        datasets: [
            {
                data: [7, 3],
                backgroundColor: [
                    "rgba(34, 197, 94, 0.5)", // Green
                    "rgba(239, 68, 68, 0.5)", // Red
                ],
                borderColor: ["rgb(34, 197, 94)", "rgb(239, 68, 68)"],
                borderWidth: 1,
            },
        ],
    };

    //line chart//

    const lineData = {
        labels: ["100","90","80","70","60","50","40","30","20","10"],
    datasets: [
      {
        label: "Nilai Siswa",
        data: [6, 4,3,4,2,3,9,4,6,10],
        borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(60, 484, 696, 1)"
        ],

        backgroundColor: [
            "rgba(75, 192, 192, 0.2)",
            "rgba(60, 484, 696, 0.2)"
        ],
        tension: 0.3,
      },
    ],
  };


    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Siswa</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        10
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Guru</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        11
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Paid Rate</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        11
                    </p>
                </div>
            </div>

             {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart Container */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-700 font-semibold mb-4">Statistik Siswa per Kelas</h3>
                    <div className="h-[300px] flex justify-center">
                        <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false}} />
                    </div>
                </div>

                {/* Pie Chart Container */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-700 font-semibold mb-4">Status Pembayaran</h3>
                    <div className="h-[300px] flex justify-center">
                        <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
                {/* line Container */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-700 font-semibold mb-4">Nilai siswa/siswi</h3>
                    <div className="h-[300px] flex justify-center">
                        <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
            
        </div>
    );
} 

