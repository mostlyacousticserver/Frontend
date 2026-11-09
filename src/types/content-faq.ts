export type ContentFaqOwnerType = "course" | "free_course" | "song" | "blog";

export type ContentFaq = {
  id: string;
  ownerType: ContentFaqOwnerType;
  ownerId: string;
  question: string;
  answer: string;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PublicContentFaq = {
  id: string;
  question: string;
  answer: string;
  position?: number;
};

export type CreateContentFaqRequest = {
  ownerType: ContentFaqOwnerType;
  ownerId: string;
  question: string;
  answer: string;
  position?: number;
  isActive?: boolean;
};

export type UpdateContentFaqRequest = {
  question?: string;
  answer?: string;
  position?: number;
  isActive?: boolean;
};

export type ListContentFaqsQuery = {
  ownerType: ContentFaqOwnerType;
  ownerId: string;
  activeOnly?: boolean;
};
