import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";
import { INITIAL_USERS } from "@/lib/mock-data";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    let token = authHeader?.replace("Bearer ", "");

    if (!token) {
      // Check cookie
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        const match = cookieHeader.match(/dbesto_jwt=([^;]+)/);
        if (match) token = match[1];
      }
    }

    if (!token) {
      return NextResponse.json({ authenticated: false, message: "Token JWT tidak ditemukan." }, { status: 401 });
    }

    const payload = await verifyJwtToken(token);
    if (!payload) {
      return NextResponse.json({ authenticated: false, message: "Token JWT tidak valid atau kedaluwarsa." }, { status: 401 });
    }

    const user = INITIAL_USERS.find((u) => u.id === payload.id);

    return NextResponse.json({
      authenticated: true,
      user: user || payload,
      token,
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, message: "Gagal memverifikasi token." }, { status: 500 });
  }
}
