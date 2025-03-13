import { Country } from "@/components/ui/country-dropdown";

interface UserInterface {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
  nerdAt?: string | null;
  bio?: string | null;
  link?: string | null;
  visualName?: string | null;
  firstTime: boolean;
  country: Country;
}

export default UserInterface;
