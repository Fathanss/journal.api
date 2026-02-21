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

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    const offset = (page - 1) * limit;

    let whereClause = "";
    const params: any[] = [];

    if (search) {
      whereClause = `
      WHERE 
        mapel.name LIKE ? OR 
        teacher.name LIKE ? OR 
        schedule.date LIKE ?
      `;
      const keyword = `%${search}%`;
      params.push(keyword, keyword, keyword);
    }

    const [countRows] = await pool.query<RowDataPacket[]>(
      `
      SELECT COUNT(*) AS total
      FROM schedule
      ${whereClause}
      `,
      params,
    );

    const total = countRows[0]?.total;

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
            schedule.id AS id, 
            mapel.name AS mapel_name,
            teacher.name AS teacher_name,
            schedule.date AS date,
            schedule.start_at AS start_at,
            schedule.end_at AS end_at,            
            schedule.created_at AS created,
            schedule.updated_at AS updated
           
        FROM schedule
        INNER JOIN mapel ON schedule.mapel_id = mapel.id
        INNER JOIN teacher ON schedule.teacher_id = teacher.id
        ${whereClause}
        ORDER BY schedule.created_at DESC
        LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );
          
    return NextResponse.json({
      status: true,
      datas: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
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
    const { id, mapel_id, teacher_id, date } = await request.json();
    if (!id) {
      return NextResponse.json(
        { status: false, message: "id is required" },
        { status: 400 }
      );
    }
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE schedule SET mapel_id = ?, teacher_id = ?, date = ?, updated_at = NOW() WHERE id = ?",
      [mapel_id, teacher_id, date, id]
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
