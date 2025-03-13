"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { useFormStore } from "../store/useFormStore";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";

const FormSchema = z.object({
  country: z.string({
    required_error: "Please select a country",
  }),
});

type FormSchema = z.infer<typeof FormSchema>;

export const CountrySelector = () => {
  const {
    selectedCountry,
    selectedImage,
    nerdAt,
    bio,
    displayName,
    link,
    setSelectedCountry,
    setSelectedImage,
    setNerdAt,
    setBio,
    setDisplayName,
    setLink,
  } = useFormStore();

  const [step, setStep] = useState<number>(1);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit() {}

  const progressPercentage = (step / 3) * 100;

  return (
    <>
      <Card className="preview-card border-none bg-transparent shadow-none">
      <Progress value={progressPercentage} className="mb-4" />
        <CardHeader>
          <CardTitle>What's your nationality</CardTitle>
          <CardDescription>please provide accurate information</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              {step === 1 && (
                <Step1
                  selectedCountry={selectedCountry}
                  setSelectedCountry={setSelectedCountry}
                  selectedImage={selectedImage}
                  setSelectedImage={setSelectedImage}
                />
              )}
              {step === 2 && (
                <Step2
                  nerdAt={nerdAt}
                  setNerdAt={setNerdAt}
                  bio={bio}
                  setBio={setBio}
                />
              )}
              {step === 3 && (
                <Step3
                  displayName={displayName}
                  setDisplayName={setDisplayName}
                  link={link}
                  setLink={setLink}
                />
              )}
              <div className="flex justify-between">
                {step > 1 && (
                  <Button type="button" onClick={() => setStep(step - 1)}>
                    Previous
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={() => {
                      setStep(step + 1);
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      const formData = {
                        country: selectedCountry,
                        selectedImage,
                        nerdAt,
                        bio,
                        displayName,
                        link,
                      };
                      console.log("Form Data:", formData);
                      toast.success(
                        `${selectedCountry?.name} ${selectedCountry?.emoji} `,
                      );
                    }}
                  >
                    Submit
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};
