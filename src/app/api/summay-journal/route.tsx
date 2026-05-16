//name,username,password,class-id//
import pool from "@/app/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
            -- 1. Total number of journal entries
            COUNT(j.id) AS total_journal,

            -- 2. Count of late students (scan_in is after start_at)
            SUM(CASE WHEN j.scan_in > s.start_at THEN 1 ELSE 0 END) AS count_late,

            -- 3. Count of on-time students (scan_in is equal to or before start_at)
            SUM(CASE WHEN j.scan_in <= s.start_at THEN 1 ELSE 0 END) AS count_on_time,

            -- 4. Total unique mapel (subjects) covered in these journals
            COUNT(DISTINCT s.mapel_id) AS total_mapel

        FROM 
            journal j
        INNER JOIN schedule s ON j.schedule_id = s.id;`,
    );

    return NextResponse.json({
      status: true,
      data: rows,
    });
  } catch (err) {
    console.error("Error in /api/students GET:", err);
    return NextResponse.json(
      {
        status: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 },
    );
  }
}
