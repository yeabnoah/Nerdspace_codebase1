import React from "react";
import { Country, CountryDropdown } from "../ui/country-dropdown";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Image from "next/image";
import { Edit } from "lucide-react";

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
  return (
    <div>
      <div className="relative">
        {selectedImage ? (
          <Image
            src={selectedImage ? selectedImage : "/user_placeholder.jpg"}
            alt="Profile Preview"
            width={200}
            height={200}
            className="mx-auto mt-2 h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <Image
            src={"/user.jpg"}
            alt="Profile Preview"
            width={200}
            height={200}
            className="mx-auto mt-2 size-32 rounded-full object-cover"
          />
        )}
        <Input
          type="file"
          accept="image/*"
          className="hidden "
          id="image-upload"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setSelectedImage(reader.result as string);
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        <label
          htmlFor="image-upload"
          className="absolute bottom-0 right-[42%] cursor-pointer rounded-full bg-white p-2 text-white"
        >
          <Edit size={16} color="black" className="" />
        </label>
      </div>

      <div className="mt-4">
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
