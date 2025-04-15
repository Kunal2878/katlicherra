/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          100: "#EA6365",
          DEFAULT: "#FA7275",
        },

        primary: {
          100: "#0061FF",
          200: "#0061FF1A",
          300: "#0061FF0D",
        },
        accent: {
          100: "#FAF9F6",
        },
        black: {
          DEFAULT: "#20232A",
          100: "#8C8E98",
          200: "#6B7280",
          300: "#33373E",
        },

        success: {
          100: "#F0FFF4",
          200: "#C6F6D5",
          300: "#9AE6B4",
          400: "#68D391",
          500: "#38A169",
          600: "#2F855A",
          700: "#276749",
          800: "#22543D",
          900: "#1C4532",
        },

        primaryBlue: {
          DEFAULT: "#0286FF",
          100: "#F5F8FF",
          200: "#EBF4FF",
          300: "#C3D9FF",
          400: "#9BBFFF",
          600: "#6A85E6",
          700: "#475A99",
          800: "#364573",
          900: "#242B4D",
        },

        lamaSky: "#C3EBFA",
        lamaSkyLight: "#EDF9FD",

        purpleColor: "#8B5DFF",
        lamaPurple: "#CFCEFF",
        lamaPurpleLight: "#F1F0FF",

        lamaYellowLight: "#FEFCE8",
        lamaYellow: "#FAE27C",

        danger: "#F75555",
      },
    },
  },
  plugins: [],
};
