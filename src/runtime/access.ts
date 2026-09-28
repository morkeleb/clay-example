import { rolePermissions } from "../generated/identity";
import type { User } from "./context";

export class AccessDenied extends Error {
  constructor(permission: string) {
    super(`Missing permission ${permission}.`);
    this.name = "AccessDenied";
  }
}

export function requirePermission(user: User, permission: string): void {
  const allowed = rolePermissions[user.role];
  if (!allowed.includes(permission)) {
    throw new AccessDenied(permission);
  }
}
