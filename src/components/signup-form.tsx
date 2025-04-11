"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormData, signupSchema } from "@/validation/signup.validation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  let loadingToastId: string | undefined;
  const router = useRouter();

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    console.log("worked signin", data);

    await authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onRequest: () => {
          loadingToastId = toast.loading("Loading ... creating your account");
        },
        onSuccess: async () => {
          toast.dismiss(loadingToastId);
          toast.success("Successfully created your account");

          await authClient.sendVerificationEmail({
            email: data.email,
            callbackURL: "/",
          });

          toast("Please check your email to verify it", { icon: "‼️" });
        },
        onError: (ctx) => {
          toast.dismiss(loadingToastId);
          toast.error(ctx.error.message);
        },
      },
    );
  };

  const signupWithGithub = async () => {
    setLoading(true); // Set loading to true when the request starts
    await authClient.signIn.social(
      {
        provider: "github",
        callbackURL: "/",
      },
      {
        onRequest: () => {
          loadingToastId = toast.loading("Loading ... Signing up with GitHub");
        },
        onSuccess: () => {
          toast.dismiss(loadingToastId);
          toast.success("You're successfully signed up");
          setLoading(false); // Set loading to false when the request succeeds
        },
        onError: (ctx) => {
          toast.dismiss(loadingToastId);
          if (ctx.error.status === 403) {
            toast.error("Please verify your email address");
          }

          toast.error(ctx.error.message);
          setLoading(false); // Set loading to false when the request fails
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("mx-auto flex max-w-sm flex-col gap-6 text-card-foreground", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-playfair text-2xl md:text-3xl dark:text-white">
          Welcome
          <span className="text-lime-00 px-2 font-itcThinItalic text-4xl">
            Nerdy
          </span>
        </h1>
      </div>
      <div className="grid gap-3">
        <Button
          onClick={signupWithGithub}
          variant="outline"
          className="w-full rounded-lg bg-inputBg py-5"
          disabled={loading} // Disable the button when loading
          type="button" // Ensure this button doesn't submit the form
        >
          {loading ? (
            "Loading..."
          ) : (
            <>
              <FaGithub size={30} />
              <h1 className="text-base font-medium">Sign up with GitHub</h1>
            </>
          )}
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background dark:bg-textAlternative py-1 rounded-lg px-2 text-muted-foreground">
            OR
          </span>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="name" className="dark:text-white">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            className="rounded-lg text-sm placeholder:text-black/50"
            {...register("name")}
          />
          <p className="text-xs text-red-400">
            {errors.name && <span>{errors.name.message}</span>}
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email" className="dark:text-white">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            className="rounded-lg text-sm placeholder:text-black/50"
            {...register("email")}
          />
          <p className="text-xs text-red-400">
            {errors.email && <span>{errors.email.message}</span>}
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password" className="dark:text-white">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"} // Toggle input type
              placeholder="*********"
              className="rounded-lg text-sm placeholder:text-black/50"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
              className="absolute right-2 top-1/2 -translate-y-1/2 transform text-sm text-muted-foreground"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <p className="text-xs text-red-400">
            {errors.password && <span>{errors.password.message}</span>}
          </p>
        </div>

        <Button type="submit" className="w-full bg-textAlternative dark:bg-white hover:bg-textAlternative/95">
          Sign Up
        </Button>
      </div>
      <div className="text-center text-sm dark:text-white/60">
        Have an account?{" "}
        <Link href="/login" className="underline underline-offset-4 dark:text-white">
          Login
        </Link>
      </div>
    </form>
  );
}
