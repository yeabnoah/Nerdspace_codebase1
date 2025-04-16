"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  BookOpen,
  Building2,
  Globe,
  LinkIcon,
  LogOut,
  Mail,
  Monitor,
  Smartphone,
  Tablet,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { AccountSettingSkeleton } from "./account-setting-skeleton";
import { FaGithub, FaTwitter, FaGoogle } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const router = useRouter();
  const [showSessions, setShowSessions] = useState(false);
  const [showAccounts, setShowAccounts] = useState(false);
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  const {
    data: userData,
    isLoading,
    error,
    refetch,
  } = useQuery<UserData>({
    queryKey: ["account"],
    queryFn: async () => {
      const response = await axios.get("/api/account");
      return response.data.data;
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/auth/verify-email");
      return response.data;
    },
    onSuccess: () => {
      toast.success("Verification email sent successfully");
      setShowVerifyEmail(false);
    },
    onError: (error) => {
      toast.error("Failed to send verification email");
      console.error("Verification error:", error);
    },
  });

  const disconnectAccountMutation = useMutation({
    mutationFn: async (provider: string) => {
      const response = await axios.delete(`/api/auth/accounts/${provider}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Account disconnected successfully");
      refetch();
      setSelectedAccount(null);
    },
    onError: (error) => {
      toast.error("Failed to disconnect account");
      console.error("Disconnect error:", error);
    },
  });

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.toLowerCase().includes("mobile")) {
      return <Smartphone className="h-4 w-4" />;
    } else if (userAgent.toLowerCase().includes("tablet")) {
      return <Tablet className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

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

  const handleDisconnectAccount = (provider: string) => {
    setSelectedAccount(provider);
  };

  const confirmDisconnect = () => {
    if (selectedAccount) {
      disconnectAccountMutation.mutate(selectedAccount);
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "github":
        return <FaGithub className="h-4 w-4" />;
      case "google":
        return <FaGoogle className="h-4 w-4" />;
      case "twitter":
        return <FaTwitter className="h-4 w-4" />;
      default:
        return (
          <span className="text-sm font-medium">
            {provider[0].toUpperCase()}
          </span>
        );
    }
  };

  if (isLoading) {
    return <AccountSettingSkeleton />;
  }

  if (error || !userData) {
    return (
      <div className="flex min-h-[50vh] flex-1 items-center justify-center">
        <p className="text-destructive">Failed to load user data</p>
      </div>
    );
  }

  return (
    <div className="container relative mx-auto w-[60vw] overflow-hidden pb-8">
      <div className="absolute -right-10 -top-20 hidden h-[300px] w-[300px] -rotate-45 rounded-full bg-gradient-to-br from-amber-300/10 to-transparent blur-[80px] dark:from-orange-300/10 md:block"></div>

      <Card className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-500/5 dark:bg-black">
        <CardHeader className="px-6">
          <CardTitle className="font-geist text-2xl font-medium">
            Account Settings
          </CardTitle>
          <CardDescription className="font-geist text-sm text-muted-foreground">
            Manage your account settings and security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 px-6">
          {/* Profile Section */}
          <div className="group relative h-[250px] w-full overflow-hidden rounded-2xl shadow-lg">
            <Image
              src={userData?.coverImage || "/obsession.jpg"}
              alt="Cover Preview"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-zinc-900/90 via-zinc-900/60 to-transparent px-8 dark:from-black/80 dark:via-black/50">
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-900/90 to-transparent dark:from-black"></div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-primary/20">
                  <Image
                    src={userData?.image || "/user_placeholder.jpg"}
                    alt="Profile Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {userData?.name}
                  </h2>
                  <p className="text-sm text-white/80">{userData?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-500/5 dark:bg-black">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-geist text-sm font-medium text-muted-foreground">
                  Followers
                </h3>
              </div>
              <p className="font-geist text-2xl font-semibold">
                {userData?.stats.followers}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-500/5 dark:bg-black">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-geist text-sm font-medium text-muted-foreground">
                  Following
                </h3>
              </div>
              <p className="font-geist text-2xl font-semibold">
                {userData?.stats.following}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-500/5 dark:bg-black">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-geist text-sm font-medium text-muted-foreground">
                  Posts
                </h3>
              </div>
              <p className="font-geist text-2xl font-semibold">
                {userData?.stats.posts}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-500/5 dark:bg-black">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-geist text-sm font-medium text-muted-foreground">
                  Projects
                </h3>
              </div>
              <p className="font-geist text-2xl font-semibold">
                {userData?.stats.projects}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-500/5 dark:bg-black">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-geist text-sm font-medium text-muted-foreground">
                  Communities
                </h3>
              </div>
              <p className="font-geist text-2xl font-semibold">
                {userData?.stats.communities}
              </p>
            </div>
          </div>

          {/* Account Information Section */}
          <div className="space-y-4">
            <h3 className="font-geist text-lg font-medium">
              Account Information
            </h3>
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-500/5 dark:bg-black">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-geist text-sm font-medium">
                      Display Name
                    </h4>
                  </div>
                  <p className="font-geist text-sm text-muted-foreground">
                    {userData?.name}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-geist text-sm font-medium">Email</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-geist text-sm text-muted-foreground">
                      {userData?.email}
                    </p>
                    {userData?.emailVerified && (
                      <Badge variant="outline" className="h-5">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-geist text-sm font-medium">Country</h4>
                  </div>
                  <p className="font-geist text-sm text-muted-foreground">
                    {userData?.country
                      ? `${userData.country.emoji} ${userData.country.name}`
                      : "Not set"}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-geist text-sm font-medium">
                      Personal Link
                    </h4>
                  </div>
                  <p className="font-geist text-sm text-muted-foreground">
                    {userData?.link || "Not set"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="space-y-4">
            <h3 className="font-geist text-lg font-medium">Security</h3>
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-500/5 dark:bg-black">
              <div className="space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="sessions">
                    <AccordionTrigger className="flex items-center justify-between">
                      <div>
                        <h4 className="font-geist text-sm font-medium">
                          Active Sessions
                        </h4>
                        <p className="font-geist text-sm text-muted-foreground">
                          {userData?.security.sessions.length} active sessions
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-4">
                        {userData?.security.sessions.map((session) => (
                          <div
                            key={session.id}
                            className="flex items-center justify-between rounded-lg border p-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="rounded-full bg-primary/10 p-2">
                                {getDeviceIcon(session.device.userAgent)}
                              </div>
                              <div>
                                <p className="font-geist text-sm font-medium">
                                  {session.device.userAgent}
                                </p>
                                <div className="flex items-center gap-2">
                                  <p className="font-geist text-xs text-muted-foreground">
                                    IP: {session.device.ipAddress}
                                  </p>
                                  <span className="text-muted-foreground">
                                    •
                                  </span>
                                  <p className="font-geist text-xs text-muted-foreground">
                                    Last active:{" "}
                                    {formatDate(session.device.lastActive)}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {session.isCurrent && (
                                <Badge variant="secondary" className="h-5">
                                  Current
                                </Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 rounded-xl p-0"
                                onClick={() => {
                                  // Handle terminate session
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-geist text-sm font-medium">
                      Account Verification
                    </h4>
                    <p className="font-geist text-sm text-muted-foreground">
                      {userData?.verification.status === "Verified"
                        ? `Verified on ${new Date(userData.verification.verifiedAt!).toLocaleDateString()}`
                        : "Not verified"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="h-9 rounded-xl"
                    onClick={() => {
                      // Handle verification
                    }}
                  >
                    {userData?.verification.status === "Verified"
                      ? "View Status"
                      : "Verify Account"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Accounts Section */}
          <div className="space-y-4">
            <h3 className="font-geist text-lg font-medium">
              Connected Accounts
            </h3>
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-500/5 dark:bg-black">
              <div className="space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="accounts">
                    <AccordionTrigger className="flex items-center justify-between">
                      <div>
                        <h4 className="font-geist text-sm font-medium">
                          Social Accounts
                        </h4>
                        <p className="font-geist text-sm text-muted-foreground">
                          {userData?.security.connectedAccounts.length}{" "}
                          connected accounts
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-4">
                        {userData?.security.connectedAccounts.map((account) => (
                          <div
                            key={account.provider}
                            className="flex items-center justify-between rounded-lg border p-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="rounded-full bg-primary/10 p-2">
                                {getProviderIcon(account.provider)}
                              </div>
                              <div>
                                <p className="font-geist text-sm font-medium">
                                  {account.provider}
                                </p>
                                <div className="flex items-center gap-2">
                                  <p className="font-geist text-xs text-muted-foreground">
                                    {account.email}
                                  </p>
                                  <span className="text-muted-foreground">
                                    •
                                  </span>
                                  <p className="font-geist text-xs text-muted-foreground">
                                    Last used: {formatDate(account.lastUsed)}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="h-5">
                                Connected
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 rounded-xl"
                                onClick={() =>
                                  handleDisconnectAccount(account.provider)
                                }
                              >
                                Disconnect
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>

          {/* Account Activity Section */}
          <div className="space-y-4">
            <h3 className="font-geist text-lg font-medium">Account Activity</h3>
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-500/5 dark:bg-black">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-geist text-sm font-medium">
                      Account Created
                    </h4>
                    <p className="font-geist text-sm text-muted-foreground">
                      {new Date(userData?.accountCreated || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-geist text-sm font-medium">
                      Last Updated
                    </h4>
                    <p className="font-geist text-sm text-muted-foreground">
                      {new Date(userData?.lastUpdated || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="flex justify-end">
            <Button
              className="h-10 w-fit gap-2 rounded-lg bg-red-500 text-white hover:bg-red-600 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Verify Email Modal */}
      <Dialog open={showVerifyEmail} onOpenChange={setShowVerifyEmail}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-geist text-xl">
              Verify Your Email
            </DialogTitle>
            <DialogDescription>
              We&apos;ll send you a verification link to your email address
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-lg bg-primary/5 p-4">
              <Mail className="h-4 w-4 text-primary" />
              <p className="font-geist text-sm text-muted-foreground">
                {userData?.email}
              </p>
            </div>
            <p className="font-geist text-sm text-muted-foreground">
              Click the button below to send a verification email to your
              address.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVerifyEmail(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => verifyEmailMutation.mutate()}
              disabled={verifyEmailMutation.isPending}
            >
              {verifyEmailMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Sending...
                </div>
              ) : (
                "Send Verification Email"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disconnect Account Confirmation */}
      <AlertDialog
        open={!!selectedAccount}
        onOpenChange={() => setSelectedAccount(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disconnect your {selectedAccount}{" "}
              account? You may need to reconnect it to use certain features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDisconnect}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AccountSetting;
