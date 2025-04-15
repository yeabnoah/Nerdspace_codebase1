"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { loginSchema, type loginType } from "@/validation/login.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Github, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginType>({
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  let loadingToastId: string | undefined;

  const router = useRouter();

  const onSubmit: SubmitHandler<loginType> = async (data) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onRequest: () => {
          loadingToastId = toast.loading(
            "Loading... checking your credentials",
          );
        },
        onSuccess: async () => {
          toast.dismiss(loadingToastId);
          toast.success("You're successfully signed in");
          router.replace("/");
        },
        onError: (ctx) => {
          toast.dismiss(loadingToastId);
          if (ctx.error.status === 403) {
            toast.error("Please verify your email address");
          } else {
            toast.error(ctx.error.message);
          }
        },
      },
    );
  };

  const loginWithGithub = async () => {
    setLoading(true);
    await authClient.signIn.social(
      {
        provider: "github",
        callbackURL: "/",
      },
      {
        onRequest: () => {
          loadingToastId = toast.loading("Loading... Signing in with Github");
        },
        onSuccess: () => {
          toast.dismiss(loadingToastId);
          toast.success("You're successfully signed in");
          setLoading(false);
        },
        onError: (ctx) => {
          toast.dismiss(loadingToastId);
          if (ctx.error.status === 403) {
            toast.error("Please verify your email address");
          } else {
            toast.error(ctx.error.message);
          }
          setLoading(false);
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "relative mx-auto flex w-full max-w-md flex-col gap-6 rounded-xl border border-white/5 bg-black/30 p-8 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.46)]",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-playfair text-3xl font-semibold text-white sm:text-4xl">
          <span className="mx-1 font-itcThinItalic">Welcome</span> Back
        </h1>
        <p className="text-sm text-white/70">
          Sign in to continue to your account
        </p>
      </div>

      <Button
        onClick={loginWithGithub}
        variant="outline"
        className="group relative flex h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-lg border border-white/5 bg-black/30 px-4 py-2 font-medium text-white transition-all hover:bg-black/40"
        type="button"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in...
          </span>
        ) : (
          <>
            <Github className="h-5 w-5" />
            <span>Continue with GitHub</span>
          </>
        )}
      </Button>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/5"></span>
        </div>
        <span className="relative bg-black/30 px-3 text-xs text-white/70">
          OR CONTINUE WITH EMAIL
        </span>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label className="text-sm font-medium" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            className="h-11 rounded-lg border-white/5 bg-black/30 text-white placeholder:text-white/50 text-sm transition-colors focus-visible:border-white/40"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs font-medium text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium" htmlFor="password">
              Password
            </Label>
            <Link
              href="/forget-password"
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-11 rounded-lg border-white/5 bg-black/30 text-white placeholder:text-white/50 pr-10 text-sm transition-colors focus-visible:border-white/40"
              {...register("password")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs font-medium text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="group relative h-11 w-full overflow-hidden rounded-lg bg-gradient-to-r from-primary to-primary/80 text-white transition-all duration-300 hover:from-primary/90 hover:to-primary/70 disabled:opacity-70"
          disabled={isSubmitting}
        >
          <span className="relative z-10 flex items-center gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </span>
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></span>
        </Button>
      </div>

      <div className="text-center text-sm">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </Link>
      </div>
    </form>
  );
}
