"use client"

import { CountrySelector } from "@/components/country-selector";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { redirect, useRouter } from "next/navigation";

const Onboarding = () => {
  const session = authClient.useSession();
  const router = useRouter()

  if(session && !session.data?.user?.image){
    redirect("/")
  }

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center bg-white dark:bg-textAlternative">
      <Card className="mx-auto w-[90%] border border-gray-100/5 bg-transparent md:w-[50%]">
        <CardHeader>
          <CardTitle className="text-textAlternative dark:text-white">
            Finish Setting Up your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CountrySelector />
          <CardDescription></CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
