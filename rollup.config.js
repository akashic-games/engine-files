const path = require("path");
const commonjs = require("@rollup/plugin-commonjs");
const nodeResolve = require("@rollup/plugin-node-resolve");
const terser = require("@rollup/plugin-terser");
const { babel } = require("@rollup/plugin-babel");
const { visualizer } = require("rollup-plugin-visualizer");

const pkg = require("./package.json");
const version = pkg.version.replace(/[\.-]/g, "_");
const name = {
	full: `engineFilesV${version}`,
	canvas: `engineFilesV${version}_Canvas`,
};

const plugins = [
	commonjs(),
	nodeResolve(),
	babel({
		babelHelpers: "bundled",
		configFile: path.join(__dirname, ".babel.config.json"),
	}),
];

module.exports = [
	{
		input: "src/engineFiles.js",
		output: [
			{
				file: path.join("dist", "raw", "debug", "full", `${name.full}.js`),
				format: "umd",
				name: name.full,
			},
			{
				file: path.join("dist", "raw", "release", "full", `${name.full}.js`),
				format: "umd",
				name: name.full,
				plugins: [terser()],
			},
		],
		plugins: [
			...plugins,
			visualizer({
				filename: path.join("stats", `stats_${name.full}.html`),
			}),
		],
	},
	{
		input: "src/engineFiles.canvas.js",
		output: [
			{
				file: path.join("dist", "raw", "debug", "canvas", `${name.canvas}.js`),
				format: "umd",
				name: name.canvas,
			},
			{
				file: path.join("dist", "raw", "release", "canvas", `${name.canvas}.js`),
				format: "umd",
				name: name.canvas,
				plugins: [terser()],
			},
		],
		plugins: [
			...plugins,
			visualizer({
				filename: path.join("stats", `stats_${name.canvas}.html`),
			}),
		],
	},
];
