import { NextResponse } from "next/server";
import { INITIAL_USERS } from "@/lib/mock-data";
import { signJwtToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { emailOrUsername, password } = body;

    if (!emailOrUsername || !password) {
      return NextResponse.json(
        { success: false, message: "Username/Email dan Password wajib diisi." },
        { status: 400 }
      );
    }

    const trimmedInput = emailOrUsername.trim().toLowerCase();

    // Find matching user by email or username
    const user = INITIAL_USERS.find(
      (u) =>
        u.email.toLowerCase() === trimmedInput ||
        (u.username && u.username.toLowerCase() === trimmedInput)
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Akun pengguna tidak ditemukan. Periksa username atau email Anda." },
        { status: 401 }
      );
    }

    // Verify password
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, message: "Password yang Anda masukkan salah." },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: "Akun Anda berstatus non-aktif. Hubungi Administrator HQ." },
        { status: 403 }
      );
    }

    // Create JWT Token signed with HS256
    const token = await signJwtToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      outletId: user.outletId,
      outletName: user.outletName,
    });

    const response = NextResponse.json({
      success: true,
      message: "Autentikasi JWT Berhasil.",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        outletId: user.outletId,
        outletName: user.outletName,
      },
    });

    // Set JWT in HTTP cookie
    response.cookies.set({
      name: "dbesto_jwt",
      value: token,
      httpOnly: false, // accessible for client token validation
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server saat memproses login." },
      { status: 500 }
    );
  }
}
