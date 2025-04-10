"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { OnboardingForm } from "@/components/onboarding-form";

export default function OnboardingPage() {
  const router = useRouter();
  const session = authClient.useSession();

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!session.data) {
      router.push("/login");
    }
  }, [session.data, router]);

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="font-playfair text-3xl md:text-4xl">
            Welcome to{" "}
            <span className="font-itcThinItalic text-4xl md:text-5xl">
              Nerdspace
            </span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            Let's set up your profile to help you connect with like-minded people
          </p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  );
} 