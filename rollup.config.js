const fs = require("fs");
const path = require("path");
const typescript = require("@rollup/plugin-typescript");
const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");
const terser = require("@rollup/plugin-terser");
const sveltePreprocess = require("svelte-preprocess");
const svelte = require("rollup-plugin-svelte");
const postcss = require("rollup-plugin-postcss");

const PRODUCTION = "false";

module.exports = fs.readdirSync(path.join(__dirname, "public", "pages")).map((input) => {
    const name = input.split(".")[0];
    return {
        input: "public/pages/" + input,
        output: {
            sourcemap: false,
            format: "iife",
            name: "app",
            file: "dist/svelte/" + name + ".js"
        },
        plugins: [
            svelte({
                dev: !PRODUCTION == "true",
                css: (css) => {
                    css.write(name + ".css");
                },
                preprocess: sveltePreprocess(),
                emitCss: true
            }),
            postcss({
                config: {
                    path: './postcss.config.js',
                },
                extensions: ['.css'],
                minimize: true,
                extract: true,
                inject: {
                    insertAt: 'top',
                },
            }),
            resolve({
                browser: true,
                dedupe: ["svelte"]
            }),
            commonjs(),
            typescript({
                tsconfig: "public/tsconfig.json",
                sourceMap: !PRODUCTION == "true",
                inlineSources: !PRODUCTION == "true"
            }),

            PRODUCTION == "true" && terser(),
        ],
        watch: {
            clearScreen: true
        }
    };
});