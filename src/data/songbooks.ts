export type SongbookCategory =
  | "All Songbooks"
  | "Guitar"
  | "Acoustic"
  | "Electric"
  | "Fingerstyle"
  | "Ukulele"
  | "Vocal";

export type Songbook = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  description: string;
  coverImage: string;
  category: Exclude<SongbookCategory, "All Songbooks">;
  difficulty: string;
  pages: number;
  publisher: string;
  language: string;
  price: number;
  rating: number;
  featured: boolean;
};

export const songbookCategories: SongbookCategory[] = [
  "All Songbooks",
  "Guitar",
  "Acoustic",
  "Electric",
  "Fingerstyle",
  "Ukulele",
  "Vocal",
];

export const songbooks: Songbook[] = [
  {
    id: "classic-rock",
    slug: "classic-rock-songbook",
    title: "Classic Rock Songbook",
    subtitle: "Songbook",
    author: "Mostly Acoustic Editors",
    description:
      "A curated collection of timeless classic rock songs arranged for guitar with clear chord charts and practical strumming suggestions.",
    coverImage: "/images/guitar-right.jpg",
    category: "Electric",
    difficulty: "Intermediate",
    pages: 128,
    publisher: "Mostly Acoustic Press",
    language: "English",
    price: 799,
    rating: 4.8,
    featured: true,
  },
  {
    id: "top-hits-easy",
    slug: "top-hits-super-easy-songbook",
    title: "Top Hits – Super Easy Songbook",
    subtitle: "Songbook",
    author: "Mostly Acoustic Editors",
    description:
      "Beginner-friendly arrangements of today’s most popular hits with simplified chords and large, easy-to-read charts.",
    coverImage: "/images/course-1.jpg",
    category: "Guitar",
    difficulty: "Beginner",
    pages: 96,
    publisher: "Mostly Acoustic Press",
    language: "English",
    price: 599,
    rating: 4.7,
    featured: true,
  },
  {
    id: "taylor-swift",
    slug: "taylor-swift-anthology",
    title: "Taylor Swift Anthology",
    subtitle: "Songbook",
    author: "Mostly Acoustic Editors",
    description:
      "A carefully arranged anthology of fan-favorite tracks with accessible chord voicings for acoustic and electric guitar.",
    coverImage: "/images/featured-course.jpg",
    category: "Vocal",
    difficulty: "Beginner",
    pages: 144,
    publisher: "Mostly Acoustic Press",
    language: "English",
    price: 899,
    rating: 4.9,
    featured: true,
  },
  {
    id: "beatles-50",
    slug: "first-50-songs-you-should-play-on-acoustic-guitar",
    title: "First 50 Songs You Should Play on Acoustic Guitar",
    subtitle: "Songbook",
    author: "Mostly Acoustic Editors",
    description:
      "Fifty essential songs every acoustic guitarist should know, arranged with open chords and practical practice notes.",
    coverImage: "/images/hero.jpg",
    category: "Acoustic",
    difficulty: "Beginner",
    pages: 160,
    publisher: "Mostly Acoustic Press",
    language: "English",
    price: 849,
    rating: 4.8,
    featured: false,
  },
  {
    id: "acoustic-guitar-method",
    slug: "acoustic-guitar-method",
    title: "Acoustic Guitar Method",
    subtitle: "Method",
    author: "Deepak Mehra",
    description:
      "A structured method book for building rhythm, chord fluency, and song-ready acoustic technique from the ground up.",
    coverImage: "/images/journey-1.jpg",
    category: "Acoustic",
    difficulty: "Beginner",
    pages: 112,
    publisher: "Mostly Acoustic Press",
    language: "English",
    price: 699,
    rating: 4.9,
    featured: true,
  },
  {
    id: "electric-guitar-method",
    slug: "electric-guitar-method",
    title: "Electric Guitar Method",
    subtitle: "Method",
    author: "Deepak Mehra",
    description:
      "Learn electric guitar fundamentals with riffs, power chords, and clean practice pathways designed for real songs.",
    coverImage: "/images/course-2.jpg",
    category: "Electric",
    difficulty: "Beginner",
    pages: 120,
    publisher: "Mostly Acoustic Press",
    language: "English",
    price: 699,
    rating: 4.7,
    featured: false,
  },
  {
    id: "rock-guitar-method",
    slug: "rock-guitar-method",
    title: "Rock Guitar Method",
    subtitle: "Method",
    author: "Deepak Mehra",
    description:
      "Rock-focused lessons covering riffs, groove, bends, and song forms that help you sound confident quickly.",
    coverImage: "/images/course-3.jpg",
    category: "Electric",
    difficulty: "Intermediate",
    pages: 132,
    publisher: "Mostly Acoustic Press",
    language: "English",
    price: 749,
    rating: 4.6,
    featured: false,
  },
  {
    id: "country-guitar-method",
    slug: "country-guitar-method",
    title: "Country Guitar Method",
    subtitle: "Method",
    author: "Deepak Mehra",
    description:
      "Build country rhythm and lead skills with chicken-picking patterns, boom-chuck grooves, and song applications.",
    coverImage: "/images/journey-2.jpg",
    category: "Guitar",
    difficulty: "Intermediate",
    pages: 118,
    publisher: "Mostly Acoustic Press",
    language: "English",
    price: 749,
    rating: 4.5,
    featured: false,
  },
  {
    id: "fingerstyle-method",
    slug: "fingerstyle-guitar-songbook",
    title: "Fingerstyle Guitar Songbook",
    subtitle: "Songbook",
    author: "Deepak Mehra",
    description:
      "Beautiful fingerstyle arrangements with clear right-hand patterns and progressive difficulty for daily practice.",
    coverImage: "/images/journey-3.jpg",
    category: "Fingerstyle",
    difficulty: "Intermediate",
    pages: 108,
    publisher: "Mostly Acoustic Press",
    language: "English",
    price: 799,
    rating: 4.8,
    featured: true,
  },
  {
    id: "ukulele-chords",
    slug: "ukulele-chord-songbook",
    title: "Ukulele Chord Songbook",
    subtitle: "Songbook",
    author: "Mostly Acoustic Editors",
    description:
      "A friendly ukulele chord songbook packed with singable arrangements and diagram-supported chord changes.",
    coverImage: "/images/student-1.jpg",
    category: "Ukulele",
    difficulty: "Beginner",
    pages: 88,
    publisher: "Mostly Acoustic Press",
    language: "English",
    price: 499,
    rating: 4.6,
    featured: false,
  },
  {
    id: "pro-vocal",
    slug: "pro-vocal-songbook",
    title: "Pro Vocal Songbook",
    subtitle: "Pro Vocal",
    author: "Mostly Acoustic Editors",
    description:
      "Vocal-focused arrangements with melody cues, lyric clarity, and guitar accompaniment suggestions for performers.",
    coverImage: "/images/student-2.jpg",
    category: "Vocal",
    difficulty: "All Levels",
    pages: 102,
    publisher: "Mostly Acoustic Press",
    language: "English",
    price: 649,
    rating: 4.4,
    featured: false,
  },
  {
    id: "acoustic-hits",
    slug: "acoustic-hits-collection",
    title: "Acoustic Hits Collection",
    subtitle: "Songbook",
    author: "Mostly Acoustic Editors",
    description:
      "Popular acoustic hits arranged for campfire sessions, living-room practice, and confident open-mic performances.",
    coverImage: "/images/guitar-left.jpg",
    category: "Acoustic",
    difficulty: "Beginner",
    pages: 124,
    publisher: "Mostly Acoustic Press",
    language: "English",
    price: 699,
    rating: 4.7,
    featured: false,
  },
  {
    id: "easy-fingerpicking",
    slug: "easy-fingerpicking-songs",
    title: "Easy Fingerpicking Songs",
    subtitle: "Songbook",
    author: "Deepak Mehra",
    description:
      "Gentle fingerpicking repertoire designed to build independence, timing, and musical confidence for newer players.",
    coverImage: "/images/mission.jpg",
    category: "Fingerstyle",
    difficulty: "Beginner",
    pages: 94,
    publisher: "Mostly Acoustic Press",
    language: "English",
    price: 599,
    rating: 4.8,
    featured: false,
  },
  {
    id: "worship-guitar",
    slug: "worship-guitar-songbook",
    title: "Worship Guitar Songbook",
    subtitle: "Songbook",
    author: "Mostly Acoustic Editors",
    description:
      "Practical chord charts and progressions for worship settings with tips for smooth transitions and dynamic playing.",
    coverImage: "/images/student-3.jpg",
    category: "Guitar",
    difficulty: "Beginner",
    pages: 110,
    publisher: "Mostly Acoustic Press",
    language: "English",
    price: 649,
    rating: 4.5,
    featured: false,
  },
  {
    id: "blues-basics",
    slug: "blues-guitar-basics",
    title: "Blues Guitar Basics",
    subtitle: "Method",
    author: "Deepak Mehra",
    description:
      "Learn foundational blues vocabulary: 12-bar forms, shuffle feel, turnarounds, and essential licks for jamming.",
    coverImage: "/images/hero-bg.jpg",
    category: "Electric",
    difficulty: "Intermediate",
    pages: 100,
    publisher: "Mostly Acoustic Press",
    language: "English",
    price: 699,
    rating: 4.6,
    featured: false,
  },
];

export function getSongbookBySlug(slug: string): Songbook | undefined {
  return songbooks.find((book) => book.slug === slug);
}

export function getAllSongbookSlugs(): string[] {
  return songbooks.map((book) => book.slug);
}

export function getRelatedSongbooks(songbook: Songbook, limit = 4): Songbook[] {
  return songbooks
    .filter(
      (book) =>
        book.id !== songbook.id &&
        (book.category === songbook.category ||
          book.difficulty === songbook.difficulty),
    )
    .slice(0, limit);
}

export function filterSongbooks(
  category: SongbookCategory,
): Songbook[] {
  if (category === "All Songbooks") return songbooks;
  return songbooks.filter((book) => book.category === category);
}
