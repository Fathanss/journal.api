//LAROGON LOGIN root//
import pool from "@/app/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { participants_id,check_in,check_out,status,notes } = await request.json();

    if (!participants_id) {
      return NextResponse.json(
        { status: false, message: "participants_id is required" },
        { status: 400 }
      );
    }
    if (!check_in) {
      return NextResponse.json(
        { status: false, message: "check_in is required" },
        { status: 400 }
      );
    }
     if (!check_out) {
      return NextResponse.json(
        { status: false, message: "check_out is required" },
        { status: 400 }
      );
    }
    if (!status) {
        return NextResponse.json(
        { status: false, message: "status is required" },
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
      "INSERT INTO journal (participants_id, check_in, check_out, status, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
      [participants_id, check_in, check_out, status, notes]
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

    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM journal");

    return NextResponse.json({
      status: true,
      datas: rows,
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
