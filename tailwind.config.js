/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#7f13ec", // Eco TV Purple
        "primary-hover": "#6b11c9",
        "menu-dark": "#001529", // Ant Design Dark Sidebar
        "menu-dark-submenu": "#000c17",
        "menu-dark-hover": "#1890ff",
        "success": "#52c41a",
        "warning": "#faad14",
        "error": "#f5222d",
        "info": "#1890ff",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      boxShadow: {
        'card': '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
        'floating': '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)'
      }
    },
  },
  plugins: [],
}
