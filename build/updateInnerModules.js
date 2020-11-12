const path = require("path");
const semver = require("semver");
const npm = require("npm");
const fs = require("fs");

console.log("start to update akashic-modules");
const packageJsonPath = path.join(__dirname, "..", "package.json");
const packageJson = require(packageJsonPath);
const versionsAfterUpdate = {};
const modules = [
	{
		name: "akashic-engine",
		savingType: "dependencies",
		tag: "next"
	},
	{
		name: "game-driver",
		savingType: "dependencies",
		tag: "next"
	},
	{
		name: "pdi-browser",
		savingType: "devDependencies",
		tag: "next"
	},
	{
		name: "playlog-client",
		savingType: "optionalDependencies"
	},
	{
		name: "pdi-types",
		savingType: "dependencies"
	}
];

const promises = modules.map(function(module){
	return new Promise(function(resolve, reject) {
		npm.load({"save-dev": true, "save-exact": true}, function(err) {
			if (err) {
				reject(err);
				return;
			}
			npm.install(`@akashic/${module.name}@${module.tag || "latest"}`, function(err) {
				if (err) {
					reject(err);
					return;
				}
				npm.info(`@akashic/${module.name}@${module.tag || "latest"}`, "version", function(err, version) {
					if (err) {
						reject(err);
						return;
					}
					versionsAfterUpdate[module.name] = semver.valid(Object.keys(version)[0]);
					resolve();
				});
			});
		});
	}).catch(function(err) {
		console.error(err);
		process.exit(1);
	});
});

Promise.all(promises).then(function() {
	const updatedModules = modules.filter(function(module) {
		const before = packageJson[module.savingType][`@akashic/${module.name}`];
		const after = versionsAfterUpdate[module.name];
		return before !== after;
	});

	// 内部モジュールに更新がない時はエラーコードを返す
	if (updatedModules.length === 0) {
		console.error("there are no modules to be updated");
		process.exit(1);
	}
	updatedModules.forEach(function(module){
		packageJson[module.savingType][`@akashic/${module.name}`] = versionsAfterUpdate[module.name];
		console.log(`update @akashic/${module.name} to ${versionsAfterUpdate[module.name]}`);
	});

	// TODO 正式リリース後は semver.inc(..., "patch");
	packageJson["version"] = semver.inc(semver.valid(packageJson["version"]), "prerelease", "beta");

	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
	console.log(`update version to ${packageJson["version"]}. complete to update akashic-modules`);
}).catch(function(err) {
	console.error(err);
	process.exit(1);
});
