import { sendVerificationEmail } from "@/lib/nodemailer/nodemailer";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { username, code } = body;

    if (!username || !code) {
      return Response.json(
        {
          success: false,
          message: "Missing username or code",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const isValidCode = await bcrypt.compare(
      code,
      user.verificationCode as string
    );

    if (isValidCode) {
      if (user.verified) {
        return Response.json(
          {
            success: false,
            message: "User is already verified please login",
            status: 400,
          },
          { status: 400 }
        );
      }
      if (user.verificationExpiry! < new Date()) {
        const newCode = crypto.randomInt(0, 999999).toString().padStart(6, "0");
        const hashedCode = await bcrypt.hash(newCode, 12);

        await prisma.user.update({
          where: { username },
          data: {
            verificationCode: hashedCode,
            verificationExpiry: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          },
        });

        sendVerificationEmail(newCode, user.email);

        return Response.json(
          {
            success: false,
            message:
              "Verification code expired. A new one has been sent to your email.",
          },
          { status: 401 }
        );
      }
    }

    if (!isValidCode) {
      return Response.json(
        {
          success: false,
          message: "Invalid verification code",
          status: 401,
        },
        { status: 401 }
      );
    }

    await prisma.user.update({
      where: { username },
      data: {
        verified: true,
        verificationCode: null,
        verificationExpiry: null,
      },
    });

    return Response.json(
      {
        success: true,
        message: "User verified successfully",
        status: 200,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Verification error:", err);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
};
