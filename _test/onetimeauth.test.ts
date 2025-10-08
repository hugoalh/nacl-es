import { deepStrictEqual } from "node:assert";
import { convertUint8ArrayToBase64String } from "./utility.ts";
import { crypto_onetimeauth } from "../lowlevel.ts";
function tester(m: Uint8Array, k: Uint8Array, out: Uint8Array): void {
	const result = new Uint8Array(16);
	crypto_onetimeauth(result, 0, m, 0, m.length, k);
	deepStrictEqual(convertUint8ArrayToBase64String(result), convertUint8ArrayToBase64String(out));
}
Deno.test("1", { permissions: "none" }, () => {
	tester(
		new Uint8Array([72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33]),
		new Uint8Array([116, 104, 105, 115, 32, 105, 115, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107, 101, 121, 32, 102, 111, 114, 32, 80, 111, 108, 121, 49, 51, 48, 53]),
		new Uint8Array([166, 247, 69, 0, 143, 129, 201, 22, 162, 13, 204, 116, 238, 242, 178, 240]),
	);
});
Deno.test("2", { permissions: "none" }, () => {
	tester(
		new Uint8Array(32),
		new Uint8Array([116, 104, 105, 115, 32, 105, 115, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107, 101, 121, 32, 102, 111, 114, 32, 80, 111, 108, 121, 49, 51, 48, 53]),
		new Uint8Array([73, 236, 120, 9, 14, 72, 30, 198, 194, 107, 51, 185, 28, 204, 3, 7])
	);
});
Deno.test("3", { permissions: "none" }, () => {
	tester(
		new Uint8Array(2007),
		new Uint8Array([116, 104, 105, 115, 32, 105, 115, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107, 101, 121, 32, 102, 111, 114, 32, 80, 111, 108, 121, 49, 51, 48, 53]),
		new Uint8Array([218, 132, 188, 171, 2, 103, 108, 56, 205, 176, 21, 96, 66, 116, 194, 170])
	);
});
Deno.test("4", { permissions: "none" }, () => {
	tester(
		new Uint8Array(2007),
		new Uint8Array(32),
		new Uint8Array(16)
	);
});
Deno.test("5", { permissions: "none" }, () => {
	tester(
		new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]),
		new Uint8Array([2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
		new Uint8Array([3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
	);
});
