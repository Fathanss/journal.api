//untuk membuat tabel//
"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaChevronLeft, FaChevronRight, FaEdit, FaTrash, FaPlus, FaSpinner, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";

interface Column {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
    title: string;
    apiUrl: string;
    columns: Column[];
    onCreate?: () => void;
    onView?: (row: any) => void;
    onEdit?: (row: any) => void;
    onDelete?: (row: any) => void;
    refreshTrigger?: number; // Add a prop to trigger refresh externally
    extraParams?: Record<string, string>;
    onExport?: () => void;
    onDataLoaded?: (response: any) => void;
}

export default function DataTable({
    title,
    apiUrl,
    columns,
    onCreate,
    onView,
    onEdit,
    onDelete,
    refreshTrigger = 0,
    extraParams = {},
    onExport,
    onDataLoaded
}: DataTableProps) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Fetch data :fungsi untuk mendapat data
    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
                search: debouncedSearch,
                ...extraParams
            });
            const res = await fetch(`${apiUrl}?${params}`);
            const result = await res.json();
            if (result.status) {           
                setData(result.data);
                if (onDataLoaded) onDataLoaded(result);
                if (result.pagination) {
                    setTotalPages(result.pagination.totalPages);
                }
            }
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, debouncedSearch, refreshTrigger, apiUrl, JSON.stringify(extraParams)]);

    const handleDelete = async (row: any) => {
        if (!onDelete) return;

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                await fetch(`${apiUrl}?id=${row.id}`, { method: "DELETE" });
                Swal.fire("Deleted!", "Record has been deleted.", "success");
                fetchData();
            } catch (err) {
                Swal.fire("Error!", "Failed to delete record.", "error");
            }
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                <div className="flex gap-4">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
                        />
                    </div>
                    {onExport && (
                        <button
                            onClick={onExport}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <span>Export</span>
                        </button>
                    )}
                    {onCreate && (
                        <button
                            onClick={onCreate}
                            className="flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <FaPlus /> <span>New</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    {col.label}
                                </th>
                            ))}
                            {(onEdit || onDelete || onView) && (
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-500">
                                    <div className="flex justify-center items-center gap-2">
                                        <FaSpinner className="animate-spin" /> Loading...
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-500">
                                    No records found
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr key={row.id || row.key} className="hover:bg-gray-50 transition-colors">
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {col.render ? col.render(row[col.key], row) : row[col.key]}
                                        </td>
                                    ))}
                                    {(onEdit || onDelete || onView) && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                {onView && (
                                                    <button
                                                        onClick={() => onView(row)}
                                                        className="text-fuchsia-600 hover:text-fuchsia-800 p-1 bg-fuchsia-50 rounded"
                                                    >
                                                        <FaEye />
                                                    </button>
                                                )}
                                                {onEdit && (
                                                    <button
                                                        onClick={() => onEdit(row)}
                                                        className="text-blue-600 hover:text-blue-800 p-1 bg-blue-50 rounded"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={() => handleDelete(row)}
                                                        className="text-red-600 hover:text-red-800 p-1 bg-red-50 rounded"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                    Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                        <FaChevronLeft className="text-gray-500" />
                    </button>
                    <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                        <FaChevronRight className="text-gray-500" />
                    </button>
                </div>
            </div>
        </div>
    );
}
