/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                "primary": "#FFD700",
                "secondary": "#B8860B",
                "warning": "#DAA520",
                "danger": "#FFD700",
                "background-dark": "#0A0A0A",
                "surface-dark": "#1A1A1A",
                "surface-highlight": "#2A2A2A",
                "border-dark": "#362F1A",
                "text-light": "#FFD700",
                "text-muted": "#AA8E4A",
                "text-on-gold": "#0A0A0A"
            },
            fontFamily: {
                "display": ["Roboto Condensed", "sans-serif"],
                "sans": ["Inter", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.375rem",
                "md": "0.375rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "2xl": "1rem",
                "3xl": "1.5rem",
                "full": "9999px"
            },
        },
    },
    plugins: [],
}
