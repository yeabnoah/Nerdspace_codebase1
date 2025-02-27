"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  resetPasswordSchema,
  resetPasswordType,
} from "@/validation/reset-pass.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react"; // Import useState
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export function ResetPasswordFrom({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<resetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
  });

  let loadingToastId: string | undefined;

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const token = new URLSearchParams(window.location.search).get("token");
  if (!token) {
    router.push("/login");
  }

  const onSubmit: SubmitHandler<resetPasswordType> = async (data) => {
    console.log("worked signin", data);

    await authClient.resetPassword(
      {
        newPassword: data.password,
        token: token!,
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
          toast.success(ctx.error.message);
        },
      },
    );

    // console.log(data);
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
        <div className="grid gap-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Input
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

        <div className="grid gap-2">
          <Label htmlFor="password">Confirm New Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="*********"
              className="rounded-lg text-sm placeholder:text-black/50"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 transform text-sm text-muted-foreground"
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
        have an account?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  );
}
