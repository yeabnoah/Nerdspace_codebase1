"use client";

import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Clock, Globe, LinkIcon, LogOut, Mail, User } from "lucide-react";

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
    let loadingToastId = toast.loading("Logging out...");
    await authClient.signOut({
      fetchOptions: {
        onRequest: () => {
          loadingToastId = toast.loading("Logging out...");
        },
        onSuccess: () => {
          toast.dismiss(loadingToastId);
          toast.success("You've successfully logged out");
          router.push("/login");
        },
        onError: () => {
          toast.dismiss(loadingToastId);
          toast.error("Error happened while trying to log out");
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex min-h-[50vh] flex-1 items-center justify-center">
        <p className="text-destructive">Failed to load user data</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                {userData.image ? (
                  <Avatar className="h-24 w-24 border-4 border-background">
                    <AvatarImage
                      src={userData.image || "/placeholder.svg"}
                      alt={userData.name}
                    />
                    <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="h-24 w-24 border-4 border-background">
                    <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <Badge
                  className={`absolute bottom-0 right-0 ${
                    userData.emailVerified
                      ? "bg-emerald-500 hover:bg-emerald-600"
                      : "bg-destructive"
                  }`}
                  variant="secondary"
                >
                  {userData.emailVerified ? "Verified" : "Unverified"}
                </Badge>
              </div>

              <h2 className="mb-1 text-xl font-semibold">{userData.name}</h2>
              <p className="mb-4 flex items-center justify-center gap-1 text-muted-foreground">
                <Mail className="h-3 w-3" /> {userData.email}
              </p>

              <div className="w-full space-y-3 text-left">
                {userData.bio && (
                  <div className="text-sm">
                    <span className="font-medium">Bio:</span> {userData.bio}
                  </div>
                )}

                {userData.country && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {userData.country.emoji} {userData.country.name}
                    </span>
                  </div>
                )}

                {userData.link && (
                  <div className="flex items-center gap-2 text-sm">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={userData.link}
                      className="truncate text-primary hover:underline"
                    >
                      {userData.link.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Joined{" "}
                    {new Date(userData.accountCreated).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {userData.coverImage && (
                <div className="mt-6 w-full">
                  <p className="mb-2 text-left text-sm font-medium">
                    Cover Image
                  </p>
                  <div className="relative h-24 w-full overflow-hidden rounded-md">
                    <Image
                      src={userData.coverImage || "/placeholder.svg"}
                      alt="Cover"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Content Section */}
          <div className="space-y-6 lg:col-span-2">
            {/* Stats Section */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <StatCard
                    label="Followers"
                    value={userData.stats.followers}
                  />
                  <StatCard
                    label="Following"
                    value={userData.stats.following}
                  />
                  <StatCard label="Posts" value={userData.stats.posts} />
                  <StatCard label="Projects" value={userData.stats.projects} />
                  <StatCard
                    label="Communities"
                    value={userData.stats.communities}
                  />
                  <StatCard
                    label="Active Sessions"
                    value={userData.stats.activeSessions}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sessions Section */}
            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData.security.sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`rounded-lg border p-4 ${session.isCurrent ? "border-primary bg-primary/5" : ""}`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 font-medium">
                        <User className="h-4 w-4" />
                        {session.isCurrent
                          ? "Current Session"
                          : "Other Session"}
                        {session.isCurrent && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-1 text-sm sm:grid-cols-2">
                      <p className="truncate">
                        <span className="font-medium">Device:</span>{" "}
                        <span className="text-muted-foreground">
                          {session.device.userAgent}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">IP:</span>{" "}
                        <span className="text-muted-foreground">
                          {session.device.ipAddress}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Last Active:</span>{" "}
                        <span className="text-muted-foreground">
                          {new Date(session.device.lastActive).toLocaleString()}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Expires:</span>{" "}
                        <span className="text-muted-foreground">
                          {new Date(session.expiresAt).toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Connected Accounts Section */}
            <Card>
              <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData.security.connectedAccounts.map((account) => (
                  <div key={account.provider} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-medium capitalize">
                        {account.provider}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Connected:{" "}
                        {new Date(account.connectedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-1 text-sm sm:grid-cols-2">
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        <span className="text-muted-foreground">
                          {account.email}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Last Used:</span>{" "}
                        <span className="text-muted-foreground">
                          {new Date(account.lastUsed).toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ label, value }: { label: string; value: number }) => {
  return (
    <div className="rounded-lg border p-4 text-center">
      <p className="mb-1 text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default AccountSetting;
