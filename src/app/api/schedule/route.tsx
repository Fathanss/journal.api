//mapel_id,teacher_id,start_at,end_at//
import pool from "@/app/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  try {
    const { mapel_id, teacher_id, class_id, date, code } = await request.json();

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
    if (!class_id) {
      return NextResponse.json(
        { status: false, message: "class_id is required" },
        { status: 400 }
      );
    }
    if (!code) {
      return NextResponse.json(
        { status: false, message: "code is required" },
        { status: 400 }
      );
    }
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO schedule (mapel_id, teacher_id, class_id, date, code, start_at, end_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW(), NOW(), NOW())",
      [mapel_id, teacher_id, class_id, date, code]
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
    const classId = searchParams.get("class_id") || "";
    
    // Tangkap parameter start_date dan end_date dari frontend
    const startDate = searchParams.get("start_date") || "";
    const endDate = searchParams.get("end_date") || "";

    const offset = (page - 1) * limit;

    // Array untuk menampung kondisi SQL secara dinamis
    const conditions: string[] = [];
    const params: any[] = [];

    // 1. Kondisi Pencarian (Search)
    if (search) {
      conditions.push(`(
        mapel.name LIKE ? OR 
        teacher.name LIKE ? OR 
        master_class.name LIKE ? OR
        schedule.date LIKE ?
      )`);
      const keyword = `%${search}%`;
      params.push(keyword, keyword, keyword, keyword); // Ditambah 1 keyword lagi karena ada 4 kolom LIKE
    }

    // 2. Kondisi Class ID
    if (classId) {
      conditions.push(`schedule.class_id = ?`);
      params.push(classId);
    }

    // 3. Kondisi Date Range (Rentang Tanggal)
    if (startDate && endDate) {
      conditions.push(`schedule.date BETWEEN ? AND ?`);
      params.push(startDate, endDate);
    } else if (startDate) {
      conditions.push(`schedule.date >= ?`);
      params.push(startDate);
    } else if (endDate) {
      conditions.push(`schedule.date <= ?`);
      params.push(endDate);
    }

    // Gabungkan seluruh kondisi menjadi klausa WHERE tunggal yang valid
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Hitung total data untuk pagination menggunakan parameter yang sama
    const [countRows] = await pool.query<RowDataPacket[]>(
      `
      SELECT COUNT(*) AS total
      FROM schedule
      INNER JOIN mapel ON schedule.mapel_id = mapel.id
      INNER JOIN teacher ON schedule.teacher_id = teacher.id
      LEFT JOIN master_class ON schedule.class_id = master_class.id
      ${whereClause}
      `,
      params,
    );

    const total = countRows[0]?.total || 0;

    // Ambil data rows dari database
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT
            schedule.id AS id,
            schedule.mapel_id AS mapel_id,
            schedule.teacher_id AS teacher_id,
            mapel.name AS mapel_name,
            teacher.name AS teacher_name,
            master_class.id AS class_id,
            master_class.name AS class_name,
            schedule.code AS code,
            schedule.date AS date,
            schedule.start_at AS start_at,
            schedule.end_at AS end_at,
            schedule.created_at AS created,
            schedule.updated_at AS updated

        FROM schedule
        INNER JOIN mapel ON schedule.mapel_id = mapel.id
        INNER JOIN teacher ON schedule.teacher_id = teacher.id
        LEFT JOIN master_class ON schedule.class_id = master_class.id
        ${whereClause}
        ORDER BY schedule.date ASC, schedule.start_at ASC
        LIMIT ? OFFSET ?`,
      [...params, limit, offset],
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
    // Get id from query parameter or request body
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");
    
    if (!id) {
      const body = await request.json();
      id = body.id;
    }

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
    const { id, mapel_id, teacher_id, class_id, date, code, start_at, end_at } = await request.json();
    if (!id) {
      return NextResponse.json(
        { status: false, message: "id is required" },
        { status: 400 }
      );
    }

    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE schedule SET mapel_id = ?, teacher_id = ?, class_id = ?, date = ?, code = ?, start_at = ?, end_at = ?, updated_at = NOW() WHERE id = ?",
      [mapel_id, teacher_id, class_id, date, code, start_at, end_at, id]
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
