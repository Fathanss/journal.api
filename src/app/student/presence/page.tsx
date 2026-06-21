"use client";

import React, { useEffect, useState } from "react";
import MainStudentLayout from "@/app/components/student/MainStudentLayout";
import { Html5QrcodeScanner } from "html5-qrcode";
import { CheckCircle2, Clock } from "lucide-react";

interface PresenceRecord {
  id: string | number;
  time: string;
  location: string;
  teacher: string;
  subject: string;
}

export default function PresencePage() {
  const [scans, setScans] = useState<PresenceRecord[]>([]);
  const STUDENT_ID = 2;

  const fetchJournalData = async () => {
    try {
      const response = await fetch(
        `/api/journal-student?student_id=${STUDENT_ID}&today_only=true`,
      );
      const result = await response.json();

      if (result.status) {
        // Map the API data to your UI structure
        const formattedData = result.data.map((item: any) => ({
          id: item.id,
          time: new Date(item.scan_in).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          location: item.tanggal || "No Date",
          teacher: item.guru_name,
          subject: item.mapel_name,
        }));
        setScans(formattedData);
      }
    } catch (error) {
      console.error("Failed to fetch journal:", error);
    }
  };

  const handlePresenceScan = async (decodedText: string) => {
    try {
      const response = await fetch("/api/journal-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          schedule_code: decodedText,
          student_id: STUDENT_ID,
        }),
      });
      
      const result = await response.json();
      if (result.status) {
        await fetchJournalData();
        console.log("Attendance recorded and list refreshed");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Failed to submit presence:", error);
    }
  };

  useEffect(() => {
    fetchJournalData();

    // Initialize Scanner
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false,
    );

    scanner.render(
      // 1. Success Callback
      (decodedText: string) => {
        setScans((prev) => {
          handlePresenceScan(decodedText);

          return [...prev];
        });
      },
      // 2. Error Callback (The missing argument)
      (errorMessage) => {
        // Strategy: Only log actual errors, not "QR code not found" frame noise.
        // Most users leave this empty to avoid flooding the console.
        // console.warn(`QR Code scan error: ${errorMessage}`);
      },
    );

    return () => {
      scanner
        .clear()
        .catch((error) => console.error("Failed to clear scanner", error));
    };
  }, []);

  return (
    <MainStudentLayout>
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Presence</h1>
        <p className="text-gray-500">
          Scan the QR code provided by the instructor to record your attendance.
        </p>
      </div>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left (Desktop) / Top (Mobile): Scanner */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            QR Scanner
          </h2>
          <div
            id="reader"
            className="overflow-hidden rounded-lg border-0"
          ></div>
          <p className="mt-4 text-xs text-center text-gray-400">
            Ensure your camera has permission to scan
          </p>
        </div>

        {/* Right (Desktop) / Bottom (Mobile): List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Today's Presence</h2>

          <div className="space-y-4">
            {scans.length > 0 ? (
              scans.map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 text-green-600 rounded-full">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {scan.subject}
                      </p>
                      <p className="text-sm text-gray-600">
                        {scan.teacher}
                      </p>
                      
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock size={14} /> {scan.time}
                      </p>
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400 italic">
                No attendance recorded yet today.
              </div>
            )}
          </div>
        </div>
      </div>
    </MainStudentLayout>
  );
}
