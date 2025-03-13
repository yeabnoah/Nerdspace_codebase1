"use client";

import { CountrySelector } from "@/components/country-selector";
import { ModeToggle } from "@/components/theme-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { redirect, useRouter } from "next/navigation";
import Image from "next/image"; // Import Image component

const Onboarding = () => {
  const session = authClient.useSession();
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-white dark:bg-textAlternative">
      <div className="absolute right-10 top-10">
        <ModeToggle />
      </div>
      <div className="absolute left-1/2 top-10 -translate-x-1/2 transform">
        <h1 className=" text-4xl font-instrument">Nerdspace</h1>
      </div>
      <Card className="mx-auto mt-10 w-[90%] border border-gray-100/5 bg-transparent p-6 md:w-[50%]">
        <CardHeader>
          <CardTitle className="text-textAlternative dark:text-white">
            Finish Setting Up your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CountrySelector />
          <CardDescription className="mt-4 text-center text-gray-500 dark:text-gray-400">
            Please select your country to continue.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
