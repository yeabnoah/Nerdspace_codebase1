import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await authClient.getSession();

  if (session.data?.user) {
    redirect("/");
  }

  return <div>{children}</div>;
};

export default AuthLayout;
