"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { CheckCircle, XCircle } from "lucide-react";
import axios from "axios";

export function OnboardingPrompt() {
  const router = useRouter();
  const [profileCompletion, setProfileCompletion] = useState({
    displayName: false,
    nerdAt: false,
    bio: false,
    country: false,
    image: false,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfileCompletion = async () => {
      try {
        const response = await axios.get("/api/onboarding/status", {
          withCredentials: true,
        });
        
        if (response.data.isFirstTime) {
          setProfileCompletion({
            displayName: false,
            nerdAt: false,
            bio: false,
            country: false,
            image: false,
            total: 0,
          });
        } else {
          // Check each field individually
          const userData = response.data.userData || {};
          const completion = {
            displayName: !!userData.displayName,
            nerdAt: !!userData.nerdAt,
            bio: !!userData.bio,
            country: !!userData.country,
            image: !!userData.image,
            total: 0,
          };
          
          // Calculate total completion percentage
          const total = Object.values(completion).filter(Boolean).length;
          completion.total = Math.round((total / 5) * 100);
          
          setProfileCompletion(completion);
        }
      } catch (error) {
        console.error("Error checking profile completion:", error);
      } finally {
        setLoading(false);
      }
    };

    checkProfileCompletion();
  }, []);

  if (loading) {
    return null;
  }

  // If profile is 100% complete, don't show the prompt
  if (profileCompletion.total === 100) {
    return null;
  }

  return (
    <Card className="mb-6 border-lime-500/20 bg-lime-500/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Complete Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Profile Completion</span>
            <span className="text-sm font-medium">{profileCompletion.total}%</span>
          </div>
          <Progress value={profileCompletion.total} className="h-2" />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Display Name</span>
              {profileCompletion.displayName ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">What you're nerd at</span>
              {profileCompletion.nerdAt ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Bio</span>
              {profileCompletion.bio ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Country</span>
              {profileCompletion.country ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Profile Picture</span>
              {profileCompletion.image ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
          
          <Button 
            className="w-full bg-lime-500 hover:bg-lime-600" 
            onClick={() => router.push("/onboarding")}
          >
            Complete Setup
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 