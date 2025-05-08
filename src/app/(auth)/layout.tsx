import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await authClient.getSession();

  if (session.data?.user) {
    redirect("/");
  }

  return (
    <div className="bg-[#0A0A0A] min-h-svh">
      <div className="mx-auto px-4 md:px-6 lg:px-8 py-8 container">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
