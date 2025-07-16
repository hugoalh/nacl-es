/*
NOTE: Ported in 2014 by Dmitry Chestnykh and Devi Mandiri. Public domain. Implementation derived from TweetNaCl version 20140427. See for details: https://tweetnacl.cr.yp.to/
*/
import { randomBytesByTargetSizeFromBegin } from "./_random_bytes.ts";
export interface KeyPair {
	publicKey: Uint8Array;
	secretKey: Uint8Array;
}
class u64 {
	hi: number;
	lo: number;
	constructor(h: number, l: number) {
		this.hi = h | 0 >>> 0;
		this.lo = l | 0 >>> 0;
	}
}
export function gf(init?: Float64Array): Float64Array {
	const r: Float64Array = new Float64Array(16);
	if (typeof init !== "undefined") {
		for (let i: number = 0; i < init.length; i++) {
			r[i] = init[i];
		}
	}
	return r;
}
const _0: Uint8Array = new Uint8Array(16);
const _9: Uint8Array = new Uint8Array(32);
_9[0] = 9;
const gf0: Float64Array = gf();
const gf1: Float64Array = gf(Float64Array.from([1]));
const _121665: Float64Array = gf(Float64Array.from([0xDB41, 1]));
export const D: Float64Array = gf(Float64Array.from([0x78A3, 0x1359, 0x4DCA, 0x75EB, 0xD8AB, 0x4141, 0x0A4D, 0x0070, 0xE898, 0x7779, 0x4079, 0x8CC7, 0xFE73, 0x2B6F, 0x6CEE, 0x5203]));
const D2: Float64Array = gf(Float64Array.from([0xF159, 0x26B2, 0x9B94, 0xEBD6, 0xB156, 0x8283, 0x149A, 0x00E0, 0xD130, 0xEEF3, 0x80F2, 0x198E, 0xFCE7, 0x56DF, 0xD9DC, 0x2406]));
const I: Float64Array = gf(Float64Array.from([0xA0B0, 0x4A0E, 0x1B27, 0xC4EE, 0xE478, 0xAD2F, 0x1806, 0x2F43, 0xD7A7, 0x3DFB, 0x0099, 0x2B4D, 0xDF0B, 0x4FC1, 0x2480, 0x2B83]));
const X: Float64Array = gf(Float64Array.from([0xD51A, 0x8F25, 0x2D60, 0xC956, 0xA7B2, 0x9525, 0xC760, 0x692C, 0xDC5C, 0xFDD6, 0xE231, 0xC0A4, 0x53FE, 0xCD6E, 0x36D3, 0x2169]));
const Y: Float64Array = gf(Float64Array.from([0x6658, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666]));
function L32(x: number, c: number): number {
	return ((x << c) | (x >>> (32 - c)));
}
function ld32(x: Uint8Array, i: number): number {
	let u: number = x[i + 3] & 0xFF;
	u = (u << 8) | (x[i + 2] & 0xFF);
	u = (u << 8) | (x[i + 1] & 0xFF);
	return ((u << 8) | (x[i + 0] & 0xFF));
}
function dl64(x: Uint8Array, i: number): u64 {
	return new u64((x[i] << 24) | (x[i + 1] << 16) | (x[i + 2] << 8) | x[i + 3], (x[i + 4] << 24) | (x[i + 5] << 16) | (x[i + 6] << 8) | x[i + 7]);
}
function st32(x: Uint8Array, j: number, u: number): void {
	for (let i: number = 0; i < 4; i++) {
		x[j + i] = u & 255;
		u >>>= 8;
	}
}
function ts64(x: Uint8Array, i: number, u: u64): void {
	x[i] = (u.hi >> 24) & 0xFF;
	x[i + 1] = (u.hi >> 16) & 0xFF;
	x[i + 2] = (u.hi >> 8) & 0xFF;
	x[i + 3] = u.hi & 0xFF;
	x[i + 4] = (u.lo >> 24) & 0xFF;
	x[i + 5] = (u.lo >> 16) & 0xFF;
	x[i + 6] = (u.lo >> 8) & 0xFF;
	x[i + 7] = u.lo & 0xFF;
}
export function _vn(x: Uint8Array, xi: number, y: Uint8Array, yi: number, n: number): number {
	let d: number = 0;
	for (let i: number = 0; i < n; i++) {
		d |= x[xi + i] ^ y[yi + i];
	};
	return ((1 & ((d - 1) >>> 8)) - 1);
}
export function crypto_verify_16(x: Uint8Array, xi: number, y: Uint8Array, yi: number): number {
	return _vn(x, xi, y, yi, 16);
}
export function crypto_verify_32(x: Uint8Array, xi: number, y: Uint8Array, yi: number): number {
	return _vn(x, xi, y, yi, 32);
}
function core(out: Uint8Array, inp: Uint8Array, k: Uint8Array, c: Uint8Array, h: boolean): void {
	const t: Uint32Array = new Uint32Array(4);
	const w: Uint32Array = new Uint32Array(16);
	const x: Uint32Array = new Uint32Array(16);
	const y: Uint32Array = new Uint32Array(16);
	for (let i: number = 0; i < 4; i++) {
		x[5 * i] = ld32(c, 4 * i);
		x[1 + i] = ld32(k, 4 * i);
		x[6 + i] = ld32(inp, 4 * i);
		x[11 + i] = ld32(k, 16 + 4 * i);
	}
	for (let i: number = 0; i < 16; i++) {
		y[i] = x[i];
	}
	for (let i: number = 0; i < 20; i++) {
		for (let j: number = 0; j < 4; j++) {
			for (let m: number = 0; m < 4; m++) {
				t[m] = x[(5 * j + 4 * m) % 16];
			}
			t[1] ^= L32((t[0] + t[3]) | 0, 7);
			t[2] ^= L32((t[1] + t[0]) | 0, 9);
			t[3] ^= L32((t[2] + t[1]) | 0, 13);
			t[0] ^= L32((t[3] + t[2]) | 0, 18);
			for (let m: number = 0; m < 4; m++) {
				w[4 * j + (j + m) % 4] = t[m];
			}
		}
		for (let m: number = 0; m < 16; m++) {
			x[m] = w[m];
		}
	}
	if (h) {
		for (let i: number = 0; i < 16; i++) {
			x[i] = (x[i] + y[i]) | 0;
		}
		for (let i: number = 0; i < 4; i++) {
			x[5 * i] = (x[5 * i] - ld32(c, 4 * i)) | 0;
			x[6 + i] = (x[6 + i] - ld32(inp, 4 * i)) | 0;
		}
		for (let i: number = 0; i < 4; i++) {
			st32(out, 4 * i, x[5 * i]);
			st32(out, 16 + 4 * i, x[6 + i]);
		}
	} else {
		for (let i: number = 0; i < 16; i++) {
			st32(out, 4 * i, (x[i] + y[i]) | 0);
		}
	}
}
function crypto_core_salsa20(out: Uint8Array, inp: Uint8Array, k: Uint8Array, c: Uint8Array): 0 {
	core(out, inp, k, c, false);
	return 0;
}
export function crypto_core_hsalsa20(out: Uint8Array, inp: Uint8Array, k: Uint8Array, c: Uint8Array): 0 {
	core(out, inp, k, c, true);
	return 0;
}

const sigma: Uint8Array = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
// "expand 32-byte k"

export function crypto_stream_salsa20_xor(c: Uint8Array, cpos: number, m: Uint8Array | null, mpos: number, b: number, n: Uint8Array, k: Uint8Array): 0 {
	const x: Uint8Array = new Uint8Array(64);
	const z: Uint8Array = new Uint8Array(16);
	if (!b) {
		return 0;
	}
	for (let i: number = 0; i < 16; i++) {
		z[i] = 0;
	}
	for (let i: number = 0; i < 8; i++) {
		z[i] = n[i];
	}
	while (b >= 64) {
		crypto_core_salsa20(x, z, k, sigma);
		for (let i: number = 0; i < 64; i++) {
			c[cpos + i] = (m ? m[mpos + i] : 0) ^ x[i];
		}
		let u: number = 1;
		for (let i: number = 8; i < 16; i++) {
			u = u + (z[i] & 0xFF) | 0;
			z[i] = u & 0xFF;
			u >>>= 8;
		}
		b -= 64;
		cpos += 64;
		if (m) {
			mpos += 64;
		}
	}
	if (b > 0) {
		crypto_core_salsa20(x, z, k, sigma);
		for (let i: number = 0; i < b; i++) {
			c[cpos + i] = (m ? m[mpos + i] : 0) ^ x[i];
		}
	}
	return 0;
}
export function crypto_stream_salsa20(c: Uint8Array, cpos: number, d: number, n: Uint8Array, k: Uint8Array): 0 {
	return crypto_stream_salsa20_xor(c, cpos, null, 0, d, n, k);
}
export function crypto_stream(c: Uint8Array, cpos: number, d: number, n: Uint8Array, k: Uint8Array): 0 {
	const s: Uint8Array = new Uint8Array(32);
	crypto_core_hsalsa20(s, n, k, sigma);
	return crypto_stream_salsa20(c, cpos, d, n.subarray(16), s);
}
export function crypto_stream_xor(c: Uint8Array, cpos: number, m: Uint8Array, mpos: number, d: number, n: Uint8Array, k: Uint8Array): 0 {
	const s: Uint8Array = new Uint8Array(32);
	crypto_core_hsalsa20(s, n, k, sigma);
	return crypto_stream_salsa20_xor(c, cpos, m, mpos, d, n.subarray(16), s);
}
function add1305(h: Uint32Array, c: Uint32Array): void {
	let u: number = 0;
	for (let j: number = 0; j < 17; j++) {
		u = (u + ((h[j] + c[j]) | 0)) | 0;
		h[j] = u & 255;
		u >>>= 8;
	}
}
const minusp: Uint32Array = new Uint32Array([5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 252]);
export function crypto_onetimeauth(out: Uint8Array, outpos: number, m: Uint8Array, mpos: number, n: number, k: Uint8Array): 0 {
	const c = new Uint32Array(17);
	const g = new Uint32Array(17);
	const h = new Uint32Array(17);
	const r = new Uint32Array(17);
	const x = new Uint32Array(17);
	let j: number;
	for (j = 0; j < 17; j++) {
		r[j] = h[j] = 0;
	}
	for (j = 0; j < 16; j++) {
		r[j] = k[j];
	}
	r[3] &= 15;
	r[4] &= 252;
	r[7] &= 15;
	r[8] &= 252;
	r[11] &= 15;
	r[12] &= 252;
	r[15] &= 15;
	while (n > 0) {
		for (j = 0; j < 17; j++) {
			c[j] = 0;
		}
		for (j = 0; (j < 16) && (j < n); ++j) {
			c[j] = m[mpos + j];
		}
		c[j] = 1;
		mpos += j;
		n -= j;
		add1305(h, c);
		for (let i: number = 0; i < 17; i++) {
			x[i] = 0;
			for (j = 0; j < 17; j++) {
				x[i] = (x[i] + (h[j] * ((j <= i) ? r[i - j] : ((320 * r[i + 17 - j]) | 0))) | 0) | 0;
			}
		}
		for (let i: number = 0; i < 17; i++) {
			h[i] = x[i];
		}
		let u: number = 0;
		for (j = 0; j < 16; j++) {
			u = (u + h[j]) | 0;
			h[j] = u & 255;
			u >>>= 8;
		}
		u = (u + h[16]) | 0;
		h[16] = u & 3;
		u = (5 * (u >>> 2)) | 0;
		for (j = 0; j < 16; j++) {
			u = (u + h[j]) | 0;
			h[j] = u & 255;
			u >>>= 8;
		}
		u = (u + h[16]) | 0;
		h[16] = u;
	}
	for (j = 0; j < 17; j++) {
		g[j] = h[j];
	}
	add1305(h, minusp);
	const s: number = (-(h[16] >>> 7) | 0);
	for (j = 0; j < 17; j++) {
		h[j] ^= s & (g[j] ^ h[j]);
	}
	for (j = 0; j < 16; j++) {
		c[j] = k[j + 16];
	}
	c[16] = 0;
	add1305(h, c);
	for (j = 0; j < 16; j++) {
		out[outpos + j] = h[j];
	}
	return 0;
}
export function crypto_onetimeauth_verify(h: Uint8Array, hpos: number, m: Uint8Array, mpos: number, n: number, k: Uint8Array): number {
	const x: Uint8Array = new Uint8Array(16);
	crypto_onetimeauth(x, 0, m, mpos, n, k);
	return crypto_verify_16(h, hpos, x, 0);
}
export function crypto_secretbox(c: Uint8Array, m: Uint8Array, d: number, n: Uint8Array, k: Uint8Array): -1 | 0 {
	if (d < 32) {
		return -1;
	}
	crypto_stream_xor(c, 0, m, 0, d, n, k);
	crypto_onetimeauth(c, 16, c, 32, d - 32, c);
	for (let i: number = 0; i < 16; i++) {
		c[i] = 0;
	}
	return 0;
}
export function crypto_secretbox_open(m: Uint8Array, c: Uint8Array, d: number, n: Uint8Array, k: Uint8Array): -1 | 0 {
	const x: Uint8Array = new Uint8Array(32);
	if (d < 32) {
		return -1;
	}
	crypto_stream(x, 0, 32, n, k);
	if (crypto_onetimeauth_verify(c, 16, c, 32, d - 32, x) !== 0) {
		return -1;
	}
	crypto_stream_xor(m, 0, c, 0, d, n, k);
	for (let i: number = 0; i < 32; i++) {
		m[i] = 0;
	}
	return 0;
}
export function set25519(r: Float64Array, a: Float64Array): void {
	for (let i: number = 0; i < 16; i++) {
		r[i] = a[i] | 0;
	}
}
function car25519(o: Float64Array): void {
	for (let i: number = 0; i < 16; i++) {
		o[i] += 65536;
		const c: number = Math.floor(o[i] / 65536);
		o[(i + 1) * (i < 15 ? 1 : 0)] += c - 1 + 37 * (c - 1) * (i === 15 ? 1 : 0);
		o[i] -= (c * 65536);
	}
}
function sel25519(p: Float64Array, q: Float64Array, b: number): void {
	const c: number = ~(b - 1);
	for (let i: number = 0; i < 16; i++) {
		const t: number = c & (p[i] ^ q[i]);
		p[i] ^= t;
		q[i] ^= t;
	}
}
export function pack25519(o: Uint8Array, n: Float64Array): void {
	const m: Float64Array = gf();
	const t: Float64Array = gf();
	for (let i: number = 0; i < 16; i++) {
		t[i] = n[i];
	}
	car25519(t);
	car25519(t);
	car25519(t);
	for (let j: number = 0; j < 2; j++) {
		m[0] = t[0] - 0xFFED;
		for (let i: number = 1; i < 15; i++) {
			m[i] = t[i] - 0xFFFF - ((m[i - 1] >> 16) & 1);
			m[i - 1] &= 0xFFFF;
		}
		m[15] = t[15] - 0x7FFF - ((m[14] >> 16) & 1);
		const b: number = (m[15] >> 16) & 1;
		m[14] &= 0xFFFF;
		sel25519(t, m, 1 - b);
	}
	for (let i: number = 0; i < 16; i++) {
		o[2 * i] = t[i] & 0xFF;
		o[2 * i + 1] = t[i] >> 8;
	}
}
function neq25519(a: Float64Array, b: Float64Array): number {
	const c: Uint8Array = new Uint8Array(32);
	const d: Uint8Array = new Uint8Array(32);
	pack25519(c, a);
	pack25519(d, b);
	return crypto_verify_32(c, 0, d, 0);
}
function par25519(a: Float64Array): number {
	const d: Uint8Array = new Uint8Array(32);
	pack25519(d, a);
	return (d[0] & 1);
}
export function unpack25519(o: Float64Array, n: Uint8Array): void {
	for (let i: number = 0; i < 16; i++) {
		o[i] = n[2 * i] + (n[2 * i + 1] << 8);
	}
	o[15] &= 0x7FFF;
}
export function A(o: Float64Array, a: Float64Array, b: Float64Array): void {
	for (let i: number = 0; i < 16; i++) {
		o[i] = (a[i] + b[i]) | 0;
	}
}
export function Z(o: Float64Array, a: Float64Array, b: Float64Array): void {
	for (let i: number = 0; i < 16; i++) {
		o[i] = (a[i] - b[i]) | 0;
	}
}
export function M(o: Float64Array, a: Float64Array, b: Float64Array): void {
	const t: Float64Array = new Float64Array(31);
	for (let i: number = 0; i < 31; i++) {
		t[i] = 0;
	}
	for (let i: number = 0; i < 16; i++) {
		for (let j: number = 0; j < 16; j++) {
			t[i + j] += a[i] * b[j];
		}
	}
	for (let i: number = 0; i < 15; i++) {
		t[i] += 38 * t[i + 16];
	}
	for (let i: number = 0; i < 16; i++) {
		o[i] = t[i];
	}
	car25519(o);
	car25519(o);
}
export function S(o: Float64Array, a: Float64Array): void {
	M(o, a, a);
}
function inv25519(o: Float64Array, i: Float64Array): void {
	const c: Float64Array = gf();
	for (let a: number = 0; a < 16; a++) {
		c[a] = i[a];
	}
	for (let a: number = 253; a >= 0; a--) {
		S(c, c);
		if (a !== 2 && a !== 4) {
			M(c, c, i);
		}
	}
	for (let a: number = 0; a < 16; a++) {
		o[a] = c[a];
	}
}
export function pow2523(o: Float64Array, i: Float64Array): void {
	const c: Float64Array = gf();
	for (let a: number = 0; a < 16; a++) {
		c[a] = i[a];
	}
	for (let a: number = 250; a >= 0; a--) {
		S(c, c);
		if (a !== 1) {
			M(c, c, i);
		}
	}
	for (let a: number = 0; a < 16; a++) {
		o[a] = c[a];
	}
}
export function crypto_scalarmult(q: Uint8Array, n: Uint8Array, p: Uint8Array): number {
	const a: Float64Array = gf();
	const b: Float64Array = gf();
	const c: Float64Array = gf();
	const d: Float64Array = gf();
	const e: Float64Array = gf();
	const f: Float64Array = gf();
	const x: Float64Array = new Float64Array(80);
	const z: Uint8Array = new Uint8Array(32);
	for (let i: number = 0; i < 31; i++) {
		z[i] = n[i];
	}
	z[31] = (n[31] & 127) | 64;
	z[0] &= 248;
	unpack25519(x, p);
	for (let i: number = 0; i < 16; i++) {
		b[i] = x[i];
		d[i] = a[i] = c[i] = 0;
	}
	a[0] = d[0] = 1;
	for (let i: number = 254; i >= 0; --i) {
		const r: number = (z[i >>> 3] >>> (i & 7)) & 1;
		sel25519(a, b, r);
		sel25519(c, d, r);
		A(e, a, c);
		Z(a, a, c);
		A(c, b, d);
		Z(b, b, d);
		S(d, e);
		S(f, a);
		M(a, c, a);
		M(c, b, e);
		A(e, a, c);
		Z(a, a, c);
		S(b, a);
		Z(c, d, f);
		M(a, c, _121665);
		A(a, a, d);
		M(c, c, a);
		M(a, d, f);
		M(d, b, x);
		S(b, e);
		sel25519(a, b, r);
		sel25519(c, d, r);
	}
	for (let i: number = 0; i < 16; i++) {
		x[i + 16] = a[i];
		x[i + 32] = c[i];
		x[i + 48] = b[i];
		x[i + 64] = d[i];
	}
	const x32: Float64Array = x.subarray(32);
	const x16: Float64Array = x.subarray(16);
	inv25519(x32, x32);
	M(x16, x16, x32);
	pack25519(q, x16);
	return 0;
}
export function crypto_scalarmult_base(q: Uint8Array, n: Uint8Array): number {
	return crypto_scalarmult(q, n, _9);
}
export function crypto_box_keypair(y: Uint8Array, x: Uint8Array): number {
	randomBytesByTargetSizeFromBegin(x, 32);
	return crypto_scalarmult_base(y, x);
}
export function crypto_box_beforenm(k: Uint8Array, y: Uint8Array, x: Uint8Array): 0 {
	const s: Uint8Array = new Uint8Array(32);
	crypto_scalarmult(s, x, y);
	return crypto_core_hsalsa20(k, _0, s, sigma);
}
export const crypto_box_afternm = crypto_secretbox;
const crypto_box_open_afternm = crypto_secretbox_open;
export function crypto_box(c: Uint8Array, m: Uint8Array, d: number, n: Uint8Array, y: Uint8Array, x: Uint8Array): -1 | 0 {
	const k: Uint8Array = new Uint8Array(32);
	crypto_box_beforenm(k, y, x);
	return crypto_box_afternm(c, m, d, n, k);
}
export function crypto_box_open(m: Uint8Array, c: Uint8Array, d: number, n: Uint8Array, y: Uint8Array, x: Uint8Array): -1 | 0 {
	const k: Uint8Array = new Uint8Array(32);
	crypto_box_beforenm(k, y, x);
	return crypto_box_open_afternm(m, c, d, n, k);
}
function add64(...inputs: readonly u64[]): u64 {
	const m16: number = 65535;
	let a: number = 0;
	let b: number = 0;
	let c: number = 0;
	let d: number = 0;
	for (const input of inputs) {
		a += (input.lo & m16);
		b += (input.lo >>> 16);
		c += (input.hi & m16);
		d += (input.hi >>> 16);
	}
	b += (a >>> 16);
	c += (b >>> 16);
	d += (c >>> 16);
	return new u64((c & m16) | (d << 16), (a & m16) | (b << 16));
}
function shr64(x: u64, c: number): u64 {
	return new u64(x.hi >>> c, (x.lo >>> c) | (x.hi << (32 - c)));
}
function xor64(...inputs: readonly u64[]): u64 {
	let h: number = 0;
	let l: number = 0;
	for (const input of inputs) {
		h ^= input.hi;
		l ^= input.lo;
	}
	return new u64(h, l);
}
function R(x: u64, c: number): u64 {
	let h: number = 0;
	let l: number = 0;
	const c1: number = 32 - c;
	if (c < 32) {
		h = (x.hi >>> c) | (x.lo << c1);
		l = (x.lo >>> c) | (x.hi << c1);
	} else if (c < 64) {
		h = (x.lo >>> c) | (x.hi << c1);
		l = (x.hi >>> c) | (x.lo << c1);
	}
	return new u64(h, l);
}
function Ch(x: u64, y: u64, z: u64): u64 {
	return new u64((x.hi & y.hi) ^ (~x.hi & z.hi), (x.lo & y.lo) ^ (~x.lo & z.lo));
}
function Maj(x: u64, y: u64, z: u64): u64 {
	return new u64((x.hi & y.hi) ^ (x.hi & z.hi) ^ (y.hi & z.hi), (x.lo & y.lo) ^ (x.lo & z.lo) ^ (y.lo & z.lo));
}
function Sigma0(x: u64): u64 {
	return xor64(R(x, 28), R(x, 34), R(x, 39));
}
function Sigma1(x: u64): u64 {
	return xor64(R(x, 14), R(x, 18), R(x, 41));
}
function sigma0(x: u64): u64 {
	return xor64(R(x, 1), R(x, 8), shr64(x, 7));
}
function sigma1(x: u64): u64 {
	return xor64(R(x, 19), R(x, 61), shr64(x, 6));
}
const K: u64[] = [
	new u64(0x428A2F98, 0xD728AE22),
	new u64(0x71374491, 0x23EF65CD),
	new u64(0xB5C0FBCF, 0xEC4D3B2F),
	new u64(0xE9B5DBA5, 0x8189DBBC),
	new u64(0x3956C25B, 0xF348B538),
	new u64(0x59F111F1, 0xB605D019),
	new u64(0x923F82A4, 0xAF194F9B),
	new u64(0xAB1C5ED5, 0xDA6D8118),
	new u64(0xD807AA98, 0xA3030242),
	new u64(0x12835B01, 0x45706FBE),
	new u64(0x243185BE, 0x4EE4B28C),
	new u64(0x550C7DC3, 0xD5FFB4E2),
	new u64(0x72BE5D74, 0xF27B896F),
	new u64(0x80DEB1FE, 0x3B1696B1),
	new u64(0x9BDC06A7, 0x25C71235),
	new u64(0xC19BF174, 0xCF692694),
	new u64(0xE49B69C1, 0x9EF14AD2),
	new u64(0xEFBE4786, 0x384F25E3),
	new u64(0x0FC19DC6, 0x8B8CD5B5),
	new u64(0x240CA1CC, 0x77AC9C65),
	new u64(0x2DE92C6F, 0x592B0275),
	new u64(0x4A7484AA, 0x6EA6E483),
	new u64(0x5CB0A9DC, 0xBD41FBD4),
	new u64(0x76F988DA, 0x831153B5),
	new u64(0x983E5152, 0xEE66DFAB),
	new u64(0xA831C66D, 0x2DB43210),
	new u64(0xB00327C8, 0x98FB213F),
	new u64(0xBF597FC7, 0xBEEF0EE4),
	new u64(0xC6E00BF3, 0x3DA88FC2),
	new u64(0xD5A79147, 0x930AA725),
	new u64(0x06CA6351, 0xE003826F),
	new u64(0x14292967, 0x0A0E6E70),
	new u64(0x27B70A85, 0x46D22FFC),
	new u64(0x2E1B2138, 0x5C26C926),
	new u64(0x4D2C6DFC, 0x5AC42AED),
	new u64(0x53380D13, 0x9D95B3DF),
	new u64(0x650A7354, 0x8BAF63DE),
	new u64(0x766A0ABB, 0x3C77B2A8),
	new u64(0x81C2C92E, 0x47EDAEE6),
	new u64(0x92722C85, 0x1482353B),
	new u64(0xA2BFE8A1, 0x4CF10364),
	new u64(0xA81A664B, 0xBC423001),
	new u64(0xC24B8B70, 0xD0F89791),
	new u64(0xC76C51A3, 0x0654BE30),
	new u64(0xD192E819, 0xD6EF5218),
	new u64(0xD6990624, 0x5565A910),
	new u64(0xF40E3585, 0x5771202A),
	new u64(0x106AA070, 0x32BBD1B8),
	new u64(0x19A4C116, 0xB8D2D0C8),
	new u64(0x1E376C08, 0x5141AB53),
	new u64(0x2748774C, 0xDF8EEB99),
	new u64(0x34B0BCB5, 0xE19B48A8),
	new u64(0x391C0CB3, 0xC5C95A63),
	new u64(0x4ED8AA4A, 0xE3418ACB),
	new u64(0x5B9CCA4F, 0x7763E373),
	new u64(0x682E6FF3, 0xD6B2B8A3),
	new u64(0x748F82EE, 0x5DEFB2FC),
	new u64(0x78A5636F, 0x43172F60),
	new u64(0x84C87814, 0xA1F0AB72),
	new u64(0x8CC70208, 0x1A6439EC),
	new u64(0x90BEFFFA, 0x23631E28),
	new u64(0xA4506CEB, 0xDE82BDE9),
	new u64(0xBEF9A3F7, 0xB2C67915),
	new u64(0xC67178F2, 0xE372532B),
	new u64(0xCA273ECE, 0xEA26619C),
	new u64(0xD186B8C7, 0x21C0C207),
	new u64(0xEADA7DD6, 0xCDE0EB1E),
	new u64(0xF57D4F7F, 0xEE6ED178),
	new u64(0x06F067AA, 0x72176FBA),
	new u64(0x0A637DC5, 0xA2C898A6),
	new u64(0x113F9804, 0xBEF90DAE),
	new u64(0x1B710B35, 0x131C471B),
	new u64(0x28DB77F5, 0x23047D84),
	new u64(0x32CAAB7B, 0x40C72493),
	new u64(0x3C9EBE0A, 0x15C9BEBC),
	new u64(0x431D67C4, 0x9C100D4C),
	new u64(0x4CC5D4BE, 0xCB3E42B6),
	new u64(0x597F299C, 0xFC657E2A),
	new u64(0x5FCB6FAB, 0x3AD6FAEC),
	new u64(0x6C44198C, 0x4A475817)
];
function crypto_hashblocks(x: Uint8Array, m: Uint8Array, n: number): number {
	const a: u64[] = [];
	const b: u64[] = [];
	const w: u64[] = [];
	const z: u64[] = [];
	for (let i: number = 0; i < 8; i++) {
		z[i] = a[i] = dl64(x, 8 * i);
	}
	let pos: number = 0;
	while (n >= 128) {
		for (let i: number = 0; i < 16; i++) {
			w[i] = dl64(m, 8 * i + pos);
		}
		for (let i: number = 0; i < 80; i++) {
			for (let j: number = 0; j < 8; j++) {
				b[j] = a[j];
			}
			const t: u64 = add64(a[7], Sigma1(a[4]), Ch(a[4], a[5], a[6]), K[i], w[i % 16]);
			b[7] = add64(t, Sigma0(a[0]), Maj(a[0], a[1], a[2]));
			b[3] = add64(b[3], t);
			for (let j: number = 0; j < 8; j++) {
				a[(j + 1) % 8] = b[j];
			}
			if (i % 16 === 15) {
				for (let j: number = 0; j < 16; j++) {
					w[j] = add64(w[j], w[(j + 9) % 16], sigma0(w[(j + 1) % 16]), sigma1(w[(j + 14) % 16]));
				}
			}
		}
		for (let i: number = 0; i < 8; i++) {
			a[i] = add64(a[i], z[i]);
			z[i] = a[i];
		}
		pos += 128;
		n -= 128;
	}
	for (let i: number = 0; i < 8; i++) {
		ts64(x, 8 * i, z[i]);
	}
	return n;
}
const iv: Uint8Array = new Uint8Array([
	0x6A, 0x09, 0xE6, 0x67, 0xF3, 0xBC, 0xC9, 0x08,
	0xBB, 0x67, 0xAE, 0x85, 0x84, 0xCA, 0xA7, 0x3B,
	0x3C, 0x6E, 0xF3, 0x72, 0xFE, 0x94, 0xF8, 0x2B,
	0xA5, 0x4F, 0xF5, 0x3A, 0x5F, 0x1D, 0x36, 0xF1,
	0x51, 0x0E, 0x52, 0x7F, 0xAD, 0xE6, 0x82, 0xD1,
	0x9B, 0x05, 0x68, 0x8C, 0x2B, 0x3E, 0x6C, 0x1F,
	0x1F, 0x83, 0xD9, 0xAB, 0xFB, 0x41, 0xBD, 0x6B,
	0x5B, 0xE0, 0xCD, 0x19, 0x13, 0x7E, 0x21, 0x79
]);
export function crypto_hash(out: Uint8Array, m: Uint8Array, n: number): 0 {
	const b: number = n;
	const h: Uint8Array = new Uint8Array(64);
	const x: Uint8Array = new Uint8Array(256);
	for (let i: number = 0; i < 64; i++) {
		h[i] = iv[i];
	}
	crypto_hashblocks(h, m, n);
	n %= 128;
	for (let i: number = 0; i < 256; i++) {
		x[i] = 0;
	}
	for (let i: number = 0; i < n; i++) {
		x[i] = m[b - n + i];
	}
	x[n] = 128;
	n = 256 - 128 * (n < 112 ? 1 : 0);
	x[n - 9] = 0;
	ts64(x, n - 8, new u64((b / 0x20000000) | 0, b << 3));
	crypto_hashblocks(h, x, n);
	for (let i: number = 0; i < 64; i++) {
		out[i] = h[i];
	}
	return 0;
}
export function add(p: Float64Array[], q: Float64Array[]): void {
	const a: Float64Array = gf();
	const b: Float64Array = gf();
	const c: Float64Array = gf();
	const d: Float64Array = gf();
	const e: Float64Array = gf();
	const f: Float64Array = gf();
	const g: Float64Array = gf();
	const h: Float64Array = gf();
	const t: Float64Array = gf();
	Z(a, p[1], p[0]);
	Z(t, q[1], q[0]);
	M(a, a, t);
	A(b, p[0], p[1]);
	A(t, q[0], q[1]);
	M(b, b, t);
	M(c, p[3], q[3]);
	M(c, c, D2);
	M(d, p[2], q[2]);
	A(d, d, d);
	Z(e, b, a);
	Z(f, d, c);
	A(g, d, c);
	A(h, b, a);
	M(p[0], e, f);
	M(p[1], h, g);
	M(p[2], g, f);
	M(p[3], e, h);
}
function cswap(p: Float64Array[], q: Float64Array[], b: number): void {
	for (let i: number = 0; i < 4; i++) {
		sel25519(p[i], q[i], b);
	}
}
function pack(r: Uint8Array, p: Float64Array[]): void {
	const tx: Float64Array = gf();
	const ty: Float64Array = gf();
	const zi: Float64Array = gf();
	inv25519(zi, p[2]);
	M(tx, p[0], zi);
	M(ty, p[1], zi);
	pack25519(r, ty);
	r[31] ^= par25519(tx) << 7;
}
export function scalarmult(p: Float64Array[], q: Float64Array[], s: Uint8Array): void {
	set25519(p[0], gf0);
	set25519(p[1], gf1);
	set25519(p[2], gf1);
	set25519(p[3], gf0);
	for (let i: number = 255; i >= 0; --i) {
		const b: number = (s[(i / 8) | 0] >> (i & 7)) & 1;
		cswap(p, q, b);
		add(q, p);
		add(p, p);
		cswap(p, q, b);
	}
}
export function scalarbase(p: Float64Array[], s: Uint8Array): void {
	const q: Float64Array[] = [gf(), gf(), gf(), gf()];
	set25519(q[0], X);
	set25519(q[1], Y);
	set25519(q[2], gf1);
	M(q[3], X, Y);
	scalarmult(p, q, s);
}
export function crypto_sign_keypair(pk: Uint8Array, sk: Uint8Array, seeded: boolean = false): 0 {
	const d: Uint8Array = new Uint8Array(64);
	const p: Float64Array[] = [gf(), gf(), gf(), gf()];
	if (!seeded) {
		randomBytesByTargetSizeFromBegin(sk, 32);
	}
	crypto_hash(d, sk, 32);
	d[0] &= 248;
	d[31] &= 127;
	d[31] |= 64;
	scalarbase(p, d);
	pack(pk, p);
	for (let i: number = 0; i < 32; i++) {
		sk[i + 32] = pk[i];
	}
	return 0;
}
export const L: Float64Array = new Float64Array([0xED, 0xD3, 0xF5, 0x5C, 0x1A, 0x63, 0x12, 0x58, 0xD6, 0x9C, 0xF7, 0xA2, 0xDE, 0xF9, 0xDE, 0x14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x10]);
export function modL(r: Uint8Array, x: Float64Array): void {
	let carry: number;
	let j: number;
	let k: number;
	for (let i: number = 63; i >= 32; --i) {
		carry = 0;
		for (j = i - 32, k = i - 12; j < k; ++j) {
			x[j] += carry - 16 * x[i] * L[j - (i - 32)];
			carry = Math.floor((x[j] + 128) / 256);
			x[j] -= carry * 256;
		}
		x[j] += carry;
		x[i] = 0;
	}
	carry = 0;
	for (j = 0; j < 32; j++) {
		x[j] += carry - (x[31] >> 4) * L[j];
		carry = x[j] >> 8;
		x[j] &= 255;
	}
	for (j = 0; j < 32; j++) {
		x[j] -= carry * L[j];
	}
	for (let i: number = 0; i < 32; i++) {
		x[i + 1] += x[i] >> 8;
		r[i] = x[i] & 255;
	}
}
function reduce(r: Uint8Array): void {
	const x: Float64Array = new Float64Array(64);
	for (let i: number = 0; i < 64; i++) {
		x[i] = r[i];
	}
	for (let i: number = 0; i < 64; i++) {
		r[i] = 0;
	}
	modL(r, x);
}

// NOTE: Difference from C - smlen returned, not passed as argument.
export function crypto_sign(sm: Uint8Array, m: Uint8Array, n: number, sk: Uint8Array): number {
	const d: Uint8Array = new Uint8Array(64);
	const h: Uint8Array = new Uint8Array(64);
	const p: Float64Array[] = [gf(), gf(), gf(), gf()];
	const r: Uint8Array = new Uint8Array(64);
	const x: Float64Array = new Float64Array(64);
	crypto_hash(d, sk, 32);
	d[0] &= 248;
	d[31] &= 127;
	d[31] |= 64;
	const smlen: number = n + 64;
	for (let i: number = 0; i < n; i++) {
		sm[64 + i] = m[i];
	}
	for (let i: number = 0; i < 32; i++) {
		sm[32 + i] = d[32 + i];
	}
	crypto_hash(r, sm.subarray(32), n + 32);
	reduce(r);
	scalarbase(p, r);
	pack(sm, p);
	for (let i: number = 32; i < 64; i++) {
		sm[i] = sk[i];
	}
	crypto_hash(h, sm, n + 64);
	reduce(h);
	for (let i: number = 0; i < 64; i++) {
		x[i] = 0;
	}
	for (let i: number = 0; i < 32; i++) {
		x[i] = r[i];
	}
	for (let i: number = 0; i < 32; i++) {
		for (let j: number = 0; j < 32; j++) {
			x[i + j] += h[i] * d[j];
		}
	}
	modL(sm.subarray(32), x);
	return smlen;
}
function unpackneg(r: Float64Array[], p: Uint8Array): -1 | 0 {
	const chk: Float64Array = gf();
	const den: Float64Array = gf();
	const den2: Float64Array = gf();
	const den4: Float64Array = gf();
	const den6: Float64Array = gf();
	const num: Float64Array = gf();
	const t: Float64Array = gf();
	set25519(r[2], gf1);
	unpack25519(r[1], p);
	S(num, r[1]);
	M(den, num, D);
	Z(num, num, r[2]);
	A(den, r[2], den);
	S(den2, den);
	S(den4, den2);
	M(den6, den4, den2);
	M(t, den6, num);
	M(t, t, den);
	pow2523(t, t);
	M(t, t, num);
	M(t, t, den);
	M(t, t, den);
	M(r[0], t, den);
	S(chk, r[0]);
	M(chk, chk, den);
	if (neq25519(chk, num)) {
		M(r[0], r[0], I);
	}
	S(chk, r[0]);
	M(chk, chk, den);
	if (neq25519(chk, num)) {
		return -1;
	}
	if (par25519(r[0]) === (p[31] >> 7)) {
		Z(r[0], gf0, r[0]);
	}
	M(r[3], r[0], r[1]);
	return 0;
}
export function crypto_sign_open(m: Uint8Array, sm: Uint8Array, n: number, pk: Uint8Array): number {
	const h: Uint8Array = new Uint8Array(64);
	const p: Float64Array[] = [gf(), gf(), gf(), gf()];
	const q: Float64Array[] = [gf(), gf(), gf(), gf()];
	const t: Uint8Array = new Uint8Array(32);
	if (n < 64) {
		return -1;
	}
	if (unpackneg(q, pk)) {
		return -1;
	}
	for (let i: number = 0; i < n; i++) {
		m[i] = sm[i];
	}
	for (let i: number = 0; i < 32; i++) {
		m[i + 32] = pk[i];
	}
	crypto_hash(h, m, n);
	reduce(h);
	scalarmult(p, q, h);
	scalarbase(q, sm.subarray(32));
	add(p, q);
	pack(t, p);
	n -= 64;
	if (crypto_verify_32(sm, 0, t, 0)) {
		for (let i: number = 0; i < n; i++) {
			m[i] = 0;
		}
		return -1;
	}
	for (let i: number = 0; i < n; i++) {
		m[i] = sm[i + 64];
	}
	return n;
}
export const crypto_box_BEFORENMBYTES = 32;
export const crypto_box_PUBLICKEYBYTES = 32;
export const crypto_box_SECRETKEYBYTES = 32;
export const crypto_hash_BYTES = 64;
export const crypto_scalarmult_BYTES = 32;
export const crypto_scalarmult_SCALARBYTES = 32;
export const crypto_secretbox_BOXZEROBYTES = 16;
export const crypto_secretbox_KEYBYTES = 32;
export const crypto_secretbox_NONCEBYTES = 24;
export const crypto_secretbox_ZEROBYTES = 32;
export const crypto_sign_BYTES = 64;
export const crypto_sign_PUBLICKEYBYTES = 32;
export const crypto_sign_SECRETKEYBYTES = 64;
export const crypto_sign_SEEDBYTES = 32;
export const crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES;
export const crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES;
export const crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES;
