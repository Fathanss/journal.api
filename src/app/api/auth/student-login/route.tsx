// /app/api/auth/student-login/route.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
  let connection;
  try {
    const { username, password } = await request.json();

    // 1. Cek payload yang dikirim dari frontend
    console.log("=== DEBUG LOGIN ===");
    console.log("1. Payload masuk:", { username, password });

    if (!username || !password) {
      return NextResponse.json(
        { status: false, message: "username and password required" },
        { status: 401 }
      );
    }

    connection = await pool.getConnection();

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, username, password, class_id, name FROM students WHERE username = ?",
      [username]
    );

    const user = rows[0];

    // 2. Cek apakah user ketemu di database
    console.log("2. Data user dari DB:", user ? "User Ditemukan" : "TIDAK DITEMUKAN");

    if (!user) {
      return NextResponse.json(
        { status: false, message: "User Not Found" },
        { status: 404 }
      );
    }

    // 3. Cek perbandingan password
    console.log("3. Proses compare password mentah VS hash dari DB");
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("4. Hasil compare:", isMatch);
    console.log("===================");

    if (!isMatch) {
      return NextResponse.json(
        { status: false, message: "Invalid Credential" },
        { status: 401 }
      );
    }

    const publicUser = {
      id: user.id,
      username: user.username,
      name: user.name,
      class_id: user.class_id,
    };

    const token = jwt.sign(publicUser, SECRET_KEY, { expiresIn: "7d" });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const now = new Date();

    await connection.execute(
      `INSERT INTO access_tokens (tokenable_type, role, tokenable_id, token, expires_at, name, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ["Next/User", "student", user.id, token, expiresAt, user.name, now, now]
    );

    return NextResponse.json(
      { status: true, message: "Login successful", token, data: publicUser, role: 'student' },
      { status: 200 }
    );

  } catch (error) {
    console.error("Login Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}