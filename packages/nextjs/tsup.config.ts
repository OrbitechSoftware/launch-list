import { defineConfig } from "tsup";

import { config } from "@launch-list/tsup";

export default defineConfig((opts) => ({
  ...config,
  entry: ["./src/index.ts"],
  clean: !opts.watch,
  esbuildOptions: (option) => {
    option.banner = {
      js: `"use client";`,
    };
  },
}));
