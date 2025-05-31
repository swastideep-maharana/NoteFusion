import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const POST = async (req: Request) => {
  const body = await req.json();
  const { username, password, email } = body;

  try {
    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "User already exists",
          status: 409,
        },
        { status: 409 }
      );
    }

    // Hash password and create verification code
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationCode = crypto.randomInt(0, 999999).toString();
    const hashedVerificationCode = await bcrypt.hash(verificationCode, 12);

    /*
    TODO: Send verification email
    */

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        verificationCode: hashedVerificationCode,
      },
    });

    return Response.json(
      {
        message: "User created successfully",
        success: true,
        status: 201,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        message: "Internal server error when creating user",
        success: false,
        status: 500,
      },
      { status: 500 }
    );
  }
};