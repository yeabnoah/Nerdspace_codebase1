import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { AutosizeTextarea } from "../ui/resizeble-text-area";
import { useFormContext } from "react-hook-form";

interface Step2Props {
  nerdAt: string;
  setNerdAt: (value: string) => void;
  bio: string;
  setBio: (value: string) => void;
}

const Step2: React.FC<Step2Props> = ({ nerdAt, setNerdAt, bio, setBio }) => {
  return (
    <div>
      <div>
        <Label className="mb-3">What are you nerd at</Label>
        <Input
          placeholder="Music"
          className="mt-2 bg-transparent py-0 text-sm placeholder:text-sm"
          value={nerdAt}
          onChange={(e) => setNerdAt(e.target.value)}
        />
      </div>

      <div className="mt-4">
        <Label className="mb-3">Bio</Label>
        <AutosizeTextarea
          placeholder="Please  provide your bio here"
          className="mt-2 bg-transparent py-1"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Step2;
