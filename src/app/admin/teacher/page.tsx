"use client";

import { useState, useEffect } from "react";
import DataTable from "@/app/components/admin/DataTable";
import OffcanvasForm from "@/app/components/admin/OffcanvasForm";
import Swal from "sweetalert2";

interface Frame {
    id?: number;
    name: string;
    username: string;
    password: string;
    skill: string;
}

const initialFormState: Frame = {
    name: "",
    username: "",
    password: "",
    skill: "",
};

export default function FramesPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentFrame, setCurrentFrame] = useState<Frame>(initialFormState);
    const [loading, setLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);


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
            key: "skill",
            label: "Skill",
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
            skill: frame.skill || "",      
        });
        setIsFormOpen(true);
    };

    const handleDelete = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const isEdit = !!currentFrame.id;
            const url = `/api/teacher`;
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
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Teacher</h1>

            <DataTable
                title="List Teacher"
                apiUrl="/api/teacher"
                columns={columns}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
                refreshTrigger={refreshTrigger}
            />

            <OffcanvasForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={currentFrame.id ? "Edit Teacher" : "Create Teacher"}
                onSubmit={handleSubmit}
                loading={loading}
            >
                <div className="space-y-4">

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={currentFrame.name}
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
                                type="password"
                                value={currentFrame.password}
                                onChange={(e) => setCurrentFrame({ ...currentFrame, password: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fuchsia-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Skill</label>
                            <input
                                type="text"
                                value={currentFrame.skill}
                                onChange={(e) => setCurrentFrame({ ...currentFrame, skill: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fuchsia-500"
                            />
                        </div>
                    </div>

                </div>
            </OffcanvasForm>
        </div>
    );
}
