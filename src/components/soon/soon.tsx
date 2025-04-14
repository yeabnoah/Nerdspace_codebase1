"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
const SoonComponent = () => {
  const router = useRouter();

  return (
    <div className="mx-auto flex h-[calc(100vh-15rem)] flex-col items-center justify-center gap-6">
      <h1 className="font-instrument text-4xl text-primary">
        Under Development
      </h1>
      <p className="max-w-md text-center text-muted-foreground font-geist">
        We&apos;re working hard to bring you this feature. Thank you for your
        patience while we perfect it.
      </p>
      <Button
        variant="default"
        className="mt-4 flex items-center gap-2 px-6 font-geist"
        onClick={() => router.push("/")}
      >
        Return Home
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SoonComponent;
