import type {
    AdminParams,
    InvitationParams,
    LandingParams,
    TokenParams,
} from "@/lib/tanstack/listDefaults";


export const landingKeys = {
    all: ["landings"] as const,
    lists: () => [...landingKeys.all, "list"] as const,
    list: (params: LandingParams) => [...landingKeys.lists(), params] as const,
};

export const invitationKeys = {
    all: ["admin-invitations"] as const,
    lists: () => [...invitationKeys.all, "list"] as const,
    list: (params: InvitationParams) =>
        [...invitationKeys.lists(), params] as const,
};

export const adminKeys = {
    all: ["admins"] as const,
    lists: () => [...adminKeys.all, "list"] as const,
    list: (params: AdminParams) => [...adminKeys.lists(), params] as const,
};

export const adminSessionKeys = {
    all: (adminId: string) => ["admin-sessions", adminId] as const,
};

export const tokenKeys = {
    all: ["tokens"] as const,
    lists: () => [...tokenKeys.all, "list"] as const,
    list: (params: TokenParams) => [...tokenKeys.lists(), params] as const,
};
