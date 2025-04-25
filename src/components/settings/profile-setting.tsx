"use client";

import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/providers/tanstack-query-provider";
import { useFormStore } from "@/store/useFormStore";
import useUserStore from "@/store/user.store";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Check, Edit, Globe, ExternalLink, Upload, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Country, CountryDropdown } from "../ui/country-dropdown";
import { AutosizeTextarea } from "../ui/resizeble-text-area";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

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
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const session = authClient.useSession();
  const { user, isloading } = useUserStore();
  const router = useRouter();

  const mutation = useMutation({
    mutationKey: ["update-user"],
    mutationFn: async (data: any) => {
      const response = await axios.patch("/api/onboarding", data, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Profile successfully updated");
      queryClient.invalidateQueries({ queryKey: ["whoami"] });
      setIsOpen(false);
    },
    onError: (error) => {
      const errorMessage = error || "An error occurred while updating";
      toast.error(errorMessage);
    },
  });

  if (isloading) {
    return <Skeleton className="h-[600px] w-full" />;
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

  const handleSave = async () => {
    setIsSaving(true);
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
        toast.error("Profile image upload failed");
        setIsSaving(false);
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
        setIsSaving(false);
        return;
      }
    }

    await mutation.mutate({
      country: user?.country ? undefined : selectedCountry || undefined,
      image: uploadedImageUrl || user.image || undefined,
      coverImage: uploadedCoverImageUrl || user.coverImage || undefined,
      nerdAt: nerdAt || undefined,
      bio: bio || undefined,
      displayName: displayName || undefined,
      link: link || undefined,
      firstTime: false,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="group relative px-5 overflow-hidden rounded-xl border border-zinc-200/20 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 dark:border-zinc-800/20 dark:bg-black/5 dark:hover:bg-black/10">
          <h2 className="text-start text-2xl pt-5 pb-3 font-medium dark:text-white">
            Edit Profile
          </h2>
          <div className="relative h-56 rounded-lg w-full overflow-hidden">
            <Image
              src={user.coverImage || "/obsession.jpg"}
              alt="Cover"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
          </div>

          {/* Profile Section */}
          <div className="relative px-6 pb-6">
            {/* Profile Picture */}
            <div className="relative -mt-12 mb-4 flex items-end justify-between">
              <div className="relative h-24 w-24 overflow-hidden border-4 border-background shadow-xl dark:border-black rounded-full ">
                <Image
                  src={
                    user.image ||
                    session?.data?.user?.image ||
                    "/user_placeholder.jpg"
                  }
                  alt="Profile"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-10 mt-5 w-fit px-2 py-3 rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background dark:bg-black dark:hover:bg-black"
              >
                <Edit className="h-4 w-4" />
                Edit profile
                <span className="sr-only">Edit Profile</span>
              </Button>
            </div>

            {/* Profile Info */}
            <div className="space-y-4">
              {/* Header Info */}
              <div>
                <h3 className="font-geist text-xl font-semibold text-foreground">
                  {user.visualName || displayName || "Your Name"}
                </h3>
                <div className="mt-1 flex items-center gap-3">
                  {(user.nerdAt || nerdAt) && (
                    <Badge
                      variant="secondary"
                      className="rounded-full font-normal"
                    >
                     nerd@ {user.nerdAt || nerdAt}
                    </Badge>
                  )}
                  {user?.country?.name && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Globe className="h-3.5 w-3.5" />
                      <span>{user.country.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              {(user.bio || bio) && (
                <p className="text-sm text-muted-foreground">
                  {user.bio || bio}
                </p>
              )}

              {/* Stats & Links */}
              <div className="flex items-center gap-6 border-t pt-4 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
                    <Globe className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium">
                      {user?.country?.name || "Add location"}
                    </p>
                  </div>
                </div>

                {(user.link || link) && (
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
                      <ExternalLink className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Website</p>
                      <a
                        href={user.link || link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {(user.link || link).replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Call to Action */}
              {!user.bio && !bio && (
                <div className="rounded-lg border border-dashed border-primary/20 bg-primary/5 px-4 py-3 dark:border-primary/10 dark:bg-primary/5">
                  <p className="text-sm text-muted-foreground">
                    Complete your profile to help others know more about you
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl overflow-hidden rounded-xl border-none p-0 backdrop-blur-sm">
        <div className="relative flex h-[80vh] max-h-[80vh] flex-col md:flex-row">
          {/* Glow effects */}
          <div className="absolute -right-4 hidden size-32 -rotate-45 rounded-full border border-blue-300/50 bg-gradient-to-br from-blue-300/40 via-blue-400/50 to-transparent blur-[150px] backdrop-blur-sm md:block" />
          <div className="absolute -bottom-5 left-12 hidden size-32 rotate-45 rounded-full border border-orange-300/50 bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent blur-[150px] backdrop-blur-sm md:block" />

          {/* Left Panel */}
          <div className="flex w-full flex-col rounded-l-xl border-b border-l border-r border-t p-6 dark:border-gray-600/10 dark:bg-black md:w-1/3">
            <div className="mb-2 font-geist text-3xl font-medium">
              Edit Profile
            </div>
            <p className="mb-4 font-geist text-muted-foreground">
              Update your profile information
            </p>

            <div className="mt-2 flex flex-1 flex-col items-center justify-start gap-6">
              {/* Profile Image */}
              <div className="w-full max-w-[180px]">
                <div className="relative mb-2 aspect-square w-full overflow-hidden rounded-xl border-2 border-dashed border-primary/20 bg-black">
                  <Image
                    src={
                      previewUrl ||
                      user.image ||
                      session?.data?.user?.image ||
                      "/user_placeholder.jpg"
                    }
                    alt="Profile"
                    fill
                    className="object-cover"
                    sizes="180px"
                  />
                </div>
                <div className="relative">
                  <Button
                    className="h-10 w-full rounded-full font-geist text-sm"
                    type="button"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {user.image || selectedImage
                      ? "Change Photo"
                      : "Upload Photo"}
                  </Button>
                  <Input
                    type="file"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* Cover Image Preview */}
              <div className="w-full max-w-[180px]">
                <div className="relative mb-2 aspect-video w-full overflow-hidden rounded-xl border-2 border-dashed border-primary/20 bg-black">
                  <Image
                    src={coverPreviewUrl || user.coverImage || "/obsession.jpg"}
                    alt="Cover"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative">
                  <Button
                    className="h-10 w-full rounded-full font-geist text-sm"
                    type="button"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {user.coverImage || selectedCoverImage
                      ? "Change Cover"
                      : "Upload Cover"}
                  </Button>
                  <Input
                    type="file"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    accept="image/*"
                    onChange={handleCoverFileChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 flex-col overflow-y-auto p-6">
            <DialogTitle className="sr-only">Edit Profile</DialogTitle>

            {/* Form Content */}
            <div className="grid gap-6">
              <div className="rounded-xl border border-gray-100 bg-card p-4 shadow-none dark:border-gray-500/5">
                <h3 className="mb-4 font-geist text-lg font-medium">
                  Basic Information
                </h3>

                <div className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="displayName"
                        className="font-geist text-sm font-medium"
                      >
                        Display Name
                      </Label>
                      <Input
                        id="displayName"
                        value={displayName || ""}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your display name"
                        className="h-10 rounded-xl border-input/50 font-geist text-sm shadow-none focus-visible:ring-primary/50 dark:border-gray-500/5"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="nerdAt"
                        className="font-geist text-sm font-medium"
                      >
                        What are you nerd at?
                      </Label>
                      <Input
                        id="nerdAt"
                        value={nerdAt || ""}
                        onChange={(e) => setNerdAt(e.target.value)}
                        placeholder="e.g., Programming, Music, Art"
                        className="h-10 rounded-xl border-input/50 font-geist text-sm shadow-none focus-visible:ring-primary/50 dark:border-gray-500/5"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="bio"
                      className="font-geist text-sm font-medium"
                    >
                      Bio
                    </Label>
                    <AutosizeTextarea
                      value={bio || ""}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      className="min-h-[80px] w-full rounded-xl border-input/50 text-sm shadow-none focus-visible:ring-primary/50 dark:border-gray-500/20"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="link"
                        className="font-geist text-sm font-medium"
                      >
                        Personal Link
                      </Label>
                      <Input
                        id="link"
                        value={link || ""}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="https://your-website.com"
                        className="h-10 rounded-xl border-input/50 font-geist text-sm shadow-none focus-visible:ring-primary/50 dark:border-gray-500/5"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="country"
                        className="font-geist text-sm font-medium"
                      >
                        Country
                      </Label>
                      {user?.country ? (
                        <div className="flex h-10 items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 shadow-sm dark:border-gray-500/5 dark:bg-black">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <p className="font-geist text-sm text-muted-foreground">
                            {user?.country?.name}
                          </p>
                        </div>
                      ) : (
                        <CountryDropdown
                          className="h-10 rounded-xl border-input/50 shadow-none focus-visible:ring-primary/50 dark:border-gray-500/5"
                          placeholder="Select country"
                          defaultValue={selectedCountry?.alpha3}
                          onChange={(country) => setSelectedCountry(country)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-3 border-t pt-4 font-geist dark:border-gray-500/5">
              <Button
                variant="outline"
                className="h-10 w-24 rounded-2xl"
                onClick={() => setIsOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="h-10 w-fit gap-2 rounded-2xl"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSettings;
