"use client";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// import { Console } from "@/components/console";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Country, CountryDropdown } from "./ui/country-dropdown";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { AutosizeTextarea } from "./ui/resizeble-text-area";

const FormSchema = z.object({
  country: z.string({
    required_error: "Please select a country",
  }),
});

type FormSchema = z.infer<typeof FormSchema>;

export const CountrySelector = () => {
  const [selectedCountry, setSelectedCountry] = React.useState<Country | null>(
    null,
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("HIYA", data);
    toast.success(`${selectedCountry?.name} ${selectedCountry?.emoji} `);
  }

  return (
    <>
      <Card className="preview-card border-none bg-transparent shadow-none">
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
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="space-b-3">
                    <div>
                      <Label className="mb-3">Profile Picture</Label>
                      
                    </div>

                    <div className=" ">
                      <Label>Your nationality</Label>
                      <CountryDropdown
                        className="mt-2"
                        placeholder="Select country"
                        defaultValue={field.value}
                        onChange={(country) => {
                          field.onChange(country.alpha3);
                          setSelectedCountry(country);
                        }}
                      />
                    </div>

                    <div>
                      <Label className="mb-3">What are you nerd at</Label>
                      <Input
                        placeholder="Nerd@"
                        className="mt-2 bg-transparent py-0"
                      />
                    </div>

                    <div>
                      <Label className="mb-3">Bio</Label>
                      <AutosizeTextarea
                        placeholder="Please provide your bio here"
                        className="mt-2 bg-transparent py-1"
                      />
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* <Console>
        {selectedCountry ? (
          <div className="w-full">
            <pre className="p-4">
              {JSON.stringify(selectedCountry, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="flex items-center text-sm text-zinc-400 font-mono ">
            <pre className="p-4">
              &gt;
              <span className="animate-blink">_</span>
            </pre>
          </div>
        )}
      </Console> */}
    </>
  );
};
