import pool from "@/app/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json(
        { status: false, message: "Name is required" },
        { status: 400 },
      );
    }
    if (!description) {
      return NextResponse.json(
        { status: false, message: "Description is required" },
        { status: 400 },
      );
    }
    

    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO mapel (name, description, created_at, updated_at) VALUES (?, ?, NOW(), NOW())",
      [name, description],
    );

    return NextResponse.json({
      status: true,
      id: result.insertId,
      message: "Mapel added successfully",
    });
  } catch (err) {
    console.error("Error in /api/mapel POST:", err);
    return NextResponse.json(
      {
        status: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 },
    );
  }
}
//components



//
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
        WHERE name LIKE ? OR description LIKE ?
      `;
      const keyword = `%${search}%`;
      params.push(keyword, keyword);
    }

    /* ======================
       TOTAL DATA COUNT
    ====================== */
    const [countRows] = await pool.query<RowDataPacket[]>(
      `
      SELECT COUNT(*) AS total
      FROM mapel
      ${whereClause}
      `,
      params
    );

    const total = countRows[0].total;

    /* ======================
       MAIN DATA QUERY
    ====================== */
    const [rows] = await pool.query<RowDataPacket[]>(
      `
      SELECT
        id,
        name,
        description,
        created_at,
        updated_at
      FROM mapel
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
      `,
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
    console.error("Error in /api/mapel GET:", err);
    return NextResponse.json(
      {
        status: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, description } = body;

    /* ======================
       BASIC VALIDATION
    ====================== */
    if (!id || !name || !description) {
      return NextResponse.json(
        {
          status: false,
          message: "id, name, and description are required",
        },
        { status: 400 }
      );
    }

    /* ======================
       UPDATE QUERY
    ====================== */
    const [result]: any = await pool.query(
      `
      UPDATE mapel
      SET
        name = ?,
        description = ?,
        updated_at = NOW()
      WHERE id = ?
      `,
      [name, description, id]
    );

    /* ======================
       CHECK AFFECTED ROW
    ====================== */
    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          status: false,
          message: "Data not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: true,
      message: "Data was updated",
    });
  } catch (err) {
    console.error("Error in PUT /api/mapel:", err);
    return NextResponse.json(
      {
        status: false,
        message: err instanceof Error ? err.message : "Error updating data",
      },
      { status: 500 }
    );
  }
}


export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
        const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { status: false, message: "id is required" },
        { status: 400 },
      );
    }

    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM mapel WHERE id = ?",
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
    console.error("Error in /api/mapel DELETE:", err);
    return NextResponse.json(
      {
        status: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 },
    );
  }
}