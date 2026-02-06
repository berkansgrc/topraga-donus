/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
            colors: {
                background: {
                    base: '#FBF7F0',
                    surface: '#FFFFFF',
                    subtle: '#F3EFE7'
                },
                text: {
                    primary: '#1B1A17',
                    secondary: '#4B463D',
                    muted: '#6B6458',
                    inverse: '#FFFFFF'
                },
                primary: {
                    DEFAULT: '#2F6B3C',
                    600: '#275A33',
                    700: '#1F4728',
                    soft: '#E7F2EA',
                },
                secondary: {
                    DEFAULT: '#7A4E2D',
                    600: '#644026',
                    700: '#4D321D',
                    soft: '#F3E8DF',
                },
                accent: {
                    DEFAULT: '#6B8E23',
                    soft: '#EEF5DF'
                },
                status: {
                    success: '#2F6B3C',
                    warning: '#B7791F',
                    error: '#B42318',
                    info: '#2563EB'
                },
                border: {
                    DEFAULT: 'rgba(27,26,23,0.12)',
                    strong: 'rgba(27,26,23,0.18)'
                }
            },
            borderRadius: {
                'card': '16px',
                'button': '12px',
                'input': '12px',
                'pill': '999px'
            },
            boxShadow: {
                'card': '0 10px 30px rgba(27,26,23,0.05)',
                'hover': '0 14px 36px rgba(27,26,23,0.10)',
                'soft': '0 4px 12px rgba(27,26,23,0.03)'
            },
            backgroundImage: {
                'hero-gradient': 'linear-gradient(135deg, rgba(47,107,60,0.08) 0%, rgba(122,78,45,0.06) 50%, rgba(251,247,240,0.0) 100%)',
            }
        }
    },
    plugins: [],
}
