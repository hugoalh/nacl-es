const cgrvQuota = 65536;
export function randomBytesByTargetIndex(target: Uint8Array, begin: number, end: number): Uint8Array {
	for (let i: number = begin; i < end; i += cgrvQuota) {
		const v: Uint8Array = crypto.getRandomValues(new Uint8Array(Math.min(end - begin, cgrvQuota)));
		for (let j: number = 0; j < v.length; j += 1) {
			target[i + j] = v[j];
		}
	}
	return target;
}
export function randomBytesByTargetSizeFromBegin(target: Uint8Array, sizeFromBegin: number): Uint8Array {
	return randomBytesByTargetIndex(target, 0, sizeFromBegin);
}
export function randomBytesBySize(size: number): Uint8Array {
	return randomBytesByTargetIndex(new Uint8Array(size), 0, size);
}
