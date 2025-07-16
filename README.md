# NaCl (ES)

[**⚖️** MIT](./LICENSE.md)

[![GitHub: hugoalh/nacl-es](https://img.shields.io/github/v/release/hugoalh/nacl-es?label=hugoalh/nacl-es&labelColor=181717&logo=github&logoColor=ffffff&sort=semver&style=flat "GitHub: hugoalh/nacl-es")](https://github.com/hugoalh/nacl-es)
[![JSR: @hugoalh/nacl](https://img.shields.io/jsr/v/@hugoalh/nacl?label=@hugoalh/nacl&labelColor=F7DF1E&logo=jsr&logoColor=000000&style=flat "JSR: @hugoalh/nacl")](https://jsr.io/@hugoalh/nacl)
[![NPM: @hugoalh/nacl](https://img.shields.io/npm/v/@hugoalh/nacl?label=@hugoalh/nacl&labelColor=CB3837&logo=npm&logoColor=ffffff&style=flat "NPM: @hugoalh/nacl")](https://www.npmjs.com/package/@hugoalh/nacl)

An ECMAScript (JavaScript & TypeScript) module for [NaCl](https://nacl.cr.yp.to/) / [TweetNaCl](https://tweetnacl.cr.yp.to/) high-security cryptographic library.

This is a modified edition of the NPM package [`tweetnacl`](https://www.npmjs.com/package/tweetnacl) which aim for:

- ECMAScript
- TypeScript first

## 🔰 Begin

### 🎯 Targets

| **Targets** | **Remote** | **JSR** | **NPM** |
|:--|:-:|:-:|:-:|
| **[Bun](https://bun.sh/)** >= v1.1.0 | ❌ | ✔️ | ✔️ |
| **[Deno](https://deno.land/)** >= v2.1.0 | ✔️ | ✔️ | ✔️ |
| **[NodeJS](https://nodejs.org/)** >= v20.9.0 | ❌ | ✔️ | ✔️ |

> [!NOTE]
> - It is possible to use this module in other methods/ways which not listed in here, however those methods/ways are not officially supported, and should beware maybe cause security issues.

### #️⃣ Resources Identifier

- **Remote - GitHub Raw:**
  ```
  https://raw.githubusercontent.com/hugoalh/nacl-es/{Tag}/mod.ts
  ```
- **JSR:**
  ```
  [jsr:]@hugoalh/nacl[@{Tag}]
  ```
- **NPM:**
  ```
  [npm:]@hugoalh/nacl[@{Tag}]
  ```

> [!NOTE]
> - For usage of remote resources, it is recommended to import the entire module with the main path `mod.ts`, however it is also able to import part of the module with sub path if available, but do not import if:
>
>   - it's path has an underscore prefix (e.g.: `_foo.ts`, `_util/bar.ts`), or
>   - it is a benchmark or test file (e.g.: `foo.bench.ts`, `foo.test.ts`), or
>   - it's symbol has an underscore prefix (e.g.: `_bar`, `_foo`).
>
>   These elements are not considered part of the public API, thus no stability is guaranteed for them.
> - For usage of JSR or NPM resources, it is recommended to import the entire module with the main entrypoint, however it is also able to import part of the module with sub entrypoint if available, please visit the [file `jsr.jsonc`](./jsr.jsonc) property `exports` for available sub entrypoints.
> - It is recommended to use this module with tag for immutability.

### 🛡️ Runtime Permissions

*This module does not request any runtime permission.*

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
>   - [Deno CLI `deno doc`](https://docs.deno.com/runtime/reference/cli/documentation_generator/)
>   - [JSR](https://jsr.io/@hugoalh/nacl)
>   - [NPM package `tweetnacl`](https://www.npmjs.com/package/tweetnacl/v/1.0.3#usage)
