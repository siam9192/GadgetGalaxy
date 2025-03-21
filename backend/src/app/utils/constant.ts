import { UserRole } from "@prisma/client";

export const paginationOptionKeys = ["page", "limit", "orderBy", "sortOrder"];

export const allRoles = Object.values(UserRole);
