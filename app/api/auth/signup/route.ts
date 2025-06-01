import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password } = body.data;
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required", status: 400 },
        { status: 400 }
      );
    }
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcryptjs.hash(password, 12);
    const code = crypto.randomInt(0, 999999).toString().padStart(6, "0");
    const hashedCode = await bcryptjs.hash(code, 12);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        verificationCode: hashedCode,
      },
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
