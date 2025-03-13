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
    <div>
      <div>
        <Label className="mb-3">Display name</Label>
        <Input
          placeholder="what do you want your display name to be"
          className="mt-2 bg-transparent py-0"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        {errors.displayName && (
          <p className="text-red-500 text-sm mt-2">
            {errors.displayName.message?.toString()}
          </p>
        )}
      </div>

      <div className="mt-4">
        <Label className="mb-3">Link</Label>
        <Input
          placeholder="link to personal site"
          className="mt-2 bg-transparent py-0"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        {errors.link && (
          <p className="text-red-500 text-sm mt-2">{errors.link.message?.toString()}</p>
        )}
      </div>
    </div>
  );
};

export default Step3;