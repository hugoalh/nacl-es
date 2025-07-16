import { ok } from "node:assert";
import { verify } from "../mod.ts";
Deno.test("1", { permissions: "none" }, () => {
	ok(verify(new Uint8Array(1), new Uint8Array(1)));
});
Deno.test("2", { permissions: "none" }, () => {
	ok(verify(new Uint8Array(1000), new Uint8Array(1000)));
});
Deno.test("3", { permissions: "none" }, () => {
	const a = new Uint8Array(764);
	const b = new Uint8Array(764);
	for (let i = 0; i < a.length; i++) {
		a[i] = b[i] = i & 0xFF;
	}
	ok(verify(a, b));
	ok(verify(a, a));
	b[0] = 255;
	ok(!verify(a, b));
});
Deno.test("4", { permissions: "none" }, () => {
	ok(!verify(new Uint8Array(1), new Uint8Array(10)));
});
Deno.test("5", { permissions: "none" }, () => {
	ok(!verify(new Uint8Array(0), new Uint8Array(0)));
});
