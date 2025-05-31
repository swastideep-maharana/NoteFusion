"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 409) {
        setError(data.message);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to create account");
      }

      // Force a hard navigation to the signin page
      window.location.href =
        "/auth/signin?success=Account created successfully";
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="shadow-input w-full max-w-md rounded-2xl bg-zinc-900 p-8 relative">
        <h2 className="text-2xl font-bold text-white mb-2">
          Create your account
        </h2>
        <p className="text-zinc-400 text-sm">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="text-white hover:text-zinc-300 underline underline-offset-2 font-medium"
          >
            Sign in
          </Link>
        </p>

        <form className="my-8" onSubmit={handleSignUp}>
          {error && (
            <div className="mb-4 p-3 text-sm text-red-500 bg-red-950/30 rounded-md border border-red-950">
              {error}
            </div>
          )}

          <LabelInputContainer className="mb-4">
            <Label
              htmlFor="username"
              className="text-base font-semibold text-white"
            >
              Full Name
            </Label>
            <Input
              id="username"
              placeholder="John Doe"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="h-11 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 focus:border-zinc-500"
            />
          </LabelInputContainer>

          <LabelInputContainer className="mb-4">
            <Label
              htmlFor="email"
              className="text-base font-semibold text-white"
            >
              Email Address
            </Label>
            <Input
              id="email"
              placeholder="you@example.com"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="h-11 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 focus:border-zinc-500"
            />
          </LabelInputContainer>

          <LabelInputContainer className="mb-4">
            <Label
              htmlFor="password"
              className="text-base font-semibold text-white"
            >
              Password
            </Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="h-11 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 focus:border-zinc-500"
            />
          </LabelInputContainer>

          <button
            className="group/btn relative block h-11 w-full rounded-md bg-gradient-to-br from-white to-neutral-300 font-medium text-black shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] hover:from-white hover:to-neutral-400 transition-all"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign up"} &rarr;
            <BottomGradient />
          </button>

          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

          <div className="flex flex-col space-y-4">
            <button
              onClick={() => signIn("github")}
              type="button"
              className="group/btn shadow-input relative flex h-11 w-full items-center justify-center space-x-2 rounded-md bg-zinc-800 px-4 font-medium text-white border border-zinc-700 hover:bg-zinc-700 transition-colors"
            >
              <IconBrandGithub className="h-5 w-5 text-white" />
              <span className="text-sm">Continue with GitHub</span>
              <BottomGradient />
            </button>
            <button
              onClick={() => signIn("google")}
              type="button"
              className="group/btn shadow-input relative flex h-11 w-full items-center justify-center space-x-2 rounded-md bg-zinc-800 px-4 font-medium text-white border border-zinc-700 hover:bg-zinc-700 transition-colors"
            >
              <IconBrandGoogle className="h-5 w-5 text-white" />
              <span className="text-sm">Continue with Google</span>
              <BottomGradient />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
