import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import { name, version } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/index.js"),
      name: "ui",
      // the proper extensions will be added
      fileName: "index",
      formats: ["es"],
    },
    outDir: "./lib",
    rollupOptions: {
      // Externalize deps that shouldn't be bundled
      external: ["react", "react-dom"],
      output: {
        // Global vars to use in UMD build for externalized deps
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    define: {
      pkgJson: { name, version },
    },
    plugins: [react()],
  },
});
