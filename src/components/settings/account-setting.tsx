import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface UserData {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  bio: string | null;
  nerdAt: string | null;
  coverImage: string | null;
  link: string | null;
  country: {
    name: string;
    emoji: string;
  } | null;
  verification: {
    status: string;
    verifiedAt?: string;
  };
  stats: {
    followers: number;
    following: number;
    posts: number;
    projects: number;
    communities: number;
    activeSessions: number;
    connectedAccounts: number;
  };
  security: {
    sessions: Array<{
      id: string;
      createdAt: string;
      expiresAt: string;
      device: {
        userAgent: string;
        ipAddress: string;
        lastActive: string;
      };
      isCurrent: boolean;
    }>;
    connectedAccounts: Array<{
      provider: string;
      email: string;
      connectedAt: string;
      lastUsed: string;
    }>;
  };
  accountCreated: string;
  lastUpdated: string;
}

const AccountSetting = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/account");
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUserData(data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    let loadingToastId = toast.loading("Loading ... logging out");
    await authClient.signOut({
      fetchOptions: {
        onRequest: () => {
          loadingToastId = toast.loading("Loading ... logging out");
        },
        onSuccess: () => {
          toast.dismiss(loadingToastId);
          toast.success("you're successfully logged Out");
          router.push("/login");
        },
        onError: () => {
          toast.dismiss(loadingToastId);
          toast.error("error happened while trying to LogOut");
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-red-500">Failed to load user data</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Account Settings</h2>
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-semibold">Profile Information</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Name:</span> {userData.name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {userData.email}
                  </p>
                  <p>
                    <span className="font-medium">Email Status:</span>{" "}
                    <span className={userData.emailVerified ? "text-green-500" : "text-red-500"}>
                      {userData.emailVerified ? "Verified" : "Not Verified"}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Bio:</span>{" "}
                    {userData.bio || "No bio set"}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span>{" "}
                    {userData.country
                      ? `${userData.country.emoji} ${userData.country.name}`
                      : "Not set"}
                  </p>
                  <p>
                    <span className="font-medium">Website:</span>{" "}
                    {userData.link || "Not set"}
                  </p>
                  <p>
                    <span className="font-medium">Account Created:</span>{" "}
                    {new Date(userData.accountCreated).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Last Updated:</span>{" "}
                    {new Date(userData.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold">Profile Images</h3>
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 font-medium">Profile Picture</p>
                    {userData.image ? (
                      <Image
                        src={userData.image}
                        alt="Profile"
                        width={100}
                        height={100}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
                        <span className="text-gray-500">No image</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="mb-2 font-medium">Cover Image</p>
                    {userData.coverImage ? (
                      <Image
                        src={userData.coverImage}
                        alt="Cover"
                        width={200}
                        height={100}
                        className="rounded-md"
                      />
                    ) : (
                      <div className="flex h-32 w-full items-center justify-center rounded-md bg-gray-200">
                        <span className="text-gray-500">No cover image</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-lg font-semibold">Account Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Followers</p>
                    <p className="text-2xl font-bold">
                      {userData.stats.followers}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Following</p>
                    <p className="text-2xl font-bold">
                      {userData.stats.following}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Posts</p>
                    <p className="text-2xl font-bold">{userData.stats.posts}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Projects</p>
                    <p className="text-2xl font-bold">
                      {userData.stats.projects}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Communities</p>
                    <p className="text-2xl font-bold">
                      {userData.stats.communities}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Active Sessions</p>
                    <p className="text-2xl font-bold">
                      {userData.stats.activeSessions}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold">Active Sessions</h3>
                <div className="space-y-4">
                  {userData.security.sessions.map((session) => (
                    <div
                      key={session.id}
                      className={`rounded-lg border p-4 ${
                        session.isCurrent ? "border-green-500 bg-green-50" : "border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between">
                        <p className="font-medium">
                          {session.isCurrent ? "Current Session" : "Other Session"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mt-2 space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Device:</span>{" "}
                          {session.device.userAgent}
                        </p>
                        <p>
                          <span className="font-medium">IP Address:</span>{" "}
                          {session.device.ipAddress}
                        </p>
                        <p>
                          <span className="font-medium">Last Active:</span>{" "}
                          {new Date(session.device.lastActive).toLocaleString()}
                        </p>
                        <p>
                          <span className="font-medium">Expires:</span>{" "}
                          {new Date(session.expiresAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold">Connected Accounts</h3>
                <div className="space-y-4">
                  {userData.security.connectedAccounts.map((account) => (
                    <div
                      key={account.provider}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex justify-between">
                        <p className="font-medium capitalize">{account.provider}</p>
                        <p className="text-sm text-gray-500">
                          Connected: {new Date(account.connectedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mt-2 space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Email:</span> {account.email}
                        </p>
                        <p>
                          <span className="font-medium">Last Used:</span>{" "}
                          {new Date(account.lastUsed).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSetting;
