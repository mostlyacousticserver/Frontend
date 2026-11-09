export type ApiError = {
  statusCode: number;
  message: string | string[];
  error?: string;
};
