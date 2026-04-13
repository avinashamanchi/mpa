/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#E8748A',
        'primary-hover': '#B5485E',
        'primary-deep': '#8C2D42',
        'primary-light': '#F2B8C4',
        'primary-mid': '#EE6480',
        heading: '#2D1A1E',
        label: '#5C3340',
        body: '#7A5560',
        'brand-dark': '#3D1A24',
        'dark-navy': '#2D0F18',
        ruby: '#E8748A',
        magenta: '#F5A623',
        'magenta-light': '#FFF3D6',
        amber: '#F5A623',
        'amber-light': '#FFF3D6',
        'amber-hover': '#D4881A',
        'border-default': '#F5DDE2',
        'border-purple': '#F2B8C4',
        'border-soft-purple': '#F8CEDA',
        'success-bg': 'rgba(21,190,83,0.2)',
        'success-text': '#108c3d',
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'sans-serif'],
        mono: ['Source Code Pro', 'SFMono-Regular', 'monospace'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
      },
      boxShadow: {
        stripe: 'rgba(232,116,138,0.18) 0px 20px 40px -20px, rgba(245,166,35,0.1) 0px 8px 20px -8px',
        'stripe-sm': 'rgba(232,116,138,0.12) 0px 8px 30px, rgba(245,166,35,0.08) 0px 2px 8px',
        'stripe-ambient': 'rgba(232,116,138,0.08) 0px 3px 6px',
        'stripe-deep': 'rgba(141,45,66,0.2) 0px 14px 21px -14px, rgba(0,0,0,0.08) 0px 8px 17px -8px',
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
