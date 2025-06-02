// In app/(auth)/signin/api/api.ts
import { z } from "zod";
import { signinSchema } from "@/app/schema/signinSchema";
import { signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const handleNextAuthSignin = async (data: z.infer<typeof signinSchema>) => {
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

export const useSignIn = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: handleNextAuthSignin,
    onSuccess: (data) => {
      toast.success("Signed in successfully");
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to sign in");
    },
  });
};
