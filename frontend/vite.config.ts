// vite.config.ts
import { defineConfig } from "vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

// __dirname isn't defined in ESM; create it:
const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                professionalWork: resolve(__dirname, "pages/professionalWorkItem.html"),
                personalProject: resolve(__dirname, "pages/personalProjectItem.html"),
            },
        },
    },
});
