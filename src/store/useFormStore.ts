import { create } from "zustand";
import { Country } from "../components/ui/country-dropdown";

interface FormState {
  selectedCountry: Country | null;
  selectedCoverImage: File | null; // Add this line
  selectedImage: File | null;
  nerdAt: string;
  bio: string;
  displayName: string;
  link: string;
  setSelectedCountry: (country: Country) => void;
  setSelectedImage: (image: File) => void;
  setNerdAt: (value: string) => void;
  setBio: (value: string) => void;
  setDisplayName: (value: string) => void;
  setLink: (value: string) => void;
  setSelectedCoverImage: (image: File) => void; // Add this line
}

export const useFormStore = create<FormState>((set) => ({
  selectedCountry: null,
  selectedImage: null,
  nerdAt: "",
  bio: "",
  displayName: "",
  link: "",
  setSelectedCountry: (country) => set({ selectedCountry: country }),
  setSelectedImage: (image) => set({ selectedImage: image }),
  setNerdAt: (value) => set({ nerdAt: value }),
  setBio: (value) => set({ bio: value }),
  setDisplayName: (value) => set({ displayName: value }),
  setLink: (value) => set({ link: value }),
  selectedCoverImage: null, // Add this line
  setSelectedCoverImage: (image) => set({ selectedCoverImage: image }), // Add this line
}));
