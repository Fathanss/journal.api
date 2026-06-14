import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
    let connection;
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json(
                { status: false, message: "Token required" },
                { status: 400 }
            );
        }

        // 1. Get a connection from the pool
        connection = await pool.getConnection();

        // 2. Delete the token from access_tokens table
        await connection.execute(
            'DELETE FROM access_tokens WHERE token = ?',
            [token]
        );

        // 3. Return Successful Response
        return NextResponse.json(
            { status: true, message: "Logout successful" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Logout Error:", error);

        return NextResponse.json(
            { status: false, message: "Internal server error" },
            { status: 500 }
        );
    } finally {
        // 4. ALWAYS release the connection back to the pool
        if (connection) {
            connection.release();
        }
    }
}
