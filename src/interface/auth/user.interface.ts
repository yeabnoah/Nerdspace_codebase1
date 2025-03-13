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
  country?: string | null;
  link?: string | null;
  visualName?: string | null;
}

export default UserInterface;
