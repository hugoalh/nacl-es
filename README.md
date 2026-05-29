# NaCl (ES)

[**⚖️** MIT](./LICENSE.md)

🔗
[GitHub](https://github.com/hugoalh/nacl-es)
● [JSR](https://jsr.io/@hugoalh/nacl)
● [NPM](https://www.npmjs.com/package/@hugoalh/nacl)

An ECMAScript module for [NaCl](https://nacl.cr.yp.to/) / [TweetNaCl](https://tweetnacl.cr.yp.to/) high security cryptographic library.

This is a modified edition of the [TweetNaCl JS](https://github.com/dchest/tweetnacl-js) which with ECMAScript and TypeScript.

## 🎯 Runtime Targets

Any runtime which support ECMAScript should able to use this; These runtimes are officially supported:

- **[Bun](https://bun.sh/)** >= v1.1.0
- **[Deno](https://deno.land/)** >= v2.1.0
- **[NodeJS](https://nodejs.org/)** >= v20.9.0

## 🛡️ Runtime Permissions

This does not request any runtime permission.

## #️⃣ Sources & Entrypoints

- GitHub Raw
  ```
  https://raw.githubusercontent.com/hugoalh/nacl-es/{Tag}/mod.ts
  ```
- JSR
  ```
  jsr:@hugoalh/nacl[@{Tag}]
  ```
- NPM
  ```
  npm:@hugoalh/nacl[@{Tag}]
  ```

| **Name** | **Path** | **Description** |
|:--|:--|:--|
| `.` | `./mod.ts` | Default. High level APIs. |
| `./lowlevel` | `./lowlevel.ts` | Low level APIs. |

> [!NOTE]
> - Different runtimes have vary support for the sources and entrypoints, visit the runtime documentation for more information.
> - It is recommended to include tag for immutability.
> - These are not part of the public APIs hence should not be used:
>   - Benchmark/Test file (e.g.: `example.bench.ts`, `example.test.ts`).
>   - Entrypoint name or path include any underscore prefix (e.g.: `_example.ts`, `foo/_example.ts`).
>   - Identifier/Namespace/Symbol include any underscore prefix (e.g.: `_example`, `Foo._example`).

## 🧩 APIs

- ```ts
  function box(msg: Uint8Array, nonce: Uint8Array, publicKey: Uint8Array, secretKey: Uint8Array): Uint8Array;
  ```
- ```ts
  function boxBefore(publicKey: Uint8Array, secretKey: Uint8Array): Uint8Array;
  ```
- ```ts
  function boxKeyPair(): KeyPair;
  ```
- ```ts
  function boxKeyPairFromSecretKey(secretKey: Uint8Array): KeyPair;
  ```
- ```ts
  function boxOpen(msg: Uint8Array, nonce: Uint8Array, publicKey: Uint8Array, secretKey: Uint8Array): Uint8Array | null;
  ```
- ```ts
  function hash(msg: Uint8Array): Uint8Array;
  ```
- ```ts
  function scalarMult(n: Uint8Array, p: Uint8Array): Uint8Array;
  ```
- ```ts
  function scalarMultBase(n: Uint8Array): Uint8Array;
  ```
- ```ts
  function secretBox(msg: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array;
  ```
- ```ts
  function secretBoxOpen(box: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array | null;
  ```
- ```ts
  function sign(msg: Uint8Array, secretKey: Uint8Array): Uint8Array;
  ```
- ```ts
  function signDetached(msg: Uint8Array, secretKey: Uint8Array): Uint8Array;
  ```
- ```ts
  function signDetachedVerify(msg: Uint8Array, sig: Uint8Array, publicKey: Uint8Array): boolean;
  ```
- ```ts
  function signKeyPair(): KeyPair;
  ```
- ```ts
  function signKeyPairFromSecretKey(secretKey: Uint8Array): KeyPair;
  ```
- ```ts
  function signKeyPairFromSeed(seed: Uint8Array): KeyPair;
  ```
- ```ts
  function signOpen(signedMsg: Uint8Array, publicKey: Uint8Array): Uint8Array | null;
  ```
- ```ts
  function verify(x: Uint8Array, y: Uint8Array): boolean;
  ```
- ```ts
  interface KeyPair {
    publicKey: Uint8Array;
    secretKey: Uint8Array;
  }
  ```

> [!NOTE]
> - For the full or prettier documentation, can visit via:
>   - [Deno CLI `deno doc`](https://docs.deno.com/runtime/reference/cli/doc/)
>   - [JSR](https://jsr.io/@hugoalh/nacl)
