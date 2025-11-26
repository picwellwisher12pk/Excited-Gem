/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: "jit",
    darkMode: "class",
    content: ["./**/*.{ts,tsx}"],
    plugins: [
        require("@tailwindcss/forms")
    ],
}
