import type { RoleName } from "../generated/identity";

export type User = { role: RoleName };

export type HandlerContext = { user: User };
