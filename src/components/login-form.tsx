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
        className="relative flex justify-center items-center gap-2 sm:gap-3 bg-white/5 hover:bg-white/10 px-3 sm:px-4 py-2 border border-white/10 rounded-lg w-full h-12 overflow-hidden font-medium text-white text-sm sm:text-base transition-all"
        type="button"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            connecting...
          </span>
        ) : (
          <>
            <Github className="w-5 h-5" />
            <span>Continue with Github</span>
          </>
        )}
      </Button>

      <div className="relative flex justify-center items-center py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="border-white/10 border-t w-full"></span>
        </div>
        <span className="relative bg-black px-2 text-white/40 text-xs sm:text-sm">
          or continue with email
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <Input
            id="email"
            type="email"
            placeholder="email"
            className="bg-white/5 border-white/10 focus-visible:border-white/20 rounded-lg focus-visible:ring-0 h-12 text-white placeholder:text-white/40 text-sm transition-colors"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-2 text-red-400 text-xs sm:text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="password"
              className="bg-white/5 pr-10 border-white/10 focus-visible:border-white/20 rounded-lg focus-visible:ring-0 h-12 text-white placeholder:text-white/40 text-sm transition-colors"
              {...register("password")}
            />
            <button
              type="button"
              className="right-3 absolute inset-y-0 flex items-center text-white/40 hover:text-white transition-colors"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-red-400 text-xs sm:text-sm">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="relative bg-white hover:bg-white/90 disabled:opacity-70 px-4 py-2 rounded-lg w-full h-12 overflow-hidden font-medium text-black text-sm sm:text-base transition-all"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
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
