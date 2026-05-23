//LAROGON LOGIN root//
import pool from "@/app/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { schedule_id,student_id,scan_in,scan_out,notes } = await request.json();

    if (!schedule_id) {
      return NextResponse.json(
        { status: false, message: "schedule_id is required" },
        { status: 400 }
      );
    }
    if (!student_id) {
      return NextResponse.json(
        { status: false, message: "student_id is required" },
        { status: 400 }
      );
    }
     if (!scan_in) {
      return NextResponse.json(
        { status: false, message: "scan_in is required" },
        { status: 400 }
      );
    }
    if (!scan_out) {
        return NextResponse.json(
        { status: false, message: "scan_out is required" },
        { status: 400 }
        );
    }
    if (!notes) {
        return NextResponse.json(
        { status: false, message: "notes is required" },
        { status: 400 }
        );
    }

    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO journal (student_id,schedule_id, scan_in, scan_out, notes) VALUES (?, ?, ?, ?, ?)",
      [student_id,schedule_id, scan_in, scan_out, notes]
    );

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
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const student_id = parseInt(searchParams.get("student_id") || "0");
    const date_from = searchParams.get("date_from") || "";
    const date_to = searchParams.get("date_to") || "";

    const offset = (page - 1) * limit;

    let whereClause = "WHERE 1=1";
    const params: any[] = [];
    
    if (student_id > 0) {
      whereClause += " AND journal.student_id = ?";
      params.push(student_id);
    }
    
    if (date_from) {
      whereClause += " AND schedule.date >= ?";
      params.push(date_from);
    }
    
    if (date_to) {
      whereClause += " AND schedule.date <= ?";
      params.push(date_to);
    }
    
    if (search) {
      whereClause += " AND (students.name LIKE ? OR mapel.name LIKE ? OR teacher.name LIKE ? OR schedule.date LIKE ?)";
      const keyword = `%${search}%`;
      params.push(keyword, keyword, keyword, `%${search}%`);
    }
    
    const [countRows] = await pool.query<RowDataPacket[]>(
      `
      SELECT COUNT(*) AS total 
      FROM journal
      INNER JOIN schedule ON journal.schedule_id = schedule.id
      INNER JOIN mapel ON schedule.mapel_id = mapel.id
      INNER JOIN teacher ON schedule.teacher_id = teacher.id
      INNER JOIN students ON journal.student_id = students.id
      ${whereClause}
      `,
      params,
    );

    const total = countRows[0].total as number;

    const [rows] = await pool.query<RowDataPacket[]>
    (`SELECT 
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
        ORDER BY journal.scan_in DESC
        LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
  

    return NextResponse.json({
      status: true,
      data: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Error in /api/journal GET:", err);
    return NextResponse.json(
      {
        status: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { status: false, message: "id is required" },
        { status: 400 }
      );
    }

    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM journal WHERE id = ?",
      [id]
    );

    if (result.affectedRows > 0){ 
      return NextResponse.json({
        status: true,
        message: "sukses menghapus data",
      });
    }else{
      return NextResponse.json({
        status: false,
        message: "gagal menghapus data",
      });
    }
      
  } catch (err) {
    console.error("Error in /api/journal DELETE:", err);
    return NextResponse.json(
      {
        status: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, schedule_id, student_id, scan_in, scan_out, notes } = body;

    if (!id || !schedule_id || !student_id || !scan_in || !scan_out ) {
      return NextResponse.json(
        { status: false, message: "id, schedule, student_id, scan_in, scan_out is required" },
        { status: 400 }
      );
    }

    //update data
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE journal 
      SET
        schedule_id = ?, 
        student_id = ?,
        scan_in = ?, 
        scan_out = ?, 
        notes = ? 
        WHERE id  = ?
        `,
      [schedule_id, student_id, scan_in, scan_out, notes, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { status: false, message: "No journal found with the provided id" },
        { status: 404 }
      );
    }
      return NextResponse.json({
        status: true,
        message: "Data was updated",
      });
    } catch (err) {
    console.error("Error in /api/journal PUT:", err);
    return NextResponse.json(
      {
        status: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}
