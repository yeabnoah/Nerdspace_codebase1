import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useFormContext } from "react-hook-form";

interface Step3Props {
  displayName: string;
  setDisplayName: (value: string) => void;
  link: string;
  setLink: (value: string) => void;
}

const Step3: React.FC<Step3Props> = ({
  displayName,
  setDisplayName,
  link,
  setLink,
}) => {
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <div className="px-4">
      <div className="mb-4">
        <Label className="mb-2">Display name</Label>
        <Input
          placeholder="John Doe"
          className="mt-1 bg-transparent py-2 text-sm placeholder:text-sm"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        {errors.displayName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.displayName.message?.toString()}
          </p>
        )}
      </div>

      <div className="mb-4">
        <Label className="mb-2">Link</Label>
        <Input
          placeholder="https://johndoe.blog"
          className="mt-1 bg-transparent py-2 text-sm placeholder:text-sm"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        {errors.link && (
          <p className="text-red-500 text-sm mt-1">{errors.link.message?.toString()}</p>
        )}
      </div>
    </div>
  );
};

export default Step3;