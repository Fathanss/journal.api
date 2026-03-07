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

    const offset = (page - 1) * limit;

    let whereClause = "";
    const params: any[] = [];
     if (search) {
      whereClause = `
      WHERE 
      students.name LIKE ? OR 
      schedule.name LIKE ?`
      ;
      const keyword = `%${search}%`;
      params.push(keyword, keyword);
    }
    
    const [countRows] = await pool.query<RowDataPacket[]>(
      `
      SELECT COUNT(*) AS total 
      FROM journal
      ${whereClause}
      `,
      params,
    );

    const total = countRows[0].total;

    const [rows] = await pool.query<RowDataPacket[]>
    (`SELECT 
            journal.id AS id, 
            journal.student_id AS student_id,
            journal.schedule_id AS schedule_id,
            students.name AS student_name,
            schedule.id AS schedule_id,
            journal.scan_in AS scan_in,
            journal.scan_out AS scan_out,
            journal.notes AS notes

        FROM journal
        INNER JOIN students
          ON  students.id = journal.student_id
        INNER JOIN schedule
          ON  schedule.id = journal.schedule_id
        ${whereClause}
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
    const { name } = await request.json();

    return NextResponse.json({
      status: true,
      data: "put Method",
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
