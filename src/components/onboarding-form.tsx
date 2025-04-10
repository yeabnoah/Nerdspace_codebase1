"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStore } from "@/store/useFormStore";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Edit } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { CountryDropdown } from "./ui/country-dropdown";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { AutosizeTextarea } from "./ui/resizeble-text-area";
import { queryClient } from "@/providers/tanstack-query-provider";

export function OnboardingForm() {
  const router = useRouter();
  const {
    selectedCountry,
    selectedImage,
    selectedCoverImage,
    nerdAt,
    bio,
    displayName,
    link,
    setSelectedCountry,
    setSelectedImage,
    setSelectedCoverImage,
    setNerdAt,
    setBio,
    setDisplayName,
    setLink,
  } = useFormStore();

  const cloudinaryUploadUrl = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!;
  const cloudinaryUploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const mutation = useMutation({
    mutationKey: ["update-user"],
    mutationFn: async (data: any) => {
      const response = await axios.patch("/api/onboarding", data, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Profile setup completed!");
      queryClient.invalidateQueries({ queryKey: ["whoami"] });
      router.push("/"); // Redirect to home after successful onboarding
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "An error occurred while setting up your profile";
      toast.error(errorMessage);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setSelectedImage(file);
    }
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setCoverPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setSelectedCoverImage(file);
    }
  };

  const handleSubmit = async () => {
    let uploadedImageUrl = selectedImage;
    let uploadedCoverImageUrl = selectedCoverImage;

    if (selectedImage instanceof File) {
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("upload_preset", cloudinaryUploadPreset);

      try {
        const response = await axios.post(cloudinaryUploadUrl, formData);
        uploadedImageUrl = response.data.secure_url;
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Image upload failed");
        return;
      }
    }

    if (selectedCoverImage instanceof File) {
      const formData = new FormData();
      formData.append("file", selectedCoverImage);
      formData.append("upload_preset", cloudinaryUploadPreset);

      try {
        const response = await axios.post(cloudinaryUploadUrl, formData);
        uploadedCoverImageUrl = response.data.secure_url;
      } catch (error) {
        console.error("Cover image upload failed:", error);
        toast.error("Cover image upload failed");
        return;
      }
    }

    await mutation.mutate({
      country: selectedCountry,
      image: uploadedImageUrl || "",
      coverImage: uploadedCoverImageUrl || "",
      nerdAt,
      bio,
      displayName,
      link,
      firstTime: true,
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Let's start with your profile picture</h2>
              <p className="text-muted-foreground">Add a photo to help others recognize you</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Image
                  src={previewUrl || "/user_placeholder.jpg"}
                  alt="Profile Preview"
                  width={200}
                  height={200}
                  className="size-32 rounded-full object-cover"
                />
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="image-upload"
                  className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-white p-2 shadow-md"
                >
                  <Edit size={16} className="text-gray-600" />
                </label>
              </div>
              <Button onClick={() => setCurrentStep(2)}>Next</Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Tell us about yourself</h2>
              <p className="text-muted-foreground">Help others get to know you better</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Display Name</Label>
                <Input
                  placeholder="John Doe"
                  value={displayName || ""}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              <div>
                <Label>What are you nerd at?</Label>
                <Input
                  placeholder="e.g., Programming, Music, Gaming"
                  value={nerdAt || ""}
                  onChange={(e) => setNerdAt(e.target.value)}
                />
              </div>
              <div>
                <Label>Bio</Label>
                <AutosizeTextarea
                  placeholder="Tell us about yourself..."
                  value={bio || ""}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setCurrentStep(3)}>Next</Button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Final touches</h2>
              <p className="text-muted-foreground">Add your location and personal link</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Your Country</Label>
                <CountryDropdown
                  placeholder="Select country"
                  defaultValue={selectedCountry?.alpha3}
                  onChange={(country) => setSelectedCountry(country)}
                />
              </div>
              <div>
                <Label>Personal Link</Label>
                <Input
                  placeholder="https://your-website.com"
                  value={link || ""}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Back
                </Button>
                <Button onClick={handleSubmit}>Complete Setup</Button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">{renderStep()}</CardContent>
    </Card>
  );
} 