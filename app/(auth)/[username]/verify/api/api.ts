import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

interface VerifyCodePayload {
  code: string;
  username: string;
}

interface VerifyCodeResponse {
  success: boolean;
  message: string;
}

const postCode = async ({ code, username }: VerifyCodePayload) => {
  const response = await axios.post<VerifyCodeResponse>("/api/auth/verify", {
    code,
    username,
  });
  return response.data;
};

export const usePostCode = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: VerifyCodePayload) => postCode(data),
    onSuccess: (data) => {
      if (data.success) {
        router.push("/dashboard");
      }
    },
  });
};
