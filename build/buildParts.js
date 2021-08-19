const path = require("path");
const sh = require("shelljs");
const fs = require("fs");

if (process.argv.length < 3) {
	console.error("please enter command as follows: node buildParts.js [buildMode]");
	console.error("ex: node buildParts.js full");
	process.exit(1);
}
const buildMode = process.argv[2];
if (! /^(full|canvas)$/.test(buildMode)) {
	console.error("please specify one of the following string [full, canvas]");
	process.exit(1);
}

function build(inputFileName, outputFileName, inputDir, outputDir, debug, es5Downpile = false) {
	function assertSuccess(shellstring) {
		if (shellstring.code !== 0) {
			console.error(shellstring.stderr);
			process.exit(1);
		}
	}

	const browserify = path.join(__dirname, "..", "node_modules", ".bin", "browserify");
	const uglifyjs = path.join(__dirname, "..", "node_modules", ".bin", "uglifyjs");
	const babel = path.join(__dirname, "..", "node_modules", ".bin", "babel");

	const inputPath = path.resolve(inputDir, inputFileName);
	const outputPath = path.join(outputDir, outputFileName);

	let ss = sh.exec(`${browserify} ${inputPath} ${debug ? "-d" : ""} -s ${path.basename(outputFileName, ".js")}`, { silent: true });
	assertSuccess(ss);

	if (es5Downpile) {
		ss = ss.exec(babel, { silent: true });
		assertSuccess(ss);
	}

	if (debug) {
		ss = ss.to(outputPath);
	} else {
		ss = ss.exec(`${uglifyjs} --comments -o ${outputPath}`);
	}
	assertSuccess(ss);
}

function buildEngineFiles(version, buildMode, inputDir, outputDir, debug) {
	build(
		buildMode === "canvas" ? "engineFiles.canvas.js" : "engineFiles.js",
		buildMode === "canvas" ? `engineFilesV${version}_Canvas.js` : `engineFilesV${version}.js`,
		inputDir,
		outputDir,
		debug
	);
}

function buildPlayLogClient(version, inputDir, outputDir) {
	if (!fs.existsSync(path.join(__dirname, "..", "node_modules", "@akashic", "playlog-client"))) {
		console.log("playlog-client-file does not exist, so skip to build playlog-client.");
		return;
	}
	build(
		"playlogClient.js",
		`playlogClientV${version}.js`,
		inputDir,
		outputDir,
		undefined,
		true
	);
}

console.log("start to build files");
const packageJson = require(path.join(__dirname, "..", "package.json"));
const inputDir = path.join(__dirname, "..", "src");

sh.mkdir("-p", path.join(__dirname, "..", "dist", "raw", "release", buildMode));
sh.mkdir("-p", path.join(__dirname, "..", "dist", "raw", "debug", buildMode));

try {
	console.log("build engine-files");
	buildEngineFiles(
		(packageJson["version"]).replace(/[\.-]/g, "_"),
		buildMode,
		inputDir,
		path.join(__dirname, "..", "dist", "raw", "release", buildMode),
		false
	);
	buildEngineFiles(
		(packageJson["version"]).replace(/[\.-]/g, "_"),
		buildMode,
		inputDir,
		path.join(__dirname, "..", "dist", "raw", "debug", buildMode),
		true
	);

	console.log("build playlog-client");
	buildPlayLogClient(
		(packageJson["optionalDependencies"]["@akashic/playlog-client"]).replace(/[\.-]/g, "_"),
		inputDir,
		path.join(__dirname, "..", "dist", "raw", "release", buildMode)
	);
	buildPlayLogClient(
		(packageJson["optionalDependencies"]["@akashic/playlog-client"]).replace(/[\.-]/g, "_"),
		inputDir,
		path.join(__dirname, "..", "dist", "raw", "debug", buildMode)
	);
} catch (e) {
	process.exit(1);
}

console.log("complete to build files");
