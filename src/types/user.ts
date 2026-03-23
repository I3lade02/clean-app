export type UserRole = "citizen" | "volunteer" | "worker" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  points: number;
};
