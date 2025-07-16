import { Buffer } from "node:buffer";
export function fromBase64(value: string): Uint8Array {
	return Uint8Array.from(Buffer.from(value, "base64"));
}
export function toBase64(value: Uint8Array): string {
	return Buffer.from(value).toString("base64");
}
