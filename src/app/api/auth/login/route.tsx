// /app/api/auth/login/route.js (or similar)

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
// Import your MySQL connection pool utility
import pool from "@/app/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// Ensure you set this in your .env file
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key"; 

export async function POST(request: NextRequest) {
    let connection;
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { status: false, message: "username and password required" },
                { status: 401 }
            );
        }

        // 1. Get a connection from the pool
        connection = await pool.getConnection();

        // 2. FIND USER (Replaces prisma.users.findUnique
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id, username, password, name FROM users WHERE username = ?',
            [username]
        );
        
        const user = rows[0]; 

        if (!user) return NextResponse.json(
            { status: false, message: "User Not Found" },
            { status: 404 }
        );

        // 3. Compare Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return NextResponse.json(
            { status: false, message: "Invalid Credential" },
            { status: 401 }
        );

        const publicUser = { id: user.id, username: user.username };
        
        // 4. Generate JWT Token
        const token = jwt.sign(publicUser, SECRET_KEY, { expiresIn: "7d" });

        // Calculate expiry date 7 days from now
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const now = new Date();

        // 5. CREATE ACCESS TOKEN (Replaces prisma.access_tokens.create)
        // Note: Ensure your 'access_tokens' table structure matches these fields
        await connection.execute(
            `INSERT INTO access_tokens (tokenable_type, tokenable_id, token, expires_at, name, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                'Next/User',
                user.id,
                token,
                expiresAt,
                user.name,
                now,
                now
            ]
        );

        // 6. Return Successful Response
        return NextResponse.json(
            { status: true, message: "Login successful", token, data: publicUser },
            { status: 200 }
        );

    } catch (error) {
        console.error("Login Error:", error);

        return NextResponse.json(
            { status: false, message: "Internal server error" },
            { status: 500 }
        );
    } finally {
        // 7. ALWAYS release the connection back to the pool
        if (connection) {
            connection.release();
        }
    }
}