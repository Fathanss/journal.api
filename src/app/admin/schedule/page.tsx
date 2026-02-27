"use client";

import { useState, useEffect } from "react";
import DataTable from "@/app/components/admin/DataTable";
import OffcanvasForm from "@/app/components/admin/OffcanvasForm";
import Swal from "sweetalert2";

interface Frame {
    id?: number;
   mapel_id: number;
   teacher_id: number;
   date: string;
}

interface MapelOption {
    id: number;
    name: string;
}
interface TeacherOption {
    id: number;
    name: string;
}

const initialFormState: Frame = {
    mapel_id: 0,
    teacher_id: 0,
    date: "",
};

export default function FramesPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentFrame, setCurrentFrame] = useState<Frame>(initialFormState);
    const [loading, setLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [teacherList, setTeacherList] = useState<TeacherOption[]>([]);
    const [mapelList, setMapelList] = useState<MapelOption[]>([]);

    const columns = [
        {
            key: "mapel_name",
            label: "Mapel",
            render: (val: string) => val || "-"
        },
        {
            key: "teacher_name",
            label: "Teacher",
            render: (val: string) => val || "-"
        },
        {
            key: "date",
            label: "Date",
            render: (val: string) => val || "-"
        }
    ];

    const handleCreate = () => {
        setCurrentFrame(initialFormState);
        setIsFormOpen(true);
    };

    const handleEdit = (frame: any) => {
        setCurrentFrame({
            id: frame.id,
            mapel_id: frame.mapel_id || "",
            teacher_id: frame.teacher_id || "",
            date: frame.date || "",
        });
        setIsFormOpen(true);
    };

    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const res = await fetch("/api/teacher?limit=1000");
                const result = await res.json();
                if (result.status) {
                    setTeacherList(result.datas);
                }
            } catch (err) {
                console.error("Failed to fetch teacher", err);
            }
        };
        fetchTeacher();
    }, []);

    useEffect(() => {
        const fetchMapel = async () => {
            try {
                const res = await fetch("/api/mapel?limit=1000");
                const result = await res.json();
                if (result.status) {
                    setMapelList(result.data);
                }
            } catch (err) {
                console.error("Failed to fetch mapel", err);
            }
        };
        fetchMapel();
    }, []);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const isEdit = !!currentFrame.id;
            const url = `/api/schedule`;
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
        <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Schedule</h1>

            <DataTable
                title="List Schedule"
                apiUrl="/api/schedule"
                columns={columns}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={() => { }} // DataTable handles delete via API convention
                refreshTrigger={refreshTrigger}
            />

            <OffcanvasForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={currentFrame.id ? "Edit Schedule" : "Create Schedule"}
                onSubmit={handleSubmit}
                loading={loading}
            >
                <div className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teacher *</label>
                        <select required value={currentFrame.teacher_id} onChange={(e)=> setCurrentFrame({ ...currentFrame, teacher_id:
                            Number(e.target.value) })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fuchsia-500"
                            >
                            <option value={0}>Pilih Guru</option>
                            {teacherList.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.name}
                            </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mapel *</label>
                        <select required value={currentFrame.mapel_id} onChange={(e)=> setCurrentFrame({ ...currentFrame, mapel_id:
                            Number(e.target.value) })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fuchsia-500"
                            >
                            <option value={0}>Pilih Mapel</option>
                            {mapelList.map((mapel) => (
                            <option key={mapel.id} value={mapel.id}>
                                {mapel.name}
                            </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                type="text"
                                value={currentFrame.date}
                                onChange={(e) => setCurrentFrame({ ...currentFrame, date: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fuchsia-500"
                            />
                        </div>
                    </div>

                </div>
            </OffcanvasForm>
        </div>
    );
}
