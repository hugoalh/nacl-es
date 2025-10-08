import { Buffer } from "node:buffer";
export function convertBase64StringToUint8Array(value: string): Uint8Array {
	return Uint8Array.from(Buffer.from(value, "base64"));
}
export function convertUint8ArrayToBase64String(value: Uint8Array): string {
	return Buffer.from(value).toString("base64");
}
