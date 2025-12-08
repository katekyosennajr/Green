import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                // Custom Earth Tones
                green: {
                    50: '#f2fcf5',
                    100: '#e1f8e8',
                    200: '#c5eed4',
                    300: '#98deb6',
                    400: '#64c693',
                    500: '#3daa76',
                    600: '#2c895d', // Primary Brand Color
                    700: '#256d4b',
                    800: '#21573e',
                    900: '#1c4835',
                    950: '#0e281d',
                },
                gold: {
                    50: '#fbf9eb',
                    100: '#f5f0c9',
                    200: '#eee396',
                    300: '#e5cf58',
                    400: '#e0bb2e',
                    500: '#d4a219', // Accent Gold
                    600: '#b67f13',
                    700: '#925e13',
                    800: '#794b16',
                    900: '#663f18',
                    950: '#3a210a',
                },
                cream: {
                    50: '#fcfbf9',
                    100: '#f6f3ee', // Light Background
                    200: '#eee8de',
                    300: '#e2d6c6',
                }
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                serif: ['var(--font-playfair)', 'serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.7s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
};
export default config;
