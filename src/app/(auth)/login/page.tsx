"use client";

import { ForgetPasswordForm } from "@/components/forget-password";
import { LoginForm } from "@/components/login-form";
import { ResetPasswordFrom } from "@/components/reset-password";
import { SignUpForm } from "@/components/signup-form";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

type FormType = "landing" | "login" | "signup" | "reset" | "forget";

export default function LoginPage() {
  const [currentForm, setCurrentForm] = useState<FormType>("landing");

  const formTitles = {
    landing: {
      title: "hi. this is",
      subtitle: "nerdspace.",
      description: [
        "we built a space on the internet for",
        "people who love creating and building —",
        "to create, build and share it with others.",
      ],
    },
    login: {
      title: "welcome",
      subtitle: "back.",
      description: [
        "sign in to your account to continue",
        "your journey with us.",
      ],
    },
    signup: {
      title: "Join",
      subtitle: "nerdspace.",
      description: [
        "create your account here.",
      ],
    },
    reset: {
      title: "reset your",
      subtitle: "password.",
      description: [
        "enter your new password to",
        "continue your journey with us.",
      ],
    },
    forget: {
      title: "forgot",
      subtitle: "password?",
      description: [
        "don't worry, we'll help you",
        "get back to your account.",
      ],
    },
  };

  return (
    <div className="relative min-h-svh bg-[#0A0A0A]">
      <div className="relative grid min-h-svh grid-cols-6">
        <div className="relative col-span-2 flex flex-col p-12 lg:p-16 border-r border-white/10">
          <div className="fixed bottom-14 left-8 flex max-w-[370px] w-full flex-1 flex-col justify-end">
            <AnimatePresence mode="wait">
              {currentForm === "landing" ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  key="landing"
                >
                  <h1 className="mb-3 text-[72px] font-bold leading-[1.1] text-white">
                    {formTitles.landing.title} <br />
                    <span className="text-white">{formTitles.landing.subtitle}</span>
                  </h1>

                  <p className="mb-8 text-lg text-[#8F8F8F]">
                    {formTitles.landing.description.map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => setCurrentForm("signup")}
                      className="rounded border-[0.5px] border-[#3D3D3D] bg-white px-6 py-3 text-[15px] font-medium text-black transition-colors hover:bg-[#EFEFEF]"
                    >
                      Get Started
                    </button>
                    <button className="rounded border-[0.5px] border-[#3D3D3D] bg-[#1C1C1C] px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-[#2C2C2C]">
                      Read about the story
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  key={currentForm}
                >
                  <h1 className="mb-3 text-[72px] font-bold leading-[1.1] text-white">
                    {formTitles[currentForm].title} <br />
                    <span className="text-white">{formTitles[currentForm].subtitle}</span>
                  </h1>

                  <p className="mb-8 text-lg text-[#8F8F8F]">
                    {formTitles[currentForm].description.map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>

                  <div className="space-y-6">
                    {currentForm === "login" && (
                      <LoginForm className="w-full" />
                    )}
                    {currentForm === "signup" && (
                      <SignUpForm className="w-full !max-w-none" />
                    )}
                    {currentForm === "reset" && (
                      <ResetPasswordFrom className="w-full !max-w-none" />
                    )}
                    {currentForm === "forget" && (
                      <ForgetPasswordForm className="w-full !max-w-none" />
                    )}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <button 
                      onClick={() => setCurrentForm("landing")}
                      className="text-[#8F8F8F] hover:text-white transition-colors text-sm"
                    >
                      ← Back to home
                    </button>
                    <div className="flex gap-4">
                      {currentForm === "login" && (
                        <>
                          {/* <button 
                            onClick={() => setCurrentForm("signup")}
                            className="text-[#8F8F8F] hover:text-white transition-colors text-sm"
                          >
                            Create account
                          </button> */}
                          <button 
                            onClick={() => setCurrentForm("forget")}
                            className="text-[#8F8F8F] hover:text-white transition-colors text-sm"
                          >
                            Forgot password?
                          </button>
                        </>
                      )}
                      {currentForm === "signup" && (
                        <button 
                          onClick={() => setCurrentForm("login")}
                          className="text-[#8F8F8F] hover:text-white transition-colors text-sm"
                        >
                          Already have an account?
                        </button>
                      )}
                      {(currentForm === "forget" || currentForm === "reset") && (
                        <button 
                          onClick={() => setCurrentForm("login")}
                          className="text-[#8F8F8F] hover:text-white transition-colors text-sm"
                        >
                          Back to login
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="relative col-span-4 hidden lg:block">
          <div className="absolute inset-0">
            <Image
              src="/bg9.jpg"
              alt="Background"
              fill
              className="object-cover brightness-[0.8]"
              priority
              quality={100}
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
