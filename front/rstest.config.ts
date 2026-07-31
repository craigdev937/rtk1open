import { defineConfig } from "@rstest/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
    testEnvironment: "jsdom",
    setupFiles: ["./rstest.setup.ts"],
    plugins: [pluginReact()]
});




