export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CategoryListItem = Category & {
  _count: {
    courses: number;
  };
};

export type CreateCategoryRequest = {
  name: string;
  description?: string;
};

export type UpdateCategoryRequest = {
  name?: string;
  description?: string;
};

export type DeleteCategoryResponse = {
  message: string;
};
