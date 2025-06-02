import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

interface VerifyCodePayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const postSignUpData = async (data: VerifyCodePayload) => {
  console.log(data);

  const result = await axios.post("/api/auth/signup", {
    username: data.username,
    email: data.email,
    password: data.password,
  });
  return result?.data;
};

export const useSignUp = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: VerifyCodePayload) => postSignUpData(data),
    onSuccess: (data) => {
      if (data.success) {
        router.push(`${data.user}/verify`);
      }
    },
  });
};
