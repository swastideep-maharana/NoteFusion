"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useMutation } from "@tanstack/react-query";
import { handleNextAuthSignin } from "./api/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signinSchema } from "@/app/schema/signinSchema";

type SignInFormValues = z.infer<typeof signinSchema>;

export default function SignInPage() {
  const router = useRouter();
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate } = useMutation({
    mutationFn: handleNextAuthSignin,
    onSuccess: (data) => {
      toast.success("Signed in successfully");
      router.refresh();
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to sign in");
    },
  });

  async function onSubmit(data: SignInFormValues) {
    mutate(data);
  }
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-xl bg-zinc-900/70 rounded-3xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-white/50">
              NoteFusion
            </h1>
            <p className="text-xl text-white/70 mt-4">Welcome back</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                        className="text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                {"Sign in"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
