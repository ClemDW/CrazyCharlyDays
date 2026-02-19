export const Role = {
  ADMIN: { name: "Admin", code: "ADMIN" },
  USER: { name: "User", code: "USER" }
} as const;

export type RoleKey = keyof typeof Role;