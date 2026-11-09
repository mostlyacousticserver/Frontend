export type CourseLesson = {
  id: string;
  title: string;
  duration: string;
  isPreview?: boolean;
  contentType?: "video" | "file" | "text";
};

export type CourseModule = {
  id: string;
  title: string;
  lessonCount: number;
  duration: string;
  lessons: CourseLesson[];
};

export type CourseOutlineLesson = CourseLesson;

export type CourseOutlineModule = {
  id: string;
  title: string;
  lessons: CourseOutlineLesson[];
};

export type CourseOutlineChapter = {
  id: string;
  title: string;
  lessonCount: number;
  duration: string;
  modules: CourseOutlineModule[];
};

export type CourseInstructor = {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  experience: string;
  students: string;
  rating: string;
  courses: string;
};

export type CoursePricing = {
  price: number;
  originalPrice: number;
  currency: string;
  discountPercent: number;
  offerLabel: string;
};

export type CourseReview = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
};

export type CourseFAQ = {
  id: string;
  question: string;
  answer: string;
};

export type RelatedCourse = {
  id: string;
  slug: string;
  title: string;
  image: string;
  level: string;
  rating: string;
  price: number;
};

export type CourseDetail = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description?: string;
  level: string;
  image: string;
  previewImage: string;
  rating: string;
  reviewCount: string;
  enrolledCount: string;
  lastUpdated: string;
  language: string;
  learningPoints: string[];
  requirements: string[];
  audience: string[];
  features: { label: string; icon: string }[];
  modules: CourseModule[];
  outline?: CourseOutlineChapter[];
  instructor: CourseInstructor;
  pricing: CoursePricing;
  reviews: CourseReview[];
  faqs: CourseFAQ[];
  relatedCourses: RelatedCourse[];
  comingSoon?: boolean;
};

export const courseDetails: Record<string, CourseDetail> = {
  "beginner-guitar-mastery": {
    id: "beginner-guitar-mastery",
    slug: "beginner-guitar-mastery",
    title: "Beginner Guitar Mastery",
    subtitle:
      "A structured, beginner-to-intermediate guitar course designed to help students master rhythm, chords, strumming, and complete songs through a practical step-by-step learning system.",
    level: "Beginner",
    image: "/images/course-1.jpg",
    previewImage: "/images/featured-course.jpg",
    rating: "4.8",
    reviewCount: "44,218",
    enrolledCount: "180,000+",
    lastUpdated: "July 2026",
    language: "English",
    learningPoints: [
      "Play clean open chords and smooth chord transitions with confidence",
      "Build rock-solid rhythm and strumming patterns for popular songs",
      "Read a practical fretting map instead of memorizing disconnected shapes",
      "Perform full beginner songs from intro to final chorus",
      "Develop practice routines that create real weekly progress",
      "Understand basic music theory applied directly to the fretboard",
      "Use dynamics and feel to make simple songs sound musical",
      "Join a supportive community for feedback and accountability",
    ],
    requirements: [
      "An acoustic or classical guitar in playable condition",
      "A quiet practice space and 20–30 minutes a day",
      "No prior music experience required",
      "Optional: a tuner app and a notebook for progress notes",
    ],
    audience: [
      "Absolute beginners who want a clear path to playing real songs",
      "Self-taught players stuck memorizing shapes without musical feel",
      "Adult learners looking for a structured, patient teaching style",
      "Anyone who wants lifetime access to revisit lessons anytime",
    ],
    features: [
      { label: "Lifetime Access", icon: "infinity" },
      { label: "Access on Mobile & TV", icon: "devices" },
      { label: "Certificate of Completion", icon: "certificate" },
      { label: "Downloadable Resources", icon: "download" },
      { label: "Private Community Access", icon: "users" },
      { label: "30-Day Money Back Guarantee", icon: "shield" },
    ],
    modules: [
      {
        id: "m1",
        title: "Getting Started: Guitar Setup & First Sounds",
        lessonCount: 6,
        duration: "52m",
        lessons: [
          { id: "m1-l1", title: "Welcome & How This Course Works", duration: "6m" },
          { id: "m1-l2", title: "Holding the Guitar Comfortably", duration: "8m" },
          { id: "m1-l3", title: "Tuning Made Simple", duration: "9m" },
          { id: "m1-l4", title: "Your First Open Strings", duration: "10m" },
          { id: "m1-l5", title: "Fretting Hand Basics", duration: "11m" },
          { id: "m1-l6", title: "Practice Plan: Week 1", duration: "8m" },
        ],
      },
      {
        id: "m2",
        title: "Open Chords & Clean Transitions",
        lessonCount: 8,
        duration: "1h 18m",
        lessons: [
          { id: "m2-l1", title: "G, C, and D — The Core Trio", duration: "12m" },
          { id: "m2-l2", title: "Em and Am for Emotional Songs", duration: "10m" },
          { id: "m2-l3", title: "Clean Chord Changes Drill", duration: "14m" },
          { id: "m2-l4", title: "Common Progressions Used Everywhere", duration: "11m" },
          { id: "m2-l5", title: "Mute Noise & Improve Clarity", duration: "9m" },
          { id: "m2-l6", title: "Song Sketch: Two-Chord Loops", duration: "10m" },
          { id: "m2-l7", title: "Finger Stretch & Endurance Tips", duration: "7m" },
          { id: "m2-l8", title: "Practice Plan: Week 2–3", duration: "5m" },
        ],
      },
      {
        id: "m3",
        title: "Rhythm, Timing & Strumming Patterns",
        lessonCount: 7,
        duration: "1h 05m",
        lessons: [
          { id: "m3-l1", title: "Feel the Beat Before You Play", duration: "8m" },
          { id: "m3-l2", title: "Downstrokes & Upstrokes", duration: "10m" },
          { id: "m3-l3", title: "The Universal Strum Pattern", duration: "12m" },
          { id: "m3-l4", title: "Dynamics: Soft vs Strong", duration: "9m" },
          { id: "m3-l5", title: "Syncopation for Modern Songs", duration: "11m" },
          { id: "m3-l6", title: "Play Along: Rhythm Jam", duration: "10m" },
          { id: "m3-l7", title: "Practice Plan: Groove Building", duration: "5m" },
        ],
      },
      {
        id: "m4",
        title: "Your First Full Songs",
        lessonCount: 5,
        duration: "58m",
        lessons: [
          { id: "m4-l1", title: "Song Structure Explained", duration: "8m" },
          { id: "m4-l2", title: "Song 1: Full Playthrough", duration: "14m" },
          { id: "m4-l3", title: "Song 2: Full Playthrough", duration: "14m" },
          { id: "m4-l4", title: "Transitions Between Sections", duration: "12m" },
          { id: "m4-l5", title: "Perform & Record Yourself", duration: "10m" },
        ],
      },
    ],
    instructor: {
      name: "Deepak Mehra",
      role: "Recording Artist & Guitar Educator",
      avatar: "/images/pr1.jpeg",
      bio: "Deepak Mehra has taught hundreds of thousands of students worldwide with a visual, song-first approach. His curriculum turns theory into playable patterns so beginners progress faster without overwhelm.",
      experience: "15+ years teaching & performing",
      students: "180K+",
      rating: "4.9",
      courses: "12",
    },
    pricing: {
      price: 999,
      originalPrice: 2499,
      currency: "₹",
      discountPercent: 60,
      offerLabel: "Limited-time launch offer — ends soon",
    },
    reviews: [
  {
    id: "r1",
    name: "Aritra Sen",
    avatar: "/images/testimonial-1.jpg",
    rating: 5,
    date: "2 weeks ago",
    text: "Perfect for beginners starting from zero. The structure made learning guitar simple and highly motivating.",
  },
  {
    id: "r2",
    name: "Swastika Choudhury",
    avatar: "/images/testimonial-2.jpg",
    rating: 5,
    date: "1 month ago",
    text: "Clear lessons and guided practice helped me stay consistent. I finally feel confident with chords and rhythm.",
  },
  {
    id: "r3",
    name: "Rohan Patel",
    avatar: "/images/instructor-2.jpg",
    rating: 5,
    date: "1 month ago",
    text: "Went from muted strings to full songs faster than I expected. The practice plans are gold.",
  },
],
    faqs: [
      {
        id: "f1",
        question: "Do I need prior experience?",
        answer:
          "No. This course is designed for absolute beginners and walks you through every step with clear demos and practice guidance.",
      },
      {
        id: "f2",
        question: "How long until I can play songs?",
        answer:
          "Most students play simple songs within a few weeks. With consistent practice, many perform full songs in about 30 days.",
      },
      {
        id: "f3",
        question: "Is access lifetime?",
        answer:
          "Yes. You get lifetime access to all videos, resources, and future updates included with this curriculum.",
      },
      {
        id: "f4",
        question: "What if the course isn't for me?",
        answer:
          "You're covered by a 30-day money-back guarantee. If it isn't the right fit, request a refund within 30 days.",
      },
    ],
    relatedCourses: [
      {
        id: "acoustic-foundations",
        slug: "acoustic-foundations",
        title: "Acoustic Foundations",
        image: "/images/course-2.jpg",
        level: "Beginner",
        rating: "4.9",
        price: 999,
      },
      {
        id: "fingerstyle-foundations",
        slug: "fingerstyle-foundations",
        title: "Fingerstyle Foundations",
        image: "/images/featured-course.jpg",
        level: "Intermediate",
        rating: "4.8",
        price: 1299,
      },
      {
        id: "rhythm-essentials",
        slug: "rhythm-essentials",
        title: "Rhythm Essentials",
        image: "/images/course-3.jpg",
        level: "Beginner",
        rating: "4.7",
        price: 999,
      },
    ],
  },
};

const baseCourse = courseDetails["beginner-guitar-mastery"];

courseDetails["acoustic-foundations"] = {
  ...baseCourse,
  id: "acoustic-foundations",
  slug: "acoustic-foundations",
  title: "Acoustic Foundations",
  image: "/images/course-2.jpg",
  previewImage: "/images/course-2.jpg",
  level: "Beginner",
};

courseDetails["fingerstyle-foundations"] = {
  ...baseCourse,
  id: "fingerstyle-foundations",
  slug: "fingerstyle-foundations",
  title: "Fingerstyle Foundations",
  image: "/images/featured-course.jpg",
  previewImage: "/images/featured-course.jpg",
  level: "Intermediate",
};

courseDetails["rhythm-essentials"] = {
  ...baseCourse,
  id: "rhythm-essentials",
  slug: "rhythm-essentials",
  title: "Rhythm Essentials",
  image: "/images/course-3.jpg",
  previewImage: "/images/course-3.jpg",
  level: "Beginner",
};

export function getCourseBySlug(slug: string): CourseDetail | undefined {
  return courseDetails[slug];
}

export function getAllCourseSlugs(): string[] {
  return Object.keys(courseDetails);
}
