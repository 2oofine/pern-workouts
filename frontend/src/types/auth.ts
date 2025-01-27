export type User = {
  id: string;
  email: string;
  password: string;
};

export type UserResponse = {
  status: string;
  data: Partial<User>;
  token: string;
  error: string;
  emptyFields?: string[];
};
