

export const FP_PLAYBOOK_KYB = process.env.NEXT_PUBLIC_FP_PLAYBOOK_KYB;
export const FP_PLAYBOOK_KYC = process.env.NEXT_PUBLIC_FP_PLAYBOOK_KYC_US_ONLY;

export const IRON_SESSION = process.env.IRON_SESSION_PASSWORD || "my-app-secret-password";
export const IRON_SESSION_COOKIE_NAME = process.env.IRON_SESSION_COOKIE_NAME || "my-app-cookie";
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
