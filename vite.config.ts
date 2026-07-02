import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./"),
            "@uibakery/data": path.resolve(__dirname, "./src/mocks/uibakery-data.ts"),
        },
    },
})
