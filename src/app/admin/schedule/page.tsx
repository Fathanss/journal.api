"use client";

import { useState, useEffect } from "react";
import DataTable from "@/app/components/admin/DataTable";
import OffcanvasForm from "@/app/components/admin/OffcanvasForm";
import Swal from "sweetalert2";
import QRCode from "react-qr-code";


interface Frame {
  id?: number;
  mapel_id: number;
  teacher_id: number;
  class_id: number;
  code : string;
  date: string;
  start_at?: string;
  end_at?: string;
}

interface MapelOption {
  id: number;
  name: string;
}
interface TeacherOption {
  id: number;
  name: string;
}
interface ClassOption {
  id: number;
  name: string;
}

const initialFormState: Frame = {
  mapel_id: 0,
  teacher_id: 0,
  class_id: 0,
  date: "",
  code: "",
  start_at: "",
  end_at: "",
};

export default function FramesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentFrame, setCurrentFrame] = useState<Frame>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [teacherList, setTeacherList] = useState<TeacherOption[]>([]);
  const [mapelList, setMapelList] = useState<MapelOption[]>([]);
  const [classList, setClassList] = useState<ClassOption[]>([]);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState("");

  // Generate code otomatis (angka saja)
  const generateCode = (): string => {
    const timestamp = Date.now().toString().slice(-8); // 8 digit terakhir dari timestamp
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // 4 digit random
    return `${timestamp}${random}`; // Contoh: 95467823 + 6789 = 954678236789
  };

  
  const columns = [

    {
      key: "mapel_name",
      label: "Mapel",
      render: (val: string) => val || "-",
    },
    {
      key: "teacher_name",
      label: "Teacher",
      render: (val: string) => val || "-",
    },
    {
      key: "class_name",
      label: "Class",
      render: (val: string) => val || "-",
    },
    {
      key: "date",
      label: "Date",
      render: (val: string) => val || "-",
    },
    {
      key: "start_at",
      label: "Start At",
      render: (val: string) => val || "-",
    },
    {
      key: "end_at",
      label: "End At",
      render: (val: string) => val || "-",
    },
      {
      key: "code",
      label: "Code",
      render: (val: string) => (
        <button
          onClick={() => {
            setSelectedCode(val);
            setQrModalOpen(true);
          }}
          className="text-fuchsia-600 hover:text-fuchsia-800 font-mono font-bold underline"
        >
          {val || "-"}
        </button>
      ),
    },
    // ... rest of columns
  ];

  const handleCreate = () => {
    const newFrame = {
      ...initialFormState,
      code: generateCode()
    };
    setCurrentFrame(newFrame);
    setIsFormOpen(true);
  };

  const handleEdit = (frame: any) => {
    setCurrentFrame({
      id: frame.id,
      mapel_id: frame.mapel_id || 0,
      teacher_id: frame.teacher_id || 0,
      class_id: frame.class_id || 0,
      date: frame.date || "",
      code: frame.code || "",
      start_at: frame.start_at || "",
      end_at: frame.end_at || "",
    });
    setIsFormOpen(true);
  };

  const handleDelete = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await fetch("/api/teacher?limit=1000");
        const result = await res.json();
        if (result.status) {
          setTeacherList(result.data);
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

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await fetch("/api/master-class?limit=1000");
        const result = await res.json();
        if (result.status) {
          setClassList(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch class", err);
      }
    };
    fetchClass();
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
        onDelete={handleDelete}
        refreshTrigger={refreshTrigger}
      />

          {qrModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center">
            <h3 className="text-lg font-bold mb-4 text-gray-800">QR Attendance Code</h3>
            
            <div className="bg-white p-4 border-4 border-fuchsia-100 rounded-lg">
              <QRCode value={selectedCode} size={200} />
            </div>
            
            <p className="mt-4 text-gray-600 font-mono text-xl font-bold">{selectedCode}</p>
            
            <button
              onClick={() => setQrModalOpen(false)}
              className="mt-6 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <OffcanvasForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={currentFrame.id ? "Edit Schedule" : "Create Schedule"}
        onSubmit={handleSubmit}
        loading={loading}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teacher *
            </label>
            <select
              required
              value={currentFrame.teacher_id}
              onChange={(e) =>
                setCurrentFrame({
                  ...currentFrame,
                  teacher_id: Number(e.target.value),
                })
              }
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mapel *
            </label>
            <select
              required
              value={currentFrame.mapel_id}
              onChange={(e) =>
                setCurrentFrame({
                  ...currentFrame,
                  mapel_id: Number(e.target.value),
                })
              }
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class *
            </label>
            <select
              required
              value={currentFrame.class_id}
              onChange={(e) =>
                setCurrentFrame({
                  ...currentFrame,
                  class_id: Number(e.target.value),
                })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fuchsia-500"
            >
              <option value={0}>Pilih Class</option>
              {classList.map((kelas) => (
                <option key={kelas.id} value={kelas.id}>
                  {kelas.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={currentFrame.date}
                onChange={(e) =>
                  setCurrentFrame({ ...currentFrame, date: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                readOnly
                value={currentFrame.code}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setCurrentFrame({ ...currentFrame, code: generateCode() })}
                className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition font-medium"
              >
                Generate
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Code dibuat otomatis (12 digit angka). Klik Generate untuk membuat code baru.</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start At
              </label>
              <input
                type="datetime-local"
                value={currentFrame.start_at}
                onChange={(e) =>
                  setCurrentFrame({ ...currentFrame, start_at: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End At
            </label>
            <input
                type="datetime-local"
                value={currentFrame.end_at}
                onChange={(e) =>
                    setCurrentFrame({ ...currentFrame, end_at: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fuchsia-500"
            />
          </div>
        </div>
      </OffcanvasForm>
    </div>
  );
}
