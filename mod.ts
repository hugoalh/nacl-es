/*
NOTE: Ported in 2014 by Dmitry Chestnykh and Devi Mandiri. Public domain. Implementation derived from TweetNaCl (https://tweetnacl.cr.yp.to/) version 20140427.
*/
import {
	_vn,
	crypto_box_beforenm,
	crypto_box_BEFORENMBYTES,
	crypto_box_keypair,
	crypto_box_NONCEBYTES,
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
export type { KeyPair };
export {
	/**
	 * Generate a `Uint8Array` of the given length containing random bytes of cryptographic quality.
	 */
	randomBytesBySize as randomBytes
} from "./_random_bytes.ts";
/** Length of nonce in bytes. */
export const boxNonceLength = crypto_box_NONCEBYTES;
/** Length of overhead added to box compared to original message. */
export const boxOverheadLength = crypto_secretbox_BOXZEROBYTES;
/** Length of public key in bytes. */
export const boxPublicKeyLength = crypto_box_PUBLICKEYBYTES;
/** Length of secret key in bytes. */
export const boxSecretKeyLength = crypto_box_SECRETKEYBYTES;
/** Length of precomputed shared key in bytes. */
export const boxSharedKeyLength = crypto_box_BEFORENMBYTES;
/** Length of hash in bytes. */
export const hashLength = crypto_hash_BYTES;
/** Length of group element in bytes. */
export const scalarMultGroupElementLength = crypto_scalarmult_BYTES;
/** Length of scalar in bytes. */
export const scalarMultScalarLength = crypto_scalarmult_SCALARBYTES;
/** Length of key in bytes. */
export const secretBoxKeyLength = crypto_secretbox_KEYBYTES;
/** Length of nonce in bytes. */
export const secretBoxNonceLength = crypto_secretbox_NONCEBYTES;
/** Length of overhead added to secret box compared to original message. */
export const secretBoxOverheadLength = crypto_secretbox_BOXZEROBYTES;
/** Length of signing public key in bytes. */
export const signPublicKeyLength = crypto_sign_PUBLICKEYBYTES;
/** Length of signing secret key in bytes. */
export const signSecretKeyLength = crypto_sign_SECRETKEYBYTES;
/** Length of seed for {@linkcode signKeyPairFromSeed} in bytes. */
export const signSeedLength = crypto_sign_SEEDBYTES;
/** Length of signature in bytes. */
export const signSignatureLength = crypto_sign_BYTES;
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
/**
 * Encrypt and authenticate message using the key and the nonce. The nonce must be unique for each distinct message for this key. Return an encrypted and authenticated message, which is {@linkcode secretBoxOverheadLength} longer than the original message.
 * @param {Uint8Array} msg Message.
 * @param {Uint8Array} nonce Nonce.
 * @param {Uint8Array} key Key.
 * @returns {Uint8Array} An encrypted and authenticated message.
 */
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
/**
 * Authenticate and decrypt the given secret box using the key and the nonce. Returns the original message, or `null` if authentication fail.
 * @param {Uint8Array} box Secret box.
 * @param {Uint8Array} nonce Nonce.
 * @param {Uint8Array} key Key.
 * @returns {Uint8Array | null} The original message, or `null` if authentication fail.
 */
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
/**
 * Multiply an integer `n` by a group element `p` and return the resulting group element.
 * @param {Uint8Array} n Integer.
 * @param {Uint8Array} p Group element.
 * @returns {Uint8Array} Result group element.
 */
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
/**
 * Multiply an integer `n` by a standard group element and return the resulting group element.
 * @param {Uint8Array} n Integer.
 * @returns {Uint8Array} Result group element.
 */
export function scalarMultBase(n: Uint8Array): Uint8Array {
	if (n.length !== crypto_scalarmult_SCALARBYTES) {
		throw new Error('bad n size');
	}
	const q: Uint8Array = new Uint8Array(crypto_scalarmult_BYTES);
	crypto_scalarmult_base(q, n);
	return q;
}
/**
 * Encrypt and authenticate message using peer's public key, our secret key, and the given nonce, which must be unique for each distinct message for a key pair. Return an encrypted and authenticated message, which is {@linkcode boxOverheadLength} longer than the original message.
 * @param {Uint8Array} msg Message.
 * @param {Uint8Array} nonce Nonce.
 * @param {Uint8Array} publicKey Peer's public key.
 * @param {Uint8Array} secretKey Our secret key.
 * @returns {Uint8Array} An encrypted and authenticated message.
 */
export function box(msg: Uint8Array, nonce: Uint8Array, publicKey: Uint8Array, secretKey: Uint8Array): Uint8Array {
	return secretBox(msg, nonce, boxBefore(publicKey, secretKey));
}
/**
 * Encrypt and authenticate message using the key and the nonce. The nonce must be unique for each distinct message for this key. Return an encrypted and authenticated message, which is {@linkcode secretBoxOverheadLength} longer than the original message.
 * @param {Uint8Array} msg Message.
 * @param {Uint8Array} nonce Nonce.
 * @param {Uint8Array} key Key.
 * @returns {Uint8Array} An encrypted and authenticated message.
 */
export const boxAfter = secretBox;
/**
 * Get a precomputed shared key which can be used in {@linkcode boxAfter} and {@linkcode boxOpenAfter}.
 * @param {Uint8Array} publicKey Public key.
 * @param {Uint8Array} secretKey Secret key.
 * @returns {Uint8Array} A precomputed shared key.
 */
export function boxBefore(publicKey: Uint8Array, secretKey: Uint8Array): Uint8Array {
	checkBoxLengths(publicKey, secretKey);
	const k: Uint8Array = new Uint8Array(crypto_box_BEFORENMBYTES);
	crypto_box_beforenm(k, publicKey, secretKey);
	return k;
}
/**
 * Authenticate and decrypt the given box with peer's public key, our secret key, and the given nonce. Return the original message, or `null` if authentication fail.
 * @param {Uint8Array} msg Message.
 * @param {Uint8Array} nonce Nonce.
 * @param {Uint8Array} publicKey Peer's public key.
 * @param {Uint8Array} secretKey Our secret key.
 * @returns {Uint8Array | null} The original message, or `null` if authentication fail.
 */
export function boxOpen(msg: Uint8Array, nonce: Uint8Array, publicKey: Uint8Array, secretKey: Uint8Array): Uint8Array | null {
	return secretBoxOpen(msg, nonce, boxBefore(publicKey, secretKey));
}
/**
 * Authenticate and decrypt the given secret box using the key and the nonce. Returns the original message, or `null` if authentication fail.
 * @param {Uint8Array} box Secret box.
 * @param {Uint8Array} nonce Nonce.
 * @param {Uint8Array} key Key.
 * @returns {Uint8Array | null} The original message, or `null` if authentication fail.
 */
export const boxOpenAfter = secretBoxOpen;
/**
 * Generate a new random key pair for box and return an object with public key and secret key members.
 * @returns {KeyPair} A new random key pair for box.
 */
export function boxKeyPair(): KeyPair {
	const pk: Uint8Array = new Uint8Array(crypto_box_PUBLICKEYBYTES);
	const sk: Uint8Array = new Uint8Array(crypto_box_SECRETKEYBYTES);
	crypto_box_keypair(pk, sk);
	return {
		publicKey: pk,
		secretKey: sk
	};
}
/**
 * Get a key pair for box with public key corresponding to the given secret key.
 * @param {Uint8Array} secretKey Secret key.
 * @returns {KeyPair} A key pair for box.
 */
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
/**
 * Sign the message using the secret key and return a signed message.
 * @param {Uint8Array} msg Message.
 * @param {Uint8Array} secretKey Secret key.
 * @returns {Uint8Array} A signed message.
 */
export function sign(msg: Uint8Array, secretKey: Uint8Array): Uint8Array {
	if (secretKey.length !== crypto_sign_SECRETKEYBYTES) {
		throw new Error('bad secret key size');
	}
	const signedMsg: Uint8Array = new Uint8Array(crypto_sign_BYTES + msg.length);
	crypto_sign(signedMsg, msg, msg.length, secretKey);
	return signedMsg;
}
/**
 * Verify the signed message and return the message without signature. Return `null` if verification fail.
 * @param {Uint8Array} signedMsg Signed message.
 * @param {Uint8Array} publicKey Public key.
 * @returns {Uint8Array | null} The message without signature, or `null` if verification fail.
 */
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
/**
 * Sign the message using the secret key and return a signature.
 * @param {Uint8Array} msg Message.
 * @param {Uint8Array} secretKey Secret key.
 * @returns {Uint8Array} Signature.
 */
export function signDetached(msg: Uint8Array, secretKey: Uint8Array): Uint8Array {
	const signedMsg: Uint8Array = sign(msg, secretKey);
	const sig: Uint8Array = new Uint8Array(crypto_sign_BYTES);
	for (let i: number = 0; i < sig.length; i++) {
		sig[i] = signedMsg[i];
	}
	return sig;
}
/**
 * Verify the signature for the message.
 * @param {Uint8Array} msg Message.
 * @param {Uint8Array} sig Signature.
 * @param {Uint8Array} publicKey Public key.
 * @returns {boolean} Result of the verification.
 */
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
/**
 * Generate a new random key pair for signing and return an object with public key and secret key members.
 * @returns {KeyPair} A new random key pair for signing.
 */
export function signKeyPair(): KeyPair {
	const pk: Uint8Array = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
	const sk: Uint8Array = new Uint8Array(crypto_sign_SECRETKEYBYTES);
	crypto_sign_keypair(pk, sk);
	return {
		publicKey: pk,
		secretKey: sk
	};
}
/**
 * Get a signing key pair with public key corresponding to the given 64-bytes secret key. The secret key must have been generated by {@linkcode signKeyPair} or {@linkcode signKeyPairFromSeed}.
 * @param {Uint8Array} secretKey 64-bytes secret key.
 * @returns {KeyPair} A key pair for signing.
 */
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
/**
 * Get a new signing key pair generated deterministically from a 32-bytes seed. The seed must contain enough entropy to be secure. This method is not recommended for general use; Instead, use {@linkcode signKeyPair} to generate a new key pair from a random seed.
 * @param {Uint8Array} seed 32-bytes seed.
 * @returns {KeyPair} A key pair for signing.
 */
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
/**
 * Get SHA-512 hash of the message.
 * @param {Uint8Array} msg Message.
 * @returns {Uint8Array} SHA-512 hash of the message.
 */
export function hash(msg: Uint8Array): Uint8Array {
	const h: Uint8Array = new Uint8Array(crypto_hash_BYTES);
	crypto_hash(h, msg, msg.length);
	return h;
}
/**
 * Compare `x` and `y` in constant time.
 * @param {Uint8Array} x
 * @param {Uint8Array} y
 * @returns {boolean} Result of the compare.
 */
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
/**
 * Set pseudo random number generator (PRNG) for the NaCl (ES).
 * @deprecated The pseudo random number generator (PRNG) in the NaCl (ES) is provided by the runtime and cannot redefine.
 */
export function setPRNG(): void {
	console.warn(`The pseudo random number generator (PRNG) in the NaCl (ES) is provided by the runtime and cannot redefine.`);
}
