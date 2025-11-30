//mapel_id,teacher_id,start_at,end_at//
import pool from "@/app/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  try {
    const { mapel_id,teacher_id,date } = await request.json();

    if (!mapel_id) {
      return NextResponse.json(
        { status: false, message: "mapel_id is required" },
        { status: 400 }
      );
    }
      if (!teacher_id) {
        return NextResponse.json(
          { status: false, message: "teacher_id is required" },
          { status: 400 }
        );
    }
    if (!date) {
      return NextResponse.json(
        { status: false, message: "date is required" },
        { status: 400 }
        );
    }  
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO schedule (mapel_id, teacher_id, date, start_at, end_at, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW(), NOW(), NOW())",
      [mapel_id, teacher_id, date]
    );
    return NextResponse.json({
      status: true,
      id: result.insertId,
      message: "schedule added successfully",
    });
  } catch (err) {
    console.error("Error in /api/schedule POST:", err);
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
      `SELECT 
            schedule.id AS id, 
            mapel.name AS mapel_name,
            teacher.name AS teacher_name,
            schedule.created_at AS created,
            schedule.updated_at AS updated
           
        FROM schedule
        INNER JOIN mapel
          ON schedule.mapel_id = mapel.id
          
        INNER JOIN teacher
          ON schedule.teacher_id = teacher.id;
      `    
    );

    return NextResponse.json({
      status: true,
      datas: rows,
    });
  } catch (err) {
    console.error("Error in /api/schedule GET:", err);
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
      "DELETE FROM schedule WHERE id = ?",
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
    console.error("Error in /api/schedule DELETE:", err);
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
    console.error("Error in /api/schedule PUT:", err);
    return NextResponse.json(
      {
        status: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}
