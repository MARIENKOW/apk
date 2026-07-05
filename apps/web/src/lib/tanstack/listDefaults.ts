import { Pagination } from "./pagination";

/**
 * Параметры list-запросов = Pagination & Filters.
 * Вынесены в lib/ (без React-импортов) — импортируются и в server components
 * (для SSR prefetch) и в client hooks.
 */

export type LandingParams = Pagination & {
    order: "desc" | "asc";
    query: string;
};
export const defaultLandingParams: LandingParams = {
    page: 1,
    order: "desc",
    query: "",
};

export type TokenParams = Pagination & {
    order: "desc" | "asc";
    query: string;
};
export const defaultTokenParams: TokenParams = {
    page: 1,
    order: "desc",
    query: "",
};

// --- Invitation ---
type InvitationFilters = {
    status: "all" | "active" | "expired" | "revoked";
    order: "desc" | "asc";
    query: string;
};
export type InvitationParams = Pagination & InvitationFilters;
export const defaultInvitationParams: InvitationParams = {
    page: 1,
    status: "all",
    order: "desc",
    query: "",
};

// --- Admins ---
export type AdminParams = Pagination & {
    order: "desc" | "asc";
    sortBy: "createdAt" | "lastLoginAt" | "lastSeenAt";
    status: "all" | "active" | "blocked";
    query: string;
};
export const defaultAdminParams: AdminParams = {
    page: 1,
    order: "desc",
    sortBy: "createdAt",
    status: "all",
    query: "",
};
