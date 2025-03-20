import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/providers/tanstack-query-provider";
import { useFormStore } from "@/store/useFormStore";
import useUserStore from "@/store/user.store";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Edit } from "lucide-react";
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

const ProfileSettings = () => {
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

  const cloudinaryUploadUrl = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!;
  const cloudinaryUploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const session = authClient.useSession();
  const { user, isloading } = useUserStore();

  const mutation = useMutation({
    mutationKey: ["update-user"],
    mutationFn: async () => {
      const response = await axios.patch(
        "/api/onboarding",
        {
          country: user?.country ? undefined : selectedCountry,
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

  return (
    <Card className="preview-card border-none bg-transparent shadow-none">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Please provide accurate information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="md:px-4">
          <div className="flex w-full flex-col md:flex-row md:items-center md:gap-10">
            <div className="relative mb-4">
              <Image
                src={
                  previewUrl ||
                  user.image ||
                  session?.data?.user?.image ||
                  "/user_placeholder.jpg"
                }
                alt="Profile Preview"
                width={200}
                height={200}
                className="mt-2 size-16 rounded-full object-cover"
              />

              {/* <div></div> */}

              <Input
                type="file"
                accept="image/*"
                className="hidden"
                id="image-upload"
                onChange={handleFileChange}
              />
              <label
                htmlFor="image-upload"
                className="absolute bottom-0 left-[15%] cursor-pointer rounded-full bg-white p-1 text-white md:left-[70%]"
              >
                <Edit size={13} color="black" />
              </label>
            </div>

            <div className="mb-4">
              <Label className="mb-2">Display name</Label>
              <Input
                placeholder="John Doe"
                className="mt-1 bg-transparent py-2 text-sm shadow-none placeholder:text-sm"
                value={displayName || ""}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <Label className="mb-2">Personal Link</Label>
              <Input
                placeholder="https://johndoe.blog"
                className="mt-1 bg-transparent py-2 text-sm shadow-none placeholder:text-sm"
                value={link || ""}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-3 px-4">
          <div className="mb-4 flex-1">
            <Label>Your Country</Label>
            {user?.country ? (
              <p>{user?.country?.name}</p>
            ) : (
              <CountryDropdown
                className="mt-2 shadow-none"
                placeholder="Select country"
                defaultValue={selectedCountry?.alpha3}
                onChange={(country) => setSelectedCountry(country)}
              />
            )}
          </div>
          <div className="mb-4">
            <Label className="mb-2">What are you nerd at</Label>
            <Input
              placeholder="Music"
              className="mt-1 bg-transparent py-2 text-sm shadow-none placeholder:text-sm"
              value={nerdAt || ""}
              onChange={(e) => setNerdAt(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <Label className="mb-2">Bio</Label>
            <AutosizeTextarea
              placeholder="Please provide your bio here"
              className="mt-1 bg-transparent py-2 shadow-none"
              value={bio || ""}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={async () => {
              if (selectedImage instanceof File) {
                const formData = new FormData();
                formData.append("file", selectedImage);
                formData.append("upload_preset", cloudinaryUploadPreset);

                try {
                  const response = await axios.post(
                    cloudinaryUploadUrl,
                    formData,
                  );
                  setSelectedImage(response.data.secure_url);
                } catch (error) {
                  console.error("Image upload failed:", error);
                  toast.error("Image upload failed");
                  return;
                }
              }

              console.log({
                country: selectedCountry,
                image: selectedImage,
                nerdAt,
                bio,
                displayName,
                link,
                firstTime: false,
              });
              await mutation.mutate();
            }}
          >
            Update my info
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
