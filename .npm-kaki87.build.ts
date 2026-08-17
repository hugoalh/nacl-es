import {
	readManifest,
	transform
} from "DNT";
const manifest = await readManifest("jsr.jsonc");
await transform({
	copyEntries: [
		"LICENSE.md",
		"README.md"
	],
	//@ts-ignore Lazy type.
	entrypointsScript: manifest.exports,
	generateDeclarationMap: true,
	metadata: {
		//@ts-ignore Lazy type.
		name: manifest.name,
		//@ts-ignore Lazy type.
		version: manifest.version,
		description: "A module for NaCl/TweetNaCl high-security cryptographic library.",
		keywords: [
			"nacl"
		],
		homepage: "https://git.kaki87.net/hugoalh/nacl-es#readme",
		bugs: {
			url: "https://git.kaki87.net/hugoalh/nacl-es/issues"
		},
		license: "MIT",
		author: "hugoalh",
		repository: {
			type: "git",
			url: "git+https://git.kaki87.net/hugoalh/nacl-es.git"
		},
		private: false,
		publishConfig: {
			access: "public"
		}
	},
	outputDirectory: "dist/npm-kaki87",
	outputDirectoryPreEmpty: true,
	shims: {
		blob: false,
		crypto: false,
		deno: false,
		prompts: false,
		timers: false,
		undici: false,
		weakRef: false,
		webSocket: false
	}
});
