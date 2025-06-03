"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
} from "@tabler/icons-react";
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormMessage, FormLabel, FormField, FormItem } from "./ui/form";
import { z } from "zod";
import { signUpSchema } from "@/app/schema/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@/app/(auth)/signup/api/api"
import Link from "next/link";
import { GithubOAuthButton, GoogleOAuthButton } from "./OAuthbuttons/OauthButtons";

export default function SignupForm() {

  const { mutate: singup } = useSignUp()

  const handleSubmit = (values: z.infer<typeof signUpSchema>) => {
    singup(values)
  };



  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  })

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black border-white border-1">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome to Aceternity
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Login to aceternity if you can because we don&apos;t have a login flow
        yet
      </p>
      <Form {...form}>
        <form className="my-8" onSubmit={form.handleSubmit(handleSubmit)}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="username">Username</Label>
            <FormField control={form.control} name="username" render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input id="username" placeholder="Tyler Durden" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input id="email" placeholder="youremail@notefusion.com" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input id="password" placeholder="••••••••" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </LabelInputContainer>
          <LabelInputContainer className="mb-8">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <FormField control={form.control} name="confirmPassword" render={({ field }) => (
              <FormItem>

                <FormControl>
                  <Input id="confirmPassword" placeholder="••••••••" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </LabelInputContainer>

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit"
          >
            Sign up &rarr;
            <BottomGradient />
          </button>

          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

          <div className="flex flex-col space-y-4">
            <GithubOAuthButton />
            <GoogleOAuthButton />
          </div>
        </form>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 text-right">Already have an account? <Link className="underline" href="/signin">Sign In</Link></p>
      </Form>
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
