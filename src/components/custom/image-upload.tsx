import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface ImageUploadProps {
  onUpload: (imageUrl: string) => void;
}

export default function ImageUploader({ onUpload }: ImageUploadProps) {
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
        onUpload(response.data.secure_url);
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <Input type="file" onChange={handleFileChange} className="border-gray-300 dark:border-white/5" />
      {previewUrl && (
        <div className="flex flex-col items-center">
          <Image width={200} height={200} src={previewUrl} alt="Image Preview" className="w-full h-40 object-cover rounded-md" />
        </div>
      )}
    </div>
  );
}