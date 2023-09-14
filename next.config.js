// @ts-check

const withPWA = require("@ducanh2912/next-pwa").default({
    dest: "public",
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        // see https://styled-components.com/docs/tooling#babel-plugin for more information
        styledComponents: true,
    },
}

module.exports = withPWA(nextConfig);
