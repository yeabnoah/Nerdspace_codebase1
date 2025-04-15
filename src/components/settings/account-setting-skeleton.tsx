import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function AccountSettingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Button
            variant="destructive"
            className="flex items-center gap-2"
            disabled
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile Section Skeleton */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="absolute bottom-0 right-0 h-6 w-20 rounded-full" />
              </div>

              <Skeleton className="mb-1 h-6 w-32" />
              <Skeleton className="mb-4 h-4 w-48" />

              <div className="w-full space-y-3 text-left">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>

              <div className="mt-6 w-full">
                <Skeleton className="mb-2 h-4 w-24" />
                <Skeleton className="h-24 w-full rounded-md" />
              </div>
            </CardContent>
          </Card>

          {/* Main Content Section Skeleton */}
          <div className="space-y-6 lg:col-span-2">
            {/* Stats Section Skeleton */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="rounded-lg border p-4 text-center">
                      <Skeleton className="mb-1 h-4 w-20" />
                      <Skeleton className="h-8 w-12" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sessions Section Skeleton */}
            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Connected Accounts Section Skeleton */}
            <Card>
              <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
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
} 