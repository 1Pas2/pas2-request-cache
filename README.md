# pas2-request-cache

Cache and deduplicate asynchronous keyed requests.

Part of **Pas2 Kit** by [1Pas2](https://github.com/1Pas2): small independent TypeScript libraries with no runtime dependencies.

## Features

- Focused API with strict TypeScript declarations.
- ESM package for Node.js 22 and later.
- Automated behavioral tests and CI on Node.js 22 and 24.

## Installation

This package is prepared for npm but is **not published to npm**. Install from a local checkout:

```sh
git clone https://github.com/1Pas2/pas2-request-cache.git
cd pas2-request-cache
npm ci
npm run build
npm pack
```

Install the resulting `.tgz` in your application using `npm install /path/to/package.tgz`.
The intended npm name is `@1pas2/request-cache`; registry availability is not claimed.

## Usage

```ts
import { RequestCache } from '@1pas2/request-cache';
const cache = new RequestCache<string, string>(1000);
console.log(await cache.get('greeting', async () => 'hello'));
```

The checked-in example imports the local build. After building, run it with `node --experimental-strip-types examples/basic.ts` on a compatible Node.js release. Network and filesystem examples perform the operations shown.

## API and behavior

RequestCache<K,V>(ttlMs,maxEntries,clock?) caches resolved values with FIFO eviction and deduplicates in-flight work. Rejections are not cached. delete(key) and clear() invalidate future caching without cancelling running callers. Pending loads are not bounded by maxEntries. Include all request-relevant inputs in keys; avoid shared keys for different users.

The complete public types are in [src/index.ts](src/index.ts) and generated in `dist/index.d.ts`.

## Development

```sh
npm ci
npm test
npm run check:examples
npm pack --dry-run
```

Tests use the built-in Node.js test runner against the compiled public API. Runtime dependencies: none. Development dependencies: TypeScript and Node.js type declarations. This initial release has a deliberately small scope; review its documented limits before production use.

## Ecosystem

Browse the [Pas2 Kit project index](https://github.com/1Pas2?tab=repositories&q=pas2-). Each repository builds and runs independently.

## Contributing

Open an issue describing a reproducible problem or submit a focused pull request with a behavioral test. Run the development commands above before submitting. Never include credentials or private information in reports.

## License

[MIT](LICENSE) © 2026 1Pas2.

1Pas2
