"use client";

import { useState, useEffect } from "react";
import DataTable from "@/app/components/admin/DataTable";
import OffcanvasForm from "@/app/components/admin/OffcanvasForm";
import Swal from "sweetalert2";

interface Frame {
    id?: number;
    schedule_id: number;
    student_id: number;
    student_name?: string;
    schedule_name?: string;
    scan_in: string;
    scan_out: string;
    notes: string;
}

interface ScheduleOption {
    id: number;
    name: string;
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

    // 1. Columns configuration
    const columns = [
        {
            key: "schedule_id", // Changed from schedule_name to match data key
            label: "Schedule",
            render: (val: number) => {
                const schedule = scheduleList.find((s) => s.id === val);
                return schedule ? schedule.name : "Loading...";
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

    // 2. Data Fetching
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

    const handleCreate = () => {
        setCurrentFrame(initialFormState);
        setIsFormOpen(true);
    };

    const handleEdit = (frame: any) => {
        setCurrentFrame({
            ...frame,
            // Ensure dates are formatted for <input type="datetime-local">
            scan_in: frame.scan_in ? frame.scan_in.slice(0, 16) : "",
            scan_out: frame.scan_out ? frame.scan_out.slice(0, 16) : ""
        });
        setIsFormOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const isEdit = !!currentFrame.id;
            const url = `/api/journal${isEdit ? `/${currentFrame.id}` : ''}`; // Standard REST pattern
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentFrame),
            });

            const result = await res.json();
            if (result.status) {
                Swal.fire("Success", result.message, "success");
                setIsFormOpen(false);
                setRefreshTrigger((prev) => prev + 1);
            } else {
                Swal.fire("Error", result.message, "error");
            }
        } catch (err) {
            Swal.fire("Error", "Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Journal Management</h1>

            <DataTable
                title="Journal Logs"
                apiUrl="/api/journal"
                columns={columns}
                onCreate={handleCreate}
                onEdit={handleEdit}
                refreshTrigger={refreshTrigger}
            />

            <OffcanvasForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={currentFrame.id ? "Edit Entry" : "New Journal Entry"}
                onSubmit={handleSubmit}
                loading={loading}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                        <select
                            required
                            value={currentFrame.schedule_id}
                            onChange={(e) => setCurrentFrame({ ...currentFrame, schedule_id: Number(e.target.value) })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fuchsia-500 outline-none"
                        >
                            <option value={0}>Select Schedule</option>
                            {scheduleList.map((s) => (
                                <option key={s.id} value={s.id}>{}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                        <select
                            required
                            value={currentFrame.student_id}
                            onChange={(e) => setCurrentFrame({ ...currentFrame, student_id: Number(e.target.value) })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fuchsia-500 outline-none"
                        >
                            <option value={0}>Select Student</option>
                            {studentsList.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Scan In</label>
                            <input
                                type="datetime-local"
                                value={currentFrame.scan_in}
                                onChange={(e) => setCurrentFrame({ ...currentFrame, scan_in: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fuchsia-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Scan Out</label>
                            <input
                                type="datetime-local"
                                value={currentFrame.scan_out}
                                onChange={(e) => setCurrentFrame({ ...currentFrame, scan_out: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fuchsia-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                            value={currentFrame.notes}
                            onChange={(e) => setCurrentFrame({ ...currentFrame, notes: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fuchsia-500 outline-none"
                            rows={3}
                        />
                    </div>
                </div>
            </OffcanvasForm>
        </div>
    );
}