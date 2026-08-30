import type {
    AdminParams,
    InvitationParams,
    BankParams,
    TokenParams,
    ContinueTokenParams,
    AlertParams,
} from "@/lib/tanstack/listDefaults";


export const bankKeys = {
    all: ["banks"] as const,
    lists: () => [...bankKeys.all, "list"] as const,
    list: (params: BankParams) => [...bankKeys.lists(), params] as const,
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

export const continueTokenKeys = {
    all: ["continue-token"] as const,
    lists: () => [...continueTokenKeys.all, "list"] as const,
    list: (params: ContinueTokenParams) =>
        [...continueTokenKeys.lists(), params] as const,
};

export const alertKeys = {
    all: ["alert"] as const,
    lists: () => [...alertKeys.all, "list"] as const,
    // История отправок одного доступа (скоуп по continueTokenId + params).
    list: (continueTokenId: string, params: AlertParams) =>
        [...alertKeys.lists(), continueTokenId, params] as const,
};

export const appFileKeys = {
    all: ["app-file"] as const,
};

export const dataKeys = {
    all: ["app-data"] as const,
};

export const formDataKeys = {
    all: ["app-form-data"] as const,
};

export const parcelKeys = {
    all: ["app-parcel"] as const,
};
