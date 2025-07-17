/*
NOTE: Ported in 2014 by Dmitry Chestnykh and Devi Mandiri. Public domain. Implementation derived from TweetNaCl version 20140427. See for details: https://tweetnacl.cr.yp.to/
*/
import {
	_vn,
	crypto_box_beforenm,
	crypto_box_BEFORENMBYTES,
	crypto_box_keypair,
	crypto_box_PUBLICKEYBYTES,
	crypto_box_SECRETKEYBYTES,
	crypto_hash,
	crypto_hash_BYTES,
	crypto_scalarmult,
	crypto_scalarmult_base,
	crypto_scalarmult_BYTES,
	crypto_scalarmult_SCALARBYTES,
	crypto_secretbox,
	crypto_secretbox_BOXZEROBYTES,
	crypto_secretbox_KEYBYTES,
	crypto_secretbox_NONCEBYTES,
	crypto_secretbox_open,
	crypto_secretbox_ZEROBYTES,
	crypto_sign,
	crypto_sign_BYTES,
	crypto_sign_keypair,
	crypto_sign_open,
	crypto_sign_PUBLICKEYBYTES,
	crypto_sign_SECRETKEYBYTES,
	crypto_sign_SEEDBYTES,
	type KeyPair
} from "./lowlevel.ts";
export {
	randomBytesBySize as randomBytes
} from "./_random_bytes.ts";
export {
	crypto_box_BEFORENMBYTES as boxSharedKeyLength,
	crypto_box_NONCEBYTES as boxNonceLength,
	crypto_box_PUBLICKEYBYTES as boxPublicKeyLength,
	crypto_box_SECRETKEYBYTES as boxSecretKeyLength,
	crypto_hash_BYTES as hashLength,
	crypto_scalarmult_BYTES as scalarMultGroupElementLength,
	crypto_scalarmult_SCALARBYTES as scalarMultScalarLength,
	crypto_secretbox_BOXZEROBYTES as boxOverheadLength,
	crypto_secretbox_BOXZEROBYTES as secretBoxOverheadLength,
	crypto_secretbox_KEYBYTES as secretBoxKeyLength,
	crypto_secretbox_NONCEBYTES as secretBoxNonceLength,
	crypto_sign_BYTES as signSignatureLength,
	crypto_sign_PUBLICKEYBYTES as signPublicKeyLength,
	crypto_sign_SECRETKEYBYTES as signSecretKeyLength,
	crypto_sign_SEEDBYTES as signSeedLength
} from "./lowlevel.ts";
export {
	secretBox as boxAfter,
	secretBoxOpen as boxOpenAfter
};
function checkLengths(k: Uint8Array, n: Uint8Array): void {
	if (k.length !== crypto_secretbox_KEYBYTES) {
		throw new Error('bad key size');
	}
	if (n.length !== crypto_secretbox_NONCEBYTES) {
		throw new Error('bad nonce size');
	}
}
function checkBoxLengths(pk: Uint8Array, sk: Uint8Array): void {
	if (pk.length !== crypto_box_PUBLICKEYBYTES) {
		throw new Error('bad public key size');
	}
	if (sk.length !== crypto_box_SECRETKEYBYTES) {
		throw new Error('bad secret key size');
	}
}
export function secretBox(msg: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array {
	checkLengths(key, nonce);
	const m: Uint8Array = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
	const c: Uint8Array = new Uint8Array(m.length);
	for (let i: number = 0; i < msg.length; i++) {
		m[i + crypto_secretbox_ZEROBYTES] = msg[i];
	}
	crypto_secretbox(c, m, m.length, nonce, key);
	return c.subarray(crypto_secretbox_BOXZEROBYTES);
}
export function secretBoxOpen(box: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array | null {
	checkLengths(key, nonce);
	const c: Uint8Array = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
	const m: Uint8Array = new Uint8Array(c.length);
	for (let i: number = 0; i < box.length; i++) {
		c[i + crypto_secretbox_BOXZEROBYTES] = box[i];
	}
	if (
		c.length < 32 ||
		crypto_secretbox_open(m, c, c.length, nonce, key) !== 0
	) {
		return null;
	}
	return m.subarray(crypto_secretbox_ZEROBYTES);
}
export function scalarMult(n: Uint8Array, p: Uint8Array): Uint8Array {
	if (n.length !== crypto_scalarmult_SCALARBYTES) {
		throw new Error('bad n size');
	}
	if (p.length !== crypto_scalarmult_BYTES) {
		throw new Error('bad p size');
	}
	const q: Uint8Array = new Uint8Array(crypto_scalarmult_BYTES);
	crypto_scalarmult(q, n, p);
	return q;
}
export function scalarMultBase(n: Uint8Array): Uint8Array {
	if (n.length !== crypto_scalarmult_SCALARBYTES) {
		throw new Error('bad n size');
	}
	const q: Uint8Array = new Uint8Array(crypto_scalarmult_BYTES);
	crypto_scalarmult_base(q, n);
	return q;
}
export function box(msg: Uint8Array, nonce: Uint8Array, publicKey: Uint8Array, secretKey: Uint8Array): Uint8Array {
	return secretBox(msg, nonce, boxBefore(publicKey, secretKey));
}
export function boxBefore(publicKey: Uint8Array, secretKey: Uint8Array): Uint8Array {
	checkBoxLengths(publicKey, secretKey);
	const k: Uint8Array = new Uint8Array(crypto_box_BEFORENMBYTES);
	crypto_box_beforenm(k, publicKey, secretKey);
	return k;
}
export function boxOpen(msg: Uint8Array, nonce: Uint8Array, publicKey: Uint8Array, secretKey: Uint8Array): Uint8Array | null {
	return secretBoxOpen(msg, nonce, boxBefore(publicKey, secretKey));
}
export function boxKeyPair(): KeyPair {
	const pk: Uint8Array = new Uint8Array(crypto_box_PUBLICKEYBYTES);
	const sk: Uint8Array = new Uint8Array(crypto_box_SECRETKEYBYTES);
	crypto_box_keypair(pk, sk);
	return {
		publicKey: pk,
		secretKey: sk
	};
}
export function boxKeyPairFromSecretKey(secretKey: Uint8Array): KeyPair {
	if (secretKey.length !== crypto_box_SECRETKEYBYTES) {
		throw new Error('bad secret key size');
	}
	const pk: Uint8Array = new Uint8Array(crypto_box_PUBLICKEYBYTES);
	crypto_scalarmult_base(pk, secretKey);
	return {
		publicKey: pk,
		secretKey: new Uint8Array(secretKey)
	};
}
export function sign(msg: Uint8Array, secretKey: Uint8Array): Uint8Array {
	if (secretKey.length !== crypto_sign_SECRETKEYBYTES) {
		throw new Error('bad secret key size');
	}
	const signedMsg: Uint8Array = new Uint8Array(crypto_sign_BYTES + msg.length);
	crypto_sign(signedMsg, msg, msg.length, secretKey);
	return signedMsg;
}
export function signOpen(signedMsg: Uint8Array, publicKey: Uint8Array): Uint8Array | null {
	if (publicKey.length !== crypto_sign_PUBLICKEYBYTES) {
		throw new Error('bad public key size');
	}
	const tmp: Uint8Array = new Uint8Array(signedMsg.length);
	const mlen: number = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
	if (mlen < 0) {
		return null;
	}
	const m: Uint8Array = new Uint8Array(mlen);
	for (let i: number = 0; i < m.length; i++) {
		m[i] = tmp[i];
	}
	return m;
}
export function signDetached(msg: Uint8Array, secretKey: Uint8Array): Uint8Array {
	const signedMsg: Uint8Array = sign(msg, secretKey);
	const sig: Uint8Array = new Uint8Array(crypto_sign_BYTES);
	for (let i: number = 0; i < sig.length; i++) {
		sig[i] = signedMsg[i];
	}
	return sig;
}
export function signDetachedVerify(msg: Uint8Array, sig: Uint8Array, publicKey: Uint8Array): boolean {
	if (sig.length !== crypto_sign_BYTES) {
		throw new Error('bad signature size');
	}
	if (publicKey.length !== crypto_sign_PUBLICKEYBYTES) {
		throw new Error('bad public key size');
	}
	const sm: Uint8Array = new Uint8Array(crypto_sign_BYTES + msg.length);
	const m: Uint8Array = new Uint8Array(crypto_sign_BYTES + msg.length);
	for (let i: number = 0; i < crypto_sign_BYTES; i++) {
		sm[i] = sig[i];
	}
	for (let i: number = 0; i < msg.length; i++) {
		sm[i + crypto_sign_BYTES] = msg[i];
	}
	return (crypto_sign_open(m, sm, sm.length, publicKey) >= 0);
}
export function signKeyPair(): KeyPair {
	const pk: Uint8Array = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
	const sk: Uint8Array = new Uint8Array(crypto_sign_SECRETKEYBYTES);
	crypto_sign_keypair(pk, sk);
	return {
		publicKey: pk,
		secretKey: sk
	};
}
export function signKeyPairFromSecretKey(secretKey: Uint8Array): KeyPair {
	if (secretKey.length !== crypto_sign_SECRETKEYBYTES) {
		throw new Error('bad secret key size');
	}
	const pk: Uint8Array = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
	for (let i: number = 0; i < pk.length; i++) {
		pk[i] = secretKey[32 + i];
	}
	return {
		publicKey: pk,
		secretKey: new Uint8Array(secretKey)
	};
}
export function signKeyPairFromSeed(seed: Uint8Array): KeyPair {
	if (seed.length !== crypto_sign_SEEDBYTES) {
		throw new Error('bad seed size');
	};
	const pk: Uint8Array = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
	const sk: Uint8Array = new Uint8Array(crypto_sign_SECRETKEYBYTES);
	for (let i: number = 0; i < 32; i++) {
		sk[i] = seed[i];
	}
	crypto_sign_keypair(pk, sk, true);
	return {
		publicKey: pk,
		secretKey: sk
	};
}
export function hash(msg: Uint8Array): Uint8Array {
	const h: Uint8Array = new Uint8Array(crypto_hash_BYTES);
	crypto_hash(h, msg, msg.length);
	return h;
}
export function verify(x: Uint8Array, y: Uint8Array): boolean {
	// Zero length arguments are considered not equal.
	if (
		x.length === 0 ||
		y.length === 0 ||
		x.length !== y.length
	) {
		return false;
	}
	return (_vn(x, 0, y, 0, x.length) === 0);
}
export function setPRNG(): void {
	console.warn(`The pseudo random number generator (PRNG) in the NaCl (ES) is provided by the runtime and cannot redefine.`);
}
