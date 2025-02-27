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

export function ForgetPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordType>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  let loadingToastId: string | undefined;

  const onSubmit: SubmitHandler<ForgotPasswordType> = async (data) => {
    await authClient.forgetPassword(
      {
        email: data.email,
        redirectTo: "/reset-password",
      },
      {
        onRequest: () => {
          loadingToastId = toast.loading(
            "Loading ... checking your credentials",
          );
        },

        onSuccess: () => {
          toast.dismiss(loadingToastId);
          toast.success("email successfully sent please check your email");
        },

        onError: (ctx) => {
          toast.dismiss(loadingToastId);
          toast.success(ctx.error.message);
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "mx-auto flex max-w-sm flex-col gap-3 text-textAlternative",
        className,
      )}
      {...props}
    >
      <div className="mb-3 flex flex-col items-center gap-2 text-center">
        <h1 className="font-playfair text-3xl text-textAlternative">
          Forgot{" "}
          <span className="mx-1 font-itcThinItalic text-4xl">Password</span>
        </h1>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            className="rounded-lg text-sm"
            {...register("email")}
          />
          <p className="text-xs text-red-400">
            {errors.email && <span>{errors.email.message}</span>}
          </p>
        </div>

        <Button
          type="submit"
          className="w-full bg-textAlternative hover:bg-textAlternative/95"
        >
          Send Email
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
