export type ContactInfoItem = {
  id: string;
  label: string;
  value: string;
  href?: string;
  icon: "mail" | "phone" | "map" | "clock" | "globe";
  color: string;
  bg: string;
};

export type SocialLink = {
  id: string;
  label: string;
  href: string;
  network: "instagram" | "facebook" | "youtube" | "x" | "linkedin";
};

export type ContactFaq = {
  id: string;
  question: string;
  answer: string;
};

export type OfficeLocation = {
  title: string;
  description: string;
  mapEmbedUrl: string;
  address: string;
};

export const contactHero = {
  badge: "We're Here to Help",
  title: "Let's Talk About Your Guitar Journey",
  description:
    "Have a question about courses, partnerships, technical support, or your learning path? Send a message and our team will get back to you shortly.",
};

export const contactInfoItems: ContactInfoItem[] = [
  {
    id: "email",
    label: "Email Address",
    value: "hello@mostlyacoustic.com",
    href: "mailto:hello@mostlyacoustic.com",
    icon: "mail",
    color: "text-[#0DA694]",
    bg: "bg-[#E6F8F5]",
  },
  {
    id: "phone",
    label: "Phone Number",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
    icon: "phone",
    color: "text-[#3B82F6]",
    bg: "bg-[#EFF6FF]",
  },
  {
    id: "address",
    label: "Studio Address",
    value: "12 Melody Lane, Indiranagar, Bengaluru 560038",
    href: "https://maps.google.com/?q=Indiranagar+Bengaluru",
    icon: "map",
    color: "text-[#F97316]",
    bg: "bg-[#FFF7ED]",
  },
  {
    id: "hours",
    label: "Working Hours",
    value: "Mon – Sat, 10:00 AM – 7:00 PM IST",
    icon: "clock",
    color: "text-[#8B5CF6]",
    bg: "bg-[#F5F3FF]",
  },
];

export const contactSocialLinks: SocialLink[] = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://instagram.com",
    network: "instagram",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://facebook.com",
    network: "facebook",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://youtube.com",
    network: "youtube",
  },
  {
    id: "x",
    label: "X / Twitter",
    href: "https://x.com",
    network: "x",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://linkedin.com",
    network: "linkedin",
  },
];

export const contactFaqs: ContactFaq[] = [
  {
    id: "access",
    question: "How do I access my course after purchase?",
    answer:
      "After a successful checkout, you can log in to your account and open My Courses. Lifetime access is activated immediately so you can start learning right away from any device.",
  },
  {
    id: "payment",
    question: "What payment methods do you accept?",
    answer:
      "We currently support major credit and debit cards and PayPal. All payments are processed securely, and you receive instant confirmation after a successful transaction.",
  },
  {
    id: "refund",
    question: "Do you offer refunds?",
    answer:
      "Yes. Eligible purchases are covered by our 30-day money-back guarantee. If the course is not the right fit, contact support with your order details and we will help you with the refund process.",
  },
  {
    id: "certificate",
    question: "Will I receive a certificate of completion?",
    answer:
      "Yes. After finishing the required lessons and practice checkpoints, you can download a shareable certificate of completion from your course dashboard.",
  },
  {
    id: "support",
    question: "How quickly does technical support respond?",
    answer:
      "We typically respond within one business day. For urgent playback or login issues, include your registered email and a short description so we can resolve it faster.",
  },
  {
    id: "community",
    question: "How do I join the student community?",
    answer:
      "Enrolled students receive community access details inside the course platform. You can ask questions, share progress, and get feedback from fellow learners and mentors.",
  },
];

export const officeLocation: OfficeLocation = {
  title: "Visit Our Studio",
  description:
    "Come by for an in-person consultation or lesson planning session. Visits are available by appointment during working hours.",
  address: "12 Melody Lane, Indiranagar, Bengaluru 560038",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.066!2d77.6408!3d12.9784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sIndiranagar%2C%20Bengaluru!5e0!3m2!1sen!2sin!4v1700000000000",
};
