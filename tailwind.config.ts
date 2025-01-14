import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],

    content: ["./src/**/*.{ts,tsx,js,jsx,html}"],
    theme: {
        extend: {
            animation: {
                "wave-pulse": "wave-pulse 4s ease-in-out infinite",
            },
            keyframes: {
                "wave-pulse": {
                    "0%, 100%": { opacity: 0.4 },
                    "50%": { opacity: 0.7 },
                },
            },
        },
    },
    plugins: [],
};

export default config;
