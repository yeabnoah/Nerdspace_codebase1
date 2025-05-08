"use client";

import { ForgetPasswordForm } from "@/components/forget-password";
import { LoginForm } from "@/components/login-form";
import { ResetPasswordFrom } from "@/components/reset-password";
import { SignUpForm } from "@/components/signup-form";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

type FormType = "landing" | "login" | "signup" | "reset" | "forget";

export default function LoginPage() {
  const [currentForm, setCurrentForm] = useState<FormType>("landing");

  const imageList = useMemo(
    () => [
      "/03.png",
      "/01.png",
      "/Enistine.png",
      "/Elon.png",
      "/05.png",
      "/04.png",
    ],
    [],
  );

  function shuffleArray(array: string[]) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const [shuffledImages, setShuffledImages] = useState<string[]>(imageList);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setShuffledImages(shuffleArray(imageList));
    setCurrentImageIndex(0);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        if (prevIndex + 1 >= shuffledImages.length) {
          setShuffledImages(shuffleArray(imageList));
          return 0;
        }
        return prevIndex + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [shuffledImages, currentImageIndex, imageList]);

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
      description: ["create your account here."],
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
      description: ["don't worry, we'll help you", "get back to your account."],
    },
  };

  return (
    <div className="relative bg-[#0A0A0A] min-h-svh">
      <div className="relative grid grid-cols-1 lg:grid-cols-6 min-h-svh">
        <div className="relative flex flex-col col-span-1 lg:col-span-2 p-4 sm:p-6 lg:p-12 lg:pl-16 border-white/10 lg:border-r border-b lg:border-b-0">
          <div className="lg:bottom-14 lg:left-8 lg:fixed flex flex-col flex-1 justify-center w-full lg:max-w-[370px]">
            <AnimatePresence mode="wait">
              {currentForm === "landing" ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  key="landing"
                >
                  <h1 className="mb-3 font-bold text-white lg:text-[72px] text-3xl sm:text-4xl md:text-5xl leading-[1.1]">
                    {formTitles.landing.title} <br />
                    <span className="text-white">
                      {formTitles.landing.subtitle}
                    </span>
                  </h1>

                  <p className="mb-6 sm:mb-8 text-[#8F8F8F] text-sm sm:text-base md:text-lg">
                    {formTitles.landing.description.map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>

                  <div className="flex sm:flex-row flex-col gap-3">
                    <button
                      onClick={() => setCurrentForm("signup")}
                      className="bg-white hover:bg-[#EFEFEF] px-6 py-3 border-[#3D3D3D] border-[0.5px] rounded w-full sm:w-auto font-medium text-[15px] text-black transition-colors"
                    >
                      Get Started
                    </button>
                    <Link
                      href="/story"
                      className="bg-[#1C1C1C] hover:bg-[#2C2C2C] px-6 py-3 border-[#3D3D3D] border-[0.5px] rounded w-full sm:w-auto font-medium text-[15px] text-white text-center transition-colors"
                    >
                      Read about the story
                    </Link>
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
                  <h1 className="mb-3 font-bold text-white lg:text-[72px] text-3xl sm:text-4xl md:text-5xl leading-[1.1]">
                    {formTitles[currentForm].title} <br />
                    <span className="text-white">
                      {formTitles[currentForm].subtitle}
                    </span>
                  </h1>

                  <p className="mb-6 sm:mb-8 text-[#8F8F8F] text-sm sm:text-base md:text-lg">
                    {formTitles[currentForm].description.map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>

                  <div className="space-y-4 sm:space-y-6">
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

                  <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4 mt-6">
                    <button
                      onClick={() => setCurrentForm("landing")}
                      className="text-[#8F8F8F] hover:text-white text-sm transition-colors"
                    >
                      ← Back to home
                    </button>
                    <div className="flex flex-wrap gap-4">
                      {currentForm === "login" && (
                        <>
                          <button
                            onClick={() => setCurrentForm("forget")}
                            className="text-[#8F8F8F] hover:text-white text-sm transition-colors"
                          >
                            Forgot password?
                          </button>
                        </>
                      )}
                      {currentForm === "signup" && (
                        <button
                          onClick={() => setCurrentForm("login")}
                          className="text-[#8F8F8F] hover:text-white text-sm transition-colors"
                        >
                          Already have an account?
                        </button>
                      )}
                      {(currentForm === "forget" ||
                        currentForm === "reset") && (
                        <button
                          onClick={() => setCurrentForm("login")}
                          className="text-[#8F8F8F] hover:text-white text-sm transition-colors"
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

        <div className="hidden lg:block relative lg:col-span-4">
          <div className="absolute inset-0">
            <Image
              src={shuffledImages[currentImageIndex]}
              alt="Background"
              fill
              className="brightness-[0.8] object-cover"
              priority
              quality={100}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-transparent"></div>
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              mixBlendMode: "overlay",
            }}
          />
          <div className="right-4 bottom-4 z-30 absolute font-bold text-gray-400 text-sm">
            Built by{" "}
            <a
              href="https://x.com/technerd556"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:underline"
            >
              @technerd556
            </a>
          </div>
        </div>
      </div>
      {/* Add subtle grain effect to entire page */}
      <div
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}
