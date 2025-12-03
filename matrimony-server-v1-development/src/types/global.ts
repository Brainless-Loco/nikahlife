export const USER_ROLE = {
    USER:"user",
    ADMIN: "admin",
} as const;

export type TUserRole = keyof typeof USER_ROLE;