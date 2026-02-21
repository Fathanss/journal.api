//name,username,password,class-id//
import pool from "@/app/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
//id,name,username,created-at,updated-at//
export async function POST(request: NextRequest) {
  try {
    const { name, username, password, class_id } = await request.json();

    if (!name) {
      return NextResponse.json(
        { status: false, message: "Name is required" },
        { status: 400 },
      );
    }
    if (!username) {
      return NextResponse.json(
        { status: false, message: "Username is required" },
        { status: 400 },
      );
    }
    if (!password) {
      return NextResponse.json(
        { status: false, message: "Password is required" },
        { status: 400 },
      );
    }
    if (!class_id) {
      return NextResponse.json(
        { status: false, message: "Class ID is required" },
        { status: 400 },
      );
    }

    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO students (name, username, password, class_id, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
      [name, username, password, class_id],
    );

    return NextResponse.json({
      status: true,
      id: result.insertId,
      message: "students added successfully",
    });
  } catch (err) {
    console.error("Error in /api/students POST:", err);
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

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    const offset = (page - 1) * limit;

    /* ======================
       WHERE (search)
    ====================== */
    let whereClause = "";
    const params: any[] = [];

    if (search) {
      whereClause = `
        WHERE name LIKE ?
      `;
      const keyword = `%${search}%`;
      params.push(keyword);
    }

    /* ======================
       TOTAL DATA COUNT
    ====================== */
    const [countRows] = await pool.query<RowDataPacket[]>(
      `
      SELECT COUNT(*) AS total
      FROM students
      ${whereClause}
      `,
      params,
    );

    const total = countRows[0].total;

    /* ======================
       MAIN DATA QUERY
    ====================== */

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
    s.id,
    s.name,
    s.username,
    s.password,
    s.class_id,
    mc.name AS class_name
FROM students s
INNER JOIN master_class mc ON s.class_id = mc.id
${whereClause}
ORDER BY s.created_at DESC
LIMIT ?
      `,
      [...params, limit],
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { status: false, message: "id is required" },
        { status: 400 },
      );
    }

    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM students WHERE id = ?",
      [id],
    );

    if (result.affectedRows > 0) {
      return NextResponse.json({
        status: true,
        message: "sukses menghapus data",
      });
    } else {
      return NextResponse.json({
        status: false,
        message: "gagal menghapus data",
      });
    }
  } catch (err) {
    console.error("Error in /api/students DELETE:", err);
    return NextResponse.json(
      {
        status: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, username, password, class_id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { status: false, message: "id is required" },
        { status: 400 },
      );
    }
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE students SET name = ?, username = ?, password = ?, class_id = ?, updated_at = NOW() WHERE id = ?",
      [name, username, password, class_id, id],
    );
    if (result.affectedRows > 0) {
      return NextResponse.json({
        status: true,
        message: "sukses mengupdate data",
      });
    } else {
      return NextResponse.json({
        status: false,
        message: "gagal mengupdate data",
      });
    }
    return NextResponse.json({
      status: true,
      data: "put Method",
    });
  } catch (err) {
    console.error("Error in /api/students PUT:", err);
    return NextResponse.json(
      {
        status: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 },
    );
  }
}
