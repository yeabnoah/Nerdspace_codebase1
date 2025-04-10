"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { loginSchema, loginType } from "@/validation/login.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaGithub } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
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
        callbackURL: "/",
        // rememberMe: true,
      },
      {
        onRequest: () => {
          loadingToastId = toast.loading(
            "Loading ... checking your credentials",
          );
        },
        onSuccess: async () => {
          toast.dismiss(loadingToastId);
          toast.success("You're successfully signed in");
          
          // Check if this is the user's first login
          try {
            const response = await axios.get("/api/onboarding/status", {
              withCredentials: true,
            });
            if (response.data.isFirstTime) {
              router.push("/onboarding");
            } else {
              router.push("/");
            }
          } catch (error) {
            console.error("Error checking onboarding status:", error);
            router.push("/");
          }
        },
        onError: (ctx) => {
          toast.dismiss(loadingToastId);
          if (ctx.error.status === 403) {
            toast.error("Please verify your email address");
          }

          toast.error(ctx.error.message);
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
          loadingToastId = toast.loading("Loading ... Signing in with Github");
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
          }

          toast.error(ctx.error.message);
          setLoading(false);
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "mx-auto flex max-w-sm flex-col gap-3 text-card-foreground",
        className,
      )}
      {...props}
    >
      <div className="mb-3 flex flex-col items-center gap-2 text-center">
        <h1 className="font-playfair text-3xl text-card-foreground ">
          <span className="mx-1 font-itcThinItalic text-4xl">Welcome</span> Back
        </h1>
      </div>

      <Button
        onClick={loginWithGithub}
        variant="outline"
        className="w-full rounded-lg bg-inputBg  py-5"
        type="button" 
        disabled={loading} 
      >
        {loading ? (
          "Loading..."
        ) : (
          <>
            <FaGithub size={30} />
            <h1 className="text-base font-medium ">Login with GitHub</h1>
          </>
        )}
      </Button>

      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background  py-1 rounded-lg px-2 text-muted-foreground">
          OR
        </span>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label className="" htmlFor="email">Email</Label>
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
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label className=" " htmlFor="password">Password</Label>
            <a
              href="/forget-password"
              className="ml-auto text-sm  text-muted-foreground underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
            <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="**********"
              className="rounded-lg pr-10 text-sm border border-gray-300"
              {...register("password")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            </div>
          <p className="text-xs text-red-400">
            {errors.password && <span>{errors.password.message}</span>}
          </p>
        </div>
        <Button
          type="submit"
          className="w-full bg-textAlternative text-white hover:bg-textAlternative/95"
        >
          Login
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  );
}
