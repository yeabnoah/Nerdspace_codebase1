"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface GetStartedFormProps extends React.ComponentPropsWithoutRef<"form"> {
  onClose?: () => void;
}

export function GetStartedForm({ className, onClose, ...props }: GetStartedFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit: SubmitHandler<any> = async (data) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement your form submission logic here
      console.log(data);
      toast.success("Account created successfully!");
      if (onClose) onClose();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-svh bg-[#0A0A0A]">
      <div className="relative grid min-h-svh grid-cols-6">
        <div className="relative col-span-2 flex flex-col p-12 lg:p-16 border-r border-white/10">
          <div className="fixed bottom-14 left-8 flex max-w-[460px] flex-1 flex-col justify-end">
            <h1 className="mb-3 text-[72px] font-bold leading-[1.1] text-white">
              join <br />
              <span className="text-white">nerdspace.</span>
            </h1>

            <p className="mb-8 text-lg text-[#8F8F8F]">
              Create your account and start building
              <br />
              with a community of passionate creators
              <br />
              and builders.
            </p>

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
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.email.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="password"
                      className="h-12 rounded-lg border-white/10 bg-white/5 text-white placeholder:text-white/40 pr-10 text-sm transition-colors focus-visible:border-white/20 focus-visible:ring-0"
                      {...register("password", { required: "Password is required" })}
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
                      {errors.password.message as string}
                    </p>
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
          </div>
        </div>

        <div className="relative col-span-4 hidden lg:block">
          <div className="absolute inset-0">
            <img
              src="/bg9.jpg"
              alt="Background"
              className="h-full w-full object-cover brightness-[0.8]"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-transparent"></div>
          {/* Add noise/grain overlay */}
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay'
            }}
          />
        </div>
      </div>
      {/* Add subtle grain effect to entire page */}
      <div 
        className="pointer-events-none fixed inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }}
      />
    </div>
  );
} 