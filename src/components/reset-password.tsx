"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  resetPasswordSchema,
  resetPasswordType,
} from "@/validation/reset-pass.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export function ResetPasswordFrom({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<resetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

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
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      <div className="space-y-4">
        <div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="new password"
              className="h-12 rounded-lg border-white/10 bg-white/5 pr-10 text-sm text-white transition-colors placeholder:text-white/40 focus-visible:border-white/20 focus-visible:ring-0"
              {...register("password")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-white/40 transition-colors hover:text-white"
              onClick={() => setShowPassword((prev) => !prev)}
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

        <div>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="confirm new password"
              className="h-12 rounded-lg border-white/10 bg-white/5 pr-10 text-sm text-white transition-colors placeholder:text-white/40 focus-visible:border-white/20 focus-visible:ring-0"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-white/40 transition-colors hover:text-white"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-400">
              {errors.confirmPassword.message}
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
              updating password...
            </span>
          ) : (
            "update password →"
          )}
        </Button>
      </div>
    </form>
  );
}
