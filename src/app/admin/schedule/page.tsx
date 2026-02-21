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

interface ClassOption {
    id: number;
   mapel_id: number;
   teacher_id: number;
   date: string;
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
    const [kelasList, setKelasList] = useState<ClassOption[]>([]);


    const columns = [
        {
            key: "name",
            label: "Name",
            render: (val: string) => val || "-"
        },
        {
            key: "username",
            label: "Username",
            render: (val: string) => val || "-"
        },
        {
            key: "class_name",
            label: "Class",
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
            name: frame.name || "",
            username: frame.username || "",
            password: "", // Don't pre-fill password for security reasons
            class_id: frame.class_id || undefined,      
        });
        setIsFormOpen(true);
    };

    useEffect(() => {
      const fetchKelas = async () => {
        try {
          const res = await fetch("/api/master-class?limit=1000");
          const result = await res.json();
          if (result.status) {
            setKelasList(result.data);
          }
        } catch (err) {
          console.error("Failed to fetch kelas", err);
        }
      };
  fetchKelas();
}, []);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const isEdit = !!currentFrame.id;
            const url = `/api/students`;
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
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Student</h1>

            <DataTable
                title="List Students"
                apiUrl="/api/students"
                columns={columns}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={() => { }} // DataTable handles delete via API convention
                refreshTrigger={refreshTrigger}
            />

            <OffcanvasForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={currentFrame.id ? "Edit Students" : "Create Students"}
                onSubmit={handleSubmit}
                loading={loading}
            >
                <div className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project *</label>
                        <select required value={currentFrame.class_id} onChange={(e)=> setCurrentFrame({ ...currentFrame, class_id:
                            Number(e.target.value) })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fuchsia-500"
                            >
                            <option value={0}>Pilih Kelas</option>
                            {kelasList.map((kelas) => (
                            <option key={kelas.id} value={kelas.id}>
                                {kelas.name}
                            </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={currentFrame.mapel_id}
                                onChange={(e) => setCurrentFrame({ ...currentFrame, name: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fuchsia-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                type="text"
                                value={currentFrame.username}
                                onChange={(e) => setCurrentFrame({ ...currentFrame, username: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fuchsia-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="text"
                                value={currentFrame.password}
                                onChange={(e) => setCurrentFrame({ ...currentFrame, password: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fuchsia-500"
                            />
                        </div>
                    </div>

                </div>
            </OffcanvasForm>
        </div>
    );
}
