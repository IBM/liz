/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";
import vitePluginFaviconsInject from "vite-plugin-favicons-inject";

// https://vitejs.dev/config/
export default defineConfig({
    css: {
        preprocessorOptions: {
            scss: {
                quietDeps: true,
                silenceDeprecations: ["legacy-js-api"],
            },
        },
    },
    plugins: [
        react(),
        splitVendorChunkPlugin(),
        vitePluginFaviconsInject("./src/assets/favicon-32x32.png"),
    ],
});
