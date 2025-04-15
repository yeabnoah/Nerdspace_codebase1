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
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      <Button
        onClick={loginWithGithub}
        variant="outline"
        className="relative flex h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-medium text-white transition-all hover:bg-white/10"
        type="button"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            connecting...
          </span>
        ) : (
          <>
            <Github className="h-5 w-5" />
            <span>Continue with Github</span>
          </>
        )}
      </Button>

      <div className="relative flex items-center justify-center py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/10"></span>
        </div>
        <span className="relative bg-black px-2 text-sm text-white/40">
          or continue with email
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <Input
            id="email"
            type="email"
            placeholder="email"
            className="h-12 rounded-lg border-white/10 bg-white/5 text-sm text-white transition-colors placeholder:text-white/40 focus-visible:border-white/20 focus-visible:ring-0"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="password"
              className="h-12 rounded-lg border-white/10 bg-white/5 pr-10 text-sm text-white transition-colors placeholder:text-white/40 focus-visible:border-white/20 focus-visible:ring-0"
              {...register("password")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-white/40 transition-colors hover:text-white"
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
            <p className="mt-2 text-sm text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="relative h-12 w-full overflow-hidden rounded-lg bg-white font-medium text-black transition-all hover:bg-white/90 disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              connecting...
            </span>
          ) : (
            "let's go →"
          )}
        </Button>
      </div>
    </form>
  );
}
