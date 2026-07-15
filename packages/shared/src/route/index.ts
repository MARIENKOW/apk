import { buildFullPaths } from "../endpoints";

export const ROUTE = {
  path: "",
  admin: {
    path: "admin",
    bank: {
      path: "bank",
      create: {
        path: "create",
      },
      update: {
        path: "update",
      },
    },
    tokens: {
      path: "tokens",
    },
    data: {
      path: "data",
    },
    settings: {
      path: "settings",
      profile: { path: "profile" },
      password: { path: "password" },
      sessions: { path: "sessions" },
    },
    login: {
      path: "login",
    },
    forgotPasssword: { path: "forgot-password" },
    changePasssword: { path: "change-password" },
    admins: { path: "admins" },
    invitations: { path: "invitations" },
    invitation: { path: "invitation" },
    file: { path: "file" },
  },
  search: {
    path: "search",
  },
  check: {
    path: "check",
  },
  continue: {
    path: "continue",
  },
  ok: {
    path: "ok",
  },
} as const;

export function AllPathsFromRoute(route: object): string[] {
  return Object.entries(route).flatMap(([key, value]) => {
    if (key === "path" && typeof value === "string") return [value];
    if (typeof value === "object" && value !== null)
      return AllPathsFromRoute(value);
    return [];
  });
}

export type Route = typeof ROUTE;

export const FULL_PATH_ROUTE = buildFullPaths<Route>(ROUTE);

export const PRIVATE_ADMIN_PATH: string[] = [FULL_PATH_ROUTE.admin.path];
export const ADMIN_PATH: string[] = [FULL_PATH_ROUTE.admin.path];

export const ADMIN_PRIVATE_FALLBACK_ROUTE: string =
  FULL_PATH_ROUTE.admin.login.path;

export const ADMIN_PUBLIC_FALLBACK_ROUTE: string = FULL_PATH_ROUTE.admin.path;
