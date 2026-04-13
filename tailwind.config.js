/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#533afd',
        'primary-hover': '#4434d4',
        'primary-deep': '#2e2b8c',
        'primary-light': '#b9b9f9',
        'primary-mid': '#665efd',
        heading: '#061b31',
        label: '#273951',
        body: '#64748d',
        'brand-dark': '#1c1e54',
        'dark-navy': '#0d253d',
        ruby: '#ea2261',
        magenta: '#f96bee',
        'magenta-light': '#ffd7ef',
        'border-default': '#e5edf5',
        'border-purple': '#b9b9f9',
        'border-soft-purple': '#d6d9fc',
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
        stripe: 'rgba(50,50,93,0.25) 0px 30px 45px -30px, rgba(0,0,0,0.1) 0px 18px 36px -18px',
        'stripe-sm': 'rgba(23,23,23,0.08) 0px 15px 35px 0px',
        'stripe-ambient': 'rgba(23,23,23,0.06) 0px 3px 6px',
        'stripe-deep': 'rgba(3,3,39,0.25) 0px 14px 21px -14px, rgba(0,0,0,0.1) 0px 8px 17px -8px',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '5px',
        md: '6px',
        lg: '8px',
      },
    },
  },
  plugins: [],
}
