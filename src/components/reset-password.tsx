"use client";

import { Suspense, useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  resetPasswordSchema,
  resetPasswordType,
} from "@/validation/reset-pass.validation";

function ResetPasswordFormContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<resetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  // Redirect to login if no token is present
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  // Don't render form if token is missing (redirecting)
  if (!token) {
    return null;
  }

  const onSubmit: SubmitHandler<resetPasswordType> = async (data) => {
    let loadingToastId: string | undefined;

    await authClient.resetPassword(
      {
        newPassword: data.password,
        token: token,
      },
      {
        onRequest: () => {
          loadingToastId = toast.loading("Loading ... updating password");
        },
        onSuccess: () => {
          toast.dismiss(loadingToastId);
          toast.success("Password Changed Successfully");
          router.push("/login");
        },
        onError: (ctx) => {
          toast.dismiss(loadingToastId);
          toast.error(ctx.error.message);
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("mx-auto flex max-w-sm flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-playfair text-2xl md:text-3xl">
          Reset
          <span className="text-lime-00 px-2 font-itcThinItalic text-4xl">
            Password
          </span>
        </h1>
      </div>

      <div className="grid gap-3">
        {/* New Password */}
        <div className="grid gap-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="*********"
              className="rounded-lg text-sm placeholder:text-black/50"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 transform text-sm text-muted-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <p className="text-xs text-red-400">
            {errors.password && <span>{errors.password.message}</span>}
          </p>
        </div>

        {/* Confirm New Password */}
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="*********"
              className="rounded-lg text-sm placeholder:text-black/50"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 transform text-sm text-muted-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <p className="text-xs text-red-400">
            {errors.confirmPassword && (
              <span>{errors.confirmPassword.message}</span>
            )}
          </p>
        </div>

        <Button type="submit" className="w-full">
          Update Password
        </Button>
      </div>

      <div className="text-center text-sm">
        Have an account?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  );
}

export function ResetPasswordFrom({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordFormContent {...props} className={className} />
    </Suspense>
  );
}
