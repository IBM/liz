/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

let ui = "http://localhost:6006";
if (process.env.NODE_ENV === "production") {
  ui = "../storybook-ui";
}

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  core: {
    builder: "@storybook/builder-vite",
  },
  async viteFinal(config) {
    return {
      ...config,
      esbuild: {
        ...config.esbuild,
        jsxInject: `import React from 'react'`,
      },
      rollupOptions: {
        ...config.rollupOptions,
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
    };
  },
  refs: {
    ui: {
      title: "UI Components",
      url: ui,
    },
  },
};
