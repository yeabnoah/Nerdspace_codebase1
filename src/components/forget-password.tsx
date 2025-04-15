"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  ForgotPasswordSchema,
  ForgotPasswordType,
} from "@/validation/verify-email";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export function ForgetPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordType>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit: SubmitHandler<ForgotPasswordType> = async (data) => {
    await authClient.forgetPassword(
      {
        email: data.email,
        redirectTo: "/reset-password",
      },
      {
        onRequest: () => {
          toast.loading(
            "Loading ... checking your credentials",
          );
        },

        onSuccess: () => {
          toast.success("email successfully sent please check your email");
        },

        onError: (ctx) => {
          toast.success(ctx.error.message);
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex w-full flex-col gap-4", className)}
      {...props}
    >
      <div className="space-y-4">
        <div>
          <Input
            id="email"
            type="email"
            placeholder="email"
            className="h-12 rounded-lg border-white/10 bg-white/5 text-white placeholder:text-white/40 text-sm transition-colors focus-visible:border-white/20 focus-visible:ring-0"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="relative h-12 w-full overflow-hidden rounded-lg bg-white text-black font-medium transition-all hover:bg-white/90 disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              sending reset link...
            </span>
          ) : (
            "send reset link →"
          )}
        </Button>
      </div>
      {/* <div className="text-center text-sm">
        have an account?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Login
        </Link>
      </div> */}
    </form>
  );
}
