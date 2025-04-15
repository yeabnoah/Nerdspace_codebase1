"use client";

import { LoginForm } from "@/components/login-form";
import { motion } from "framer-motion";
import { GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="relative min-h-svh bg-[url('/bg9.jpg')] bg-cover bg-center bg-fixed">
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative grid min-h-svh lg:grid-cols-2">
        <div className="relative flex flex-col p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="absolute -right-10 hidden md:block -top-20 h-[300px] w-[300px] -rotate-45 rounded-full bg-gradient-to-br from-amber-300/10 to-transparent blur-[80px] dark:from-orange-300/10"></div>
          <div className="absolute -bottom-5 left-12 hidden md:block size-32 rotate-45 rounded-full border border-orange-300/50 bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent blur-[150px] backdrop-blur-sm"></div>

          <div className="mb-6 flex items-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105">
              <GalleryVerticalEnd className="h-5 w-5" />
            </div>
            <span className="ml-2.5 font-geist text-lg font-medium text-white">NerdSpace</span>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <LoginForm />
            </motion.div>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-12"
          >
            <div className="max-w-md text-center">
              <h2 className="mb-6 font-playfair text-4xl font-medium leading-tight text-white">
                Start your <span className="font-itcThinItalic">Journey</span>{" "}
                here
              </h2>

              <p className="mb-10 text-base font-light leading-relaxed text-gray-300">
                Create a simple profile and connect with like-minded people who
                share your passions. Explore communities, collaborate on projects,
                and grow with others who truly get you.
              </p>

              <div className="relative mx-auto mb-4 h-16 w-16 overflow-hidden rounded-full border-2 border-white/20">
                <Image
                  src="/nerd.jpg"
                  alt="Yeabsra Ashebir"
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>

              <p className="text-lg font-medium text-white">Yeabsra Ashebir</p>
              <p className="text-sm text-gray-300">Developer</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
