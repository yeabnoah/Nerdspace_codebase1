"use client";

import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/providers/tanstack-query-provider";
import { useFormStore } from "@/store/useFormStore";
import useUserStore from "@/store/user.store";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Edit, Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CountryDropdown } from "../ui/country-dropdown";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { AutosizeTextarea } from "../ui/resizeble-text-area";
import { Skeleton } from "../ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import FollowedProjects from "@/components/project/followed-projects";

const ProfileSettings = () => {
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
  const cloudinaryUploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const session = authClient.useSession();
  const { user, isloading } = useUserStore();

  const mutation = useMutation({
    mutationKey: ["update-user"],
    mutationFn: async (data: any) => {
      const response = await axios.patch("/api/onboarding", data, {
        withCredentials: true,
      });

      return response.data;
    },
    onSuccess: () => {
      toast.success("Data successfully updated");
      queryClient.invalidateQueries({ queryKey: ["whoami"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "An error occurred while onboarding";
      toast.error(errorMessage);
    },
  });

  if (isloading) {
    return (
      <Card className="preview-card border-none bg-transparent shadow-none">
        <CardHeader className="mt-2">
          <CardTitle>
            <Skeleton className="h-3 w-1/4 rounded-sm" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-3/4 rounded-sm" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="">
            <div className="flex items-center gap-10">
              <div className="relative mb-4">
                <Skeleton className="size-16 rounded-full" />
              </div>
              <div className="mb-4 flex-1">
                {/* <Skeleton className="mt-2 h-3 w-1/2" /> */}
                <Skeleton className="mt-2 h-7 w-1/2" />
                <Skeleton className="mt-2 h-3 w-1/2" />
              </div>
            </div>
          </div>

          <Skeleton className="mt-2 h-[5vh] w-full" />
          <Skeleton className="mt-2 h-[25vh] w-full" />
        </CardContent>
      </Card>
    );
  }

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

  return (
    <div className="container relative mx-auto max-w-4xl overflow-hidden pb-8">
      <div className="absolute -right-10 -top-20 h-[300px] w-[300px] -rotate-45 rounded-full bg-gradient-to-br from-amber-300/10 to-transparent blur-[80px] dark:from-orange-300/10"></div>

      <Card className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-500/5 dark:bg-black">
        <CardHeader className="px-6">
          <CardTitle className="font-geist text-2xl font-medium">
            Profile Settings
          </CardTitle>
          <CardDescription className="font-geist text-sm text-muted-foreground">
            Customize your profile to make it uniquely yours
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 px-6">
          {/* Cover Image Section */}
          <div className="group relative h-[150px] w-full overflow-hidden rounded-2xl shadow-lg">
            <Image
              src={coverPreviewUrl || user.coverImage || "/obsession.jpg"}
              alt="Cover Preview"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-zinc-900/90 via-zinc-900/60 to-transparent px-8 dark:from-black/80 dark:via-black/50">
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-900/90 to-transparent dark:from-black"></div>
              <div className="relative z-10 flex justify-end">
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="cover-image-upload"
                  onChange={handleCoverFileChange}
                />
                <label
                  htmlFor="cover-image-upload"
                  className="flex cursor-pointer items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  <Edit size={16} />
                  <span className="text-sm font-medium">Change Cover</span>
                </label>
              </div>
            </div>
          </div>

          {/* Profile Image and Basic Info Section */}
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="relative flex-shrink-0">
              <div className="relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-primary/20">
                <Image
                  src={
                    previewUrl ||
                    user.image ||
                    session?.data?.user?.image ||
                    "/user_placeholder.jpg"
                  }
                  alt="Profile Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                id="image-upload"
                onChange={handleFileChange}
              />
              <label
                htmlFor="image-upload"
                className="absolute -bottom-2 -right-2 flex cursor-pointer items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-medium shadow-sm transition-all hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <Edit size={12} />
                <span>Edit</span>
              </label>
            </div>

            <div className="flex w-full flex-col gap-2">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="font-geist text-xs font-medium">
                    Display name
                  </Label>
                  <Input
                    placeholder="John Doe"
                    className="h-10 rounded-xl border-input/50 shadow-none focus-visible:ring-primary/50 dark:border-gray-500/20"
                    value={displayName || ""}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-geist text-xs font-medium">
                    Personal Link
                  </Label>
                  <Input
                    placeholder="https://johndoe.blog"
                    className="h-10 rounded-xl border-input/50 shadow-none focus-visible:ring-primary/50 dark:border-gray-500/20"
                    value={link || ""}
                    onChange={(e) => setLink(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="grid  md:grid-cols-2">
            <div className="space-y-2">
              <Label className="font-geist text-xs font-medium">
                Your Country
              </Label>
              {user?.country ? (
                <p className="font-geist text-muted-foreground">
                  {user?.country?.name}
                </p>
              ) : (
                <CountryDropdown
                  className="h-10 rounded-xl border-input/50 shadow-none focus-visible:ring-primary/50 dark:border-gray-500/5"
                  placeholder="Select country"
                  defaultValue={selectedCountry?.alpha3}
                  onChange={(country) => setSelectedCountry(country)}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label className="font-geist text-xs font-medium">
                What are you nerd at
              </Label>
              <Input
                placeholder="Music"
                className="h-10 rounded-xl border-input/50 shadow-none focus-visible:ring-primary/50 dark:border-gray-500/20"
                value={nerdAt || ""}
                onChange={(e) => setNerdAt(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-geist text-xs font-medium">Bio</Label>
            <AutosizeTextarea
              placeholder="Tell us about yourself..."
                className="min-h-[120px] w-full rounded-xl border-input/50 shadow-none focus-visible:ring-primary/50 dark:border-gray-500/20"
              value={bio || ""}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={async () => {
                let uploadedImageUrl = selectedImage;
                let uploadedCoverImageUrl = selectedCoverImage;

                if (selectedImage instanceof File) {
                  const formData = new FormData();
                  formData.append("file", selectedImage);
                  formData.append("upload_preset", cloudinaryUploadPreset);

                  try {
                    const response = await axios.post(
                      cloudinaryUploadUrl,
                      formData,
                    );
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
                    const response = await axios.post(
                      cloudinaryUploadUrl,
                      formData,
                    );
                    uploadedCoverImageUrl = response.data.secure_url;
                  } catch (error) {
                    console.error("Cover image upload failed:", error);
                    toast.error("Cover image upload failed");
                    return;
                  }
                }

                await mutation.mutate({
                  country: user?.country
                    ? undefined
                    : selectedCountry || undefined,
                  image: uploadedImageUrl || user.image || undefined,
                  coverImage:
                    uploadedCoverImageUrl || user.coverImage || undefined,
                  nerdAt: nerdAt || undefined,
                  bio: bio || undefined,
                  displayName: displayName || undefined,
                  link: link || undefined,
                  firstTime: false,
                });
              }}
              className="h-10 w-fit gap-2 rounded-2xl border border-gray-500/10 bg-gradient-to-r text-black dark:text-white dark:hover:border-black"
            >
              <Check className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
