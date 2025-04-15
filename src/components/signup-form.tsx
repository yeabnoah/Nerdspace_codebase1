"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { SignupFormData, signupSchema } from "@/validation/signup.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Github, Loader2 } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  let loadingToastId: string | undefined;

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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex w-full flex-col gap-4", className)}
      {...props}
    >
      <Button
        onClick={() => {}} 
        variant="outline"
        className="relative flex h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-medium text-white transition-all hover:bg-white/10"
        type="button"
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
        <span className="relative bg-[#0A0A0A] px-2 text-sm text-white/40">
          or continue with email
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <Input
            id="name"
            type="text"
            placeholder="full name"
            className="h-12 rounded-lg border-white/10 bg-white/5 text-white placeholder:text-white/40 text-sm transition-colors focus-visible:border-white/20 focus-visible:ring-0"
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>

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

        <div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="password"
              className="h-12 rounded-lg border-white/10 bg-white/5 text-white placeholder:text-white/40 pr-10 text-sm transition-colors focus-visible:border-white/20 focus-visible:ring-0"
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
            <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>
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
              creating account...
            </span>
          ) : (
            "create account →"
          )}
        </Button>
      </div>
    </form>
  );
}
