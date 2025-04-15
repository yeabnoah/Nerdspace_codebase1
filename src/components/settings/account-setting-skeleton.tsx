import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function AccountSettingSkeleton() {
  return (
    <div className="container relative mx-auto w-[60vw] overflow-hidden pb-8">
      <div className="absolute -right-10 -top-20 hidden h-[300px] w-[300px] -rotate-45 rounded-full bg-gradient-to-br from-amber-300/10 to-transparent blur-[80px] dark:from-orange-300/10 md:block"></div>

      <Card className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-500/5 dark:bg-black">
        <CardHeader className="px-6">
          <CardTitle className="font-geist text-2xl font-medium">
            Account Settings
          </CardTitle>
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-8 px-6">
          {/* Profile Section */}
          <div className="group relative h-[150px] w-full overflow-hidden rounded-2xl shadow-lg">
            <Skeleton className="h-full w-full" />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-zinc-900/90 via-zinc-900/60 to-transparent px-8 dark:from-black/80 dark:via-black/50">
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-900/90 to-transparent dark:from-black"></div>
              <div className="relative z-10 flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div>
                  <Skeleton className="mb-2 h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-500/5 dark:bg-black">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="mt-2 h-8 w-12" />
              </div>
            ))}
          </div>

          {/* Account Information Section */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-500/5 dark:bg-black">
              <div className="grid gap-6 md:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-500/5 dark:bg-black">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-9 w-24 rounded-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Connected Accounts Section */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-500/5 dark:bg-black">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div>
                        <Skeleton className="mb-1 h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-24 rounded-xl" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Account Activity Section */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-500/5 dark:bg-black">
              <div className="space-y-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="flex justify-end">
            <Button
              variant="destructive"
              className="h-10 w-fit gap-2 rounded-lg"
              disabled
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 