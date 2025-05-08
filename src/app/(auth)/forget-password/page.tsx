"use client";

import { ForgetPasswordForm } from "@/components/forget-password";
import { GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";

export default function ForgotPasswordPage() {
  return (
    <div className="grid lg:grid-cols-2 min-h-svh">
      <div className="flex flex-col gap-4 p-4 sm:p-6 md:p-10">
        <div className="flex flex-1 justify-center items-center">
          <div className="mx-auto w-full max-w-md">
            <div className="flex justify-center items-center bg-primary mx-auto mb-4 sm:mb-5 rounded-md size-8 text-primary-foreground">
              <GalleryVerticalEnd className="size-5" />
            </div>
            <ForgetPasswordForm />
          </div>
        </div>
      </div>
      <div className="hidden auth-right relative md:flex justify-center md:items-center bg-[#201e1d] text-white">
        <div className="flex flex-col justify-center items-center p-6 md:p-8">
          <h2 className="mb-2 md:mb-4 font-playfair text-regular text-2xl sm:text-3xl text-center">
            Start your{" "}
            <span className="mx-1 font-itcThinItalic text-3xl sm:text-4xl">Journey</span>{" "}
            here
          </h2>

          <p className="mb-4 md:mb-6 max-w-sm font-light text-white-500 text-sm text-center leading-relaxed">
            Build one simple profile and let our AI work it&apos;s magic.
            We&apos;ll automatically apply to hundreds of jobs for you. Focus on
            what matters most - your skills and experience.
          </p>

          <Image
            src="/nerd.jpg"
            alt="nerd"
            width={40}
            height={40}
            className="mx-auto rounded-full"
          />

          <p className="mt-2 font-semibold text-sm md:text-base">
            Yeabsra Ashebir
          </p>
          <p className="opacity-80 text-xs md:text-sm">Developer</p>
        </div>
      </div>
    </div>
  );
}
