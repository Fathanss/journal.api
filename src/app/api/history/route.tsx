//LAROGON LOGIN root//
import pool from "@/app/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const student_id = parseInt(searchParams.get("student_id") || "0", 10);
    const today_only = searchParams.get("today_only") === "true";
    
    // Build the WHERE clause
    let whereClause = "";
    const queryParams: any[] = [];
    
    if (student_id) {
      whereClause += "WHERE journal.student_id = ?";
      queryParams.push(student_id);
    }
    
    if (today_only) {
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      const todayStart = todayDate.toISOString().split('T')[0];
      const tomorrowStart = new Date(todayDate);
      tomorrowStart.setDate(tomorrowStart.getDate() + 1);
      const tomorrowStartStr = tomorrowStart.toISOString().split('T')[0];
      
      if (whereClause) {
        whereClause += " AND DATE(journal.scan_in) = CURDATE()";
      } else {
        whereClause = "WHERE DATE(journal.scan_in) = CURDATE()";
      }
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
            journal.id AS id, 
            journal.student_id AS student_id,
            journal.schedule_id AS schedule_id,
            students.name AS student_name,
            schedule.date AS tanggal,
            mapel.name AS mapel_name,
            teacher.name AS guru_name,
            journal.scan_in AS scan_in,
            journal.scan_out AS scan_out,
            journal.notes AS notes

        FROM journal
        INNER JOIN students ON students.id = journal.student_id
        INNER JOIN schedule ON schedule.id = journal.schedule_id
        INNER JOIN mapel ON schedule.mapel_id = mapel.id
        INNER JOIN teacher ON schedule.teacher_id = teacher.id
        ${whereClause}
        ORDER BY journal.scan_in DESC`,
      queryParams,
    );

    return NextResponse.json({
      status: true,
      data: rows,
    });
  } catch (err) {
    console.error("Error in /api/history GET:", err);
    return NextResponse.json(
      {
        status: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 },
    );
  }
}
