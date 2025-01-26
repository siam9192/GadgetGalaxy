import { UserRole } from "@prisma/client";

export const paginationOptionKeys = ["page", "limit", "sortBy", "orderBy"];

export const allRoles = Object.values(UserRole);
