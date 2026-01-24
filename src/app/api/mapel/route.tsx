import pool from "@/app/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, description, teacher_name } = await request.json();

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
    if (!teacher_name) {
      return NextResponse.json(
        { status: false, message: "teacher_name is required" },
        { status: 400 },
      );
    }

    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO mapel (name, description, teacher_name, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
      [name, description, teacher_name],
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
      mapel.id,
      mapel.name,
      mapel.description,
      mapel.teacher_name,
      mapel.created_at,
      mapel.updated_at
    FROM mapel
    INNER JOIN teacher ON mapel.teacher_name = teacher.name;`,
    );

    return NextResponse.json({
      status: true,
      datas: rows,
    });
  } catch (err) {
    console.error("Error in /api/mapel GET:", err);
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
    const { id } = await request.json();

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

export async function PUT(request: NextRequest) {
  try {
    const { name } = await request.json();

    return NextResponse.json({
      status: true,
      data: "put Method",
    });
  } catch (err) {
    console.error("Error in /api/mapel PUT:", err);
    return NextResponse.json(
      {
        status: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 },
    );
  }
}
