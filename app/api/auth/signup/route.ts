import dbConnect from "@/lib/mongodb";
import UserModel from "@/models/user.model";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const POST = async (req: Request) => {
  const body = await req.json();
  const { username, password, email } = body;

  await dbConnect();
  try {
    const exisitingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });

    if (exisitingUser) {
      return Response.json(
        {
          success: false,
          message: "User already exisits",
          status: 409,
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationCode = crypto.randomInt(0, 999999);
    /*
  TODO: Send verification email
  */
    const hashedVerificationCode = await bcrypt.hash(
      verificationCode.toString(),
      12
    );

    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      verificationCode: hashedVerificationCode,
    });

    console.log(newUser);

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
        success: true,
        status: 500,
      },
      { status: 500 }
    );
  }
};
