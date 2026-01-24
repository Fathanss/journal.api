import pool from "@/app/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
//id,name,username,created-at,updated-at//
export async function POST(request: NextRequest) {
  try {
    const { name,username,password,skill } = await request.json();

    if (!name) {
      return NextResponse.json(
        { status: false, message: "Name is required" },
        { status: 400 }
      );
    }
    if (!skill) {
      return NextResponse.json(
        { status: false, message: "Skill is required" },
        { status: 400 }
      );
    } 
    if (!username) {
        return NextResponse.json(
          { status: false, message: "Username is required" },
          { status: 400 }
        );
    }
    if (!password) {
        return NextResponse.json(
          { status: false, message: "Password is required" },
          { status: 400 }
        );
    }

    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO teacher (name, skill, username, password, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
      [name, skill, username, password]
    );

    return NextResponse.json({
      status: true,
      id: result.insertId,
      message: "teacher added successfully",
    });
  } catch (err) {
    console.error("Error in /api/teacher POST:", err);
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

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM teacher"
    );

    return NextResponse.json({
      status: true,
      datas: rows,
    });
  } catch (err) {
    console.error("Error in /api/teacher GET:", err);
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
      "DELETE FROM teacher WHERE id = ?",
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
    console.error("Error in /api/teacher DELETE:", err);
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
    console.error("Error in /api/teacher PUT:", err);
    return NextResponse.json(
      {
        status: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}
