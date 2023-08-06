import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        math: "always",
        modifyVars: {
          "primary-color": "#2C261B",
          "link-color": "#F9D796", // link color
          "success-color": "#52c41a", // success state color
          "warning-color": "#faad14", // warning state color
          "error-color": "#f5222d", // error state color
          "font-size-base": "14px", // major text font size
          "heading-color": "rgba(0, 0, 0, 0.85)", // heading text color
          "text-color": "rgba(0, 0, 0, 0.85)", // major text color
          "text-color-secondary": "rgba(0, 0, 0, 0.45)", // secondary text color
          "disabled-color": "rgba(0, 0, 0, 0.25)", // disable state color
          "border-radius-base": "6px", // major border radius
          "border-color-base": "#d9d9d9", // major border color
          "box-shadow-base": "0 2px 8px rgba(0, 0, 0, 0.15)", // major shadow for layers
        },
        javascriptEnabled: true,
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://47.99.36.242",
        // target: "http://merchant.tpay123.com",
        // target: "http://localhost:9569",
        changeOrigin: true,
      },
    },
  },
});
