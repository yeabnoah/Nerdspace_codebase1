"use client";

import {
  Bookmark,
  Clock,
  Computer,
  FolderKanbanIcon,
  HomeIcon,
  Search,
  TrendingUp,
  Users,
  UserCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Progress } from "../ui/progress";
import { motion, AnimatePresence } from "framer-motion";

const LeftNavbar = () => {
  const router = useRouter();
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchProfileCompletion = async () => {
      try {
        const response = await fetch("/api/onboarding/status");
        const data = await response.json();
        if (data.completionPercentage !== undefined) {
          setCompletionPercentage(data.completionPercentage);
        }
      } catch (error) {
        console.error("Error fetching profile completion:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileCompletion();
  }, []);

  const profileItems = [
    { name: "Basic Info", threshold: 14 },
    { name: "Profile Image", threshold: 28 },
    { name: "Cover Image", threshold: 42 },
    { name: "Bio", threshold: 56 },
    { name: "Nerd At", threshold: 70 },
    { name: "Country", threshold: 84 },
    { name: "Personal Link", threshold: 100 },
  ];

  return (
    <div className="sticky left-0 top-20 hidden gap-2 px-5 py-5 md:flex md:w-fit md:flex-col lg:w-[17vw]">
      <Button
        onClick={() => {
          router.push("/");
        }}
        variant="outline"
        className="justify-start gap-3 border-gray-100 bg-transparent shadow-none dark:border-gray-500/5"
      >
        <HomeIcon className="hidden md:block" size={20} />
        <span className="hidden lg:block">Home</span>
      </Button>
      <Button
        onClick={() => {
          router.push("/explore");
        }}
        variant="outline"
        className="justify-start gap-3 border-gray-100 bg-transparent shadow-none dark:border-gray-500/5"
      >
        <TrendingUp className="hidden md:block" size={20} />
        <span className="hidden lg:block">Explore</span>
      </Button>
      <Button
        onClick={() => {
          router.push("/project");
        }}
        variant="outline"
        className="justify-start gap-3 border-gray-100 bg-transparent shadow-none dark:border-gray-500/5"
      >
        <FolderKanbanIcon className="hidden md:block" size={20} />
        <span className="hidden lg:block">Project</span>
      </Button>
      <Button
        onClick={() => {
          router.push("/community");
        }}
        variant="outline"
        className="justify-start gap-3 border-gray-100 bg-transparent shadow-none dark:border-gray-500/5"
      >
        <Users className="hidden md:block" size={20} />
        <span className="hidden lg:block">Communities</span>
      </Button>

      <Button
        onClick={() => {
          router.push("/events");
        }}
        variant="outline"
        className="justify-start gap-3 border-gray-100 bg-transparent shadow-none dark:border-gray-500/5"
      >
        <Clock className="hidden md:block" size={20} />
        <span className="hidden lg:block">Events</span>
      </Button>
      <Button
        variant="outline"
        className="justify-start gap-3 border-gray-100 bg-transparent shadow-none dark:border-gray-500/5"
      >
        <Computer className="hidden md:block" size={20} />
        <span className="hidden lg:block">Nerd AI</span>
      </Button>

      <div
        className="relative mt-4 cursor-pointer overflow-hidden rounded-lg border border-transparent bg-transparent p-4 backdrop-blur-sm"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="absolute -right-4 top-0 size-32 -rotate-45 rounded-full border border-blue-300/50 bg-gradient-to-br from-blue-300/10 via-blue-400/30 to-transparent blur-[100px] backdrop-blur-sm"></div>
        {/* <div className="absolute -bottom-5 left-0 size-32 rotate-45 rounded-full border border-orange-300/50 bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent blur-[100px] backdrop-blur-sm"></div> */}

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Profile Setup</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} />
            </motion.div>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <Progress
              value={completionPercentage}
              className="h-2 flex-1 bg-primary/10 [&>*]:bg-gradient-to-r [&>*]:from-purple-500 [&>*]:to-purple-500"
            />
            <span className="text-xs font-medium text-muted-foreground">
              {loading ? "..." : `${completionPercentage}%`}
            </span>
          </div>

          {/* "Complete Profile" Button - Always Visible */}
          <Button 
            variant="link"
            size="sm"
            className="w-full justify-center py-0 text-xs text-primary"
            onClick={(e) => {
              e.stopPropagation();
              router.push("/settings");
            }}
          >
            Complete Profile
          </Button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: "1rem" }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mb-1 border-t border-gray-500/10 dark:border-white/10"></div>
                <span className="text-sm font-medium text-muted-foreground">Complete your profile</span>
                <div className="mt-2 space-y-1">
                  {profileItems.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-2 text-xs"
                    >
                      <motion.div
                        className={`size-3 rounded-full border ${completionPercentage >= item.threshold && "border-purple-400 bg-purple-500"}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.1 + profileItems.indexOf(item) * 0.05,
                        }}
                      />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LeftNavbar;
