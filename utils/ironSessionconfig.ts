import { IRON_SESSION_COOKIE_NAME } from "@lib/constants";

export const ironOptions = {
    cookieName: IRON_SESSION_COOKIE_NAME,
    password: "complex_password_at_least_32_characters_long",
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};