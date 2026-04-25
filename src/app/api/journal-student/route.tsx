//LAROGON LOGIN root//
import pool from "@/app/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { schedule_code, student_id } = await request.json();

    if (!schedule_code) {
      return NextResponse.json(
        { status: false, message: "schedule_code is required" },
        { status: 400 },
      );
    }
    if (!student_id) {
      return NextResponse.json(
        { status: false, message: "student_id is required" },
        { status: 400 },
      );
    }

    const [schedules] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM schedule WHERE code = ?",
      [schedule_code],
    );

    if (schedules.length === 0) {
      return NextResponse.json(
        { status: false, message: "Invalid schedule code" },
        { status: 404 },
      );
    }

    const schedule_id = schedules[0].id;

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO journal (student_id, schedule_id, scan_in) 
   SELECT ?, ?, NOW() 
   FROM DUAL 
   WHERE NOT EXISTS (
     SELECT 1 FROM journal 
     WHERE student_id = ? AND schedule_id = ?
   )`,
      [student_id, schedule_id, student_id, schedule_id],
    );

    // Note: If result.affectedRows is 0, it means it was a duplicate.
    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          status: false,
          message: "You have already scanned for this schedule.",
        },
        { status: 409 }, // Conflict
      );
    }

    return NextResponse.json({
      status: true,
      id: result.insertId,
      message: "journal added successfully",
    });
  } catch (err) {
    console.error("Error in /api/journal POST:", err);
    return NextResponse.json(
      {
        status: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const student_id = parseInt(searchParams.get("student_id") || "0", 10);
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
        ${student_id ? "WHERE journal.student_id = ?" : ""}
        ORDER BY journal.scan_in DESC`,
      [...(student_id ? [student_id] : [])],
    );

    return NextResponse.json({
      status: true,
      data: rows,
    });
  } catch (err) {
    console.error("Error in /api/journal GET:", err);
    return NextResponse.json(
      {
        status: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 },
    );
  }
}
