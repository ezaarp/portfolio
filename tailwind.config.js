/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // Colors resolve from CSS variables (channels) so every utility is
            // dual-mode aware automatically. Light brand values are locked in
            // index.css :root; dark variants live under .dark.
            colors: {
                paper: {
                    DEFAULT: 'rgb(var(--paper) / <alpha-value>)',
                    soft: 'rgb(var(--paper-soft) / <alpha-value>)',
                },
                surface: 'rgb(var(--surface) / <alpha-value>)',
                ink: {
                    DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
                    soft: 'rgb(var(--ink-soft) / <alpha-value>)',
                    faint: 'rgb(var(--ink-faint) / <alpha-value>)',
                },
                line: {
                    DEFAULT: 'rgb(var(--line) / <alpha-value>)',
                    strong: 'rgb(var(--line-strong) / <alpha-value>)',
                },
                signal: {           // DEV channel — things he builds
                    DEFAULT: 'rgb(var(--signal) / <alpha-value>)',
                    ink: 'rgb(var(--signal-ink) / <alpha-value>)',
                },
                alert: {            // SEC channel — things he secures (used rarely)
                    DEFAULT: 'rgb(var(--alert) / <alpha-value>)',
                    ink: 'rgb(var(--alert-ink) / <alpha-value>)',
                },
            },
            fontFamily: {
                display: ['Archivo', 'system-ui', 'sans-serif'],
                sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
                mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
            },
            letterSpacing: {
                label: '0.18em',
            },
            maxWidth: {
                frame: '1240px',
            },
            keyframes: {
                'pulse-dot': {
                    '0%, 100%': { opacity: '1', transform: 'scale(1)' },
                    '50%': { opacity: '0.35', transform: 'scale(0.85)' },
                },
                'caret': {
                    '0%, 49%': { opacity: '1' },
                    '50%, 100%': { opacity: '0' },
                },
                'shimmer': {
                    '100%': { transform: 'translateX(100%)' },
                },
            },
            animation: {
                'pulse-dot': 'pulse-dot 1.8s ease-in-out infinite',
                'caret': 'caret 1s step-end infinite',
                'shimmer': 'shimmer 1.6s ease-in-out infinite',
            },
        },
    },
    plugins: [],
}
