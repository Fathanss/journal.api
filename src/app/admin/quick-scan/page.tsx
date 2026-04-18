"use client";

import { useState, useEffect, useRef } from "react";
import DataTable from "@/app/components/admin/DataTable";
import OffcanvasForm from "@/app/components/admin/OffcanvasForm";
import Swal from "sweetalert2";
import { Html5QrcodeScanner } from "html5-qrcode";


interface Frame {
    id?: number;
    schedule_id: number;
    student_id: number;
    student_name?: string;
    schedule_mapel?: string;
    scan_in: string;
    scan_out: string;
    notes: string;
}

interface ScheduleOption {
    id: number;
    mapel_name: string;
}

interface StudentOption {
    id: number;
    name: string;
}

const initialFormState: Frame = {
    schedule_id: 0,
    student_id: 0,
    scan_in: "",
    scan_out: "",
    notes: ""
};

export default function FramesPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentFrame, setCurrentFrame] = useState<Frame>(initialFormState);
    const [loading, setLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [scheduleList, setScheduleList] = useState<ScheduleOption[]>([]);
    const [studentsList, setStudentsList] = useState<StudentOption[]>([]);
    

    const columns = [
        {
            key: "schedule_id", // Changed from schedule_name to match data key
            label: "Schedule",
            render: (val: number) => {
                const schedule = scheduleList.find((s) => s.id === val);
                return schedule ? schedule.mapel_name: "Loading...";
            }
        },
        {
          key: "student_id", // Changed from students_name to match data key
          label: "Student",
          render: (val: number) => {
            const student = studentsList.find((s) => s.id === val);
            return student ? student.name : "Loading...";
          }
        },
        {
            key: "scan_in",
            label: "Scan In",
            render: (val: string) => val ? new Date(val).toLocaleString() : "-"
        },
        {
            key: "scan_out",
            label: "Scan Out",
            render: (val: string) => val ? new Date(val).toLocaleString() : "-"
        },
        {
            key: "notes",
            label: "Notes",
            render: (val: string) => val || "-"
        }
    ];
    // Quick Scan States
    const [quickCode, setQuickCode] = useState("");
    const [showScanner, setShowScanner] = useState(false);
    const [lastScanResult, setLastScanResult] = useState<any>(null);

    // 2. Fetch metadata (schedules and students)
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [resStudents, resSchedule] = await Promise.all([
                    fetch("/api/students"),
                    fetch("/api/schedule")
                ]);
                const studentsData = await resStudents.json();
                const scheduleData = await resSchedule.json();

                if (studentsData.status) setStudentsList(studentsData.data);
                if (scheduleData.status) setScheduleList(scheduleData.data);
            } catch (err) {
                console.error("Failed to fetch metadata:", err);
            }
        };
        fetchMetadata();
    }, []);

    // Function to handle the actual API call for Scan In
    const processAutoScanIn = async (code: string) => {
        setLoading(true);
        try {
            // Logic: You'll likely need an API endpoint that handles 
            // lookup by code to find student/schedule
            const res = await fetch("/api/journal/scan-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, timestamp: new Date().toISOString() }),
            });

            const result = await res.json();
            if (result.status) {
                // Store the scan result to display
                setLastScanResult({
                    schedule_id: result.data?.schedule_id,
                    student_id: result.data?.student_id,
                    scan_in: result.data?.scan_in || new Date().toISOString(),
                    notes: result.data?.notes || ""
                });
                Swal.fire("Success", "Checked in successfully!", "success");
                setQuickCode("");
                setShowScanner(false);
                setRefreshTrigger(prev => prev + 1);
            } else {
                Swal.fire("Error", result.message, "error");
            }
        } catch (err) {
            Swal.fire("Error", "Failed to process scan", "error");
        } finally {
            setLoading(false);
        }
    };

    // Mobile Camera Scanner Effect
    useEffect(() => {
        if (showScanner) {
            const scanner = new Html5QrcodeScanner("reader", { 
                fps: 10, 
                qrbox: { width: 250, height: 250 } 
            }, false);

            scanner.render((decodedText) => {
                setQuickCode(decodedText);
                scanner.clear();
                processAutoScanIn(decodedText);
            }, (error) => {
                // Ignore constant scanning errors
            });

            return () => {
                scanner.clear().catch(e => console.error("Scanner cleanup failed", e));
            };
        }
    }, [showScanner]);

    // ... (columns, handleEdit, fetch effects remain the same)

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Journal & Attendance</h1>

            {/* --- QUICK SCAN SECTION --- */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4">Quick Scan In</h2>
                
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    {/* Desktop View: Input + Button */}
                    <div className="flex-1 w-full">
                        <input
                            type="text"
                            placeholder="Enter Student/QR Code..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-fuchsia-500"
                            value={quickCode}
                            onChange={(e) => setQuickCode(e.target.value)}
                        />
                    </div>
                    
                    <button 
                        onClick={() => processAutoScanIn(quickCode)}
                        disabled={!quickCode || loading}
                        className="hidden md:block bg-fuchsia-600 text-white px-6 py-2 rounded-lg hover:bg-fuchsia-700 disabled:bg-gray-400"
                    >
                        {loading ? "Processing..." : "Scan In"}
                    </button>

                    {/* Mobile View: Toggle Camera */}
                    <button 
                        onClick={() => setShowScanner(!showScanner)}
                        className="md:hidden w-full bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                        {showScanner ? "Close Camera" : "📸 Open QR Scanner"}
                    </button>
                </div>

                {/* QR Scanner Container */}
                {showScanner && (
                    <div className="mt-4 overflow-hidden rounded-lg border-2 border-dashed border-indigo-200">
                        <div id="reader"></div>
                    </div>
                )}
            </div>

            {/* --- SCAN RESULT SECTION --- */}
            {lastScanResult && (
                <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-200">
                    <h2 className="text-lg font-semibold mb-4 text-green-800">✓ Scan Result</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-green-100">
                            <p className="text-sm text-gray-600 mb-1">Schedule</p>
                            <p className="text-lg font-semibold text-gray-800">
                                {scheduleList.find(s => s.id === lastScanResult.schedule_id)?.mapel_name || "Loading..."}
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-green-100">
                            <p className="text-sm text-gray-600 mb-1">Student</p>
                            <p className="text-lg font-semibold text-gray-800">
                                {studentsList.find(s => s.id === lastScanResult.student_id)?.name || "Loading..."}
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-green-100">
                            <p className="text-sm text-gray-600 mb-1">Scan In Time</p>
                            <p className="text-lg font-semibold text-gray-800">
                                {new Date(lastScanResult.scan_in).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <DataTable
                title="Recent Journals"
                apiUrl="/api/journal"
                columns={columns}             
                onDelete={() => { }}
                refreshTrigger={refreshTrigger}
            />

        </div>
    );
}
