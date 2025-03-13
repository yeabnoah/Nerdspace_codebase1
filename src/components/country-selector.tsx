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
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

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

  function onSubmit(data: FormSchema) {
    console.log(data);
  }

  const mutation = useMutation({
    mutationKey: ["update-user"],
    mutationFn: async () => {
      const response = await axios.patch(
        "/api/onboarding",
        {
          country: selectedCountry,
          image: selectedImage,
          nerdAt,
          bio,
          displayName,
          link,
          firstTime: false,
        },

        { withCredentials: true },
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("Data successfully updated");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "An error occurred while onboarding";
      toast.error(errorMessage);
    },
  });

  const progressPercentage = (step / 3) * 100;

  return (
    <>
      <Card className="preview-card border-none bg-transparent shadow-none">
        <CardHeader>
          <CardTitle>What's your nationality</CardTitle>
          <CardDescription>Please provide accurate information</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit as any)}
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
                      console.log({
                        country: selectedCountry,
                        image: selectedImage,
                        nerdAt,
                        bio,
                        displayName,
                        link,
                        firstTime: false,
                      });
                      mutation.mutate();
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
