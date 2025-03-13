import React, { useState } from "react";
import { Country, CountryDropdown } from "../ui/country-dropdown";
import { Label } from "../ui/label";
import Image from "next/image";
import { Edit } from "lucide-react";
import axios from "axios";
import { Input } from "../ui/input";

interface Step1Props {
  selectedCountry: Country | null;
  setSelectedCountry: (country: Country) => void;
  selectedImage: string;
  setSelectedImage: (image: string) => void;
}

const Step1 = ({
  selectedCountry,
  setSelectedCountry,
  selectedImage,
  setSelectedImage,
}: Step1Props) => {
  const cloudinaryUploadUrl = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!;
  const cloudinaryUploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Generate a local preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload the image
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", cloudinaryUploadPreset);

      try {
        const response = await axios.post(cloudinaryUploadUrl, formData);
        setSelectedImage(response.data.secure_url);
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }
  };

  return (
    <div className="px-4">
      <div className="relative mb-4">
        {selectedImage ? (
          <Image
            src={selectedImage ? selectedImage : "/user_placeholder.jpg"}
            alt="Profile Preview"
            width={200}
            height={200}
            className="mx-auto mt-2 h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <Image
            src={"/user.jpg"}
            alt="Profile Preview"
            width={200}
            height={200}
            className="mx-auto mt-2 size-16 rounded-full object-cover"
          />
        )}
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          id="image-upload"
          onChange={handleFileChange}
        />
        <label
          htmlFor="image-upload"
          className="absolute bottom-0 right-[42%] cursor-pointer rounded-full bg-white p-2 text-white"
        >
          <Edit size={16} color="black" />
        </label>
      </div>

      <div className="mb-4">
        <Label>Your nationality</Label>
        <CountryDropdown
          className="mt-2"
          placeholder="Select country"
          defaultValue={selectedCountry?.alpha3}
          onChange={(country) => setSelectedCountry(country)}
        />
      </div>
    </div>
  );
};

export default Step1;
