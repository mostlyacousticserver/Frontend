export type IncludedFeature = {
  id: string;
  title: string;
  description: string;
  icon: "clock" | "layers" | "infinity" | "trophy" | "download" | "dumbbell" | "award" | "devices" | "users" | "sparkles";
  color: string;
  bg: string;
};

export const checkoutIncludedFeatures: IncludedFeature[] = [
  {
    id: "hours",
    title: "42+ Hours of HD Lessons",
    description: "Comprehensive video content covering everything",
    icon: "clock",
    color: "text-[#3B82F6]",
    bg: "bg-[#EFF6FF]",
  },
  {
    id: "modules",
    title: "Step-by-Step Learning Modules",
    description: "From absolute beginner to advanced techniques",
    icon: "layers",
    color: "text-[#8B5CF6]",
    bg: "bg-[#F5F3FF]",
  },
  {
    id: "lifetime",
    title: "Lifetime Access",
    description: "Learn at your own pace, anytime, anywhere",
    icon: "infinity",
    color: "text-[#10B981]",
    bg: "bg-[#ECFDF5]",
  },
  {
    id: "resources",
    title: "Downloadable Resources",
    description: "Chord charts, practice sheets, and song tabs",
    icon: "download",
    color: "text-[#0EA5E9]",
    bg: "bg-[#F0F9FF]",
  },
  {
    id: "practice",
    title: "Practice Exercises",
    description: "Guided drills to build muscle memory faster",
    icon: "dumbbell",
    color: "text-[#F59E0B]",
    bg: "bg-[#FFFBEB]",
  },
  {
    id: "certificate",
    title: "Certificate of Completion",
    description: "Celebrate your progress with a shareable certificate",
    icon: "award",
    color: "text-[#F97316]",
    bg: "bg-[#FFF7ED]",
  },
  {
    id: "devices",
    title: "Access on Mobile & TV",
    description: "Practice wherever you are, on any device",
    icon: "devices",
    color: "text-[#6366F1]",
    bg: "bg-[#EEF2FF]",
  },
  {
    id: "community",
    title: "Community Support",
    description: "Get feedback and stay motivated with peers",
    icon: "users",
    color: "text-[#EC4899]",
    bg: "bg-[#FDF2F8]",
  },
  {
    id: "updates",
    title: "Future Course Updates",
    description: "New lessons added over time at no extra cost",
    icon: "sparkles",
    color: "text-[#14B8A6]",
    bg: "bg-[#F0FDFA]",
  },
  {
    id: "beginner",
    title: "Beginner-Friendly Curriculum",
    description: "No prior musical experience required",
    icon: "trophy",
    color: "text-[#F97316]",
    bg: "bg-[#FFF7ED]",
  },
];
