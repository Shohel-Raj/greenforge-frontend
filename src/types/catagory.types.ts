interface ICategory {
  id: string;
  name: string;
  createdAt: string;
  userId: string;
  ideas: unknown[];
}

interface CategoriesResponseData {
  data: ICategory[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

type FetchCategoriesSuccess = {
  success: true;
  data: ICategory[];
};

type FetchCategoriesError = {
  success: false;
  message: string;
};

export type { ICategory, CategoriesResponseData, FetchCategoriesSuccess, FetchCategoriesError };