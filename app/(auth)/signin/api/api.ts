import { z } from "zod";
import { signinSchema } from "@/app/schema/signinSchema";
import { signIn } from "next-auth/react";

export const handleNextAuthSignin = async (data: z.infer<typeof signinSchema>) => {
  try {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    return result;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};
