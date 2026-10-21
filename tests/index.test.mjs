import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import * as api from "../dist/index.js";
test("deduplicates and expires", async () => {
  let now = 0,
    n = 0;
  const c = new api.RequestCache(10, 2, () => now);
  const load = async () => ++n;
  assert.deepEqual(
    await Promise.all([c.get("x", load), c.get("x", load)]),
    [1, 1],
  );
  now = 11;
  assert.equal(await c.get("x", load), 2);
});
test("rejections are not cached", async () => {
  const c = new api.RequestCache();
  await assert.rejects(
    c.get("x", async () => {
      throw Error("fail");
    }),
  );
  assert.equal(await c.get("x", async () => 4), 4);
});
test("invalidation prevents stale insertion", async () => {
  const c = new api.RequestCache();
  let resolve;
  const p = c.get(
    "x",
    () =>
      new Promise((r) => {
        resolve = r;
      }),
  );
  await Promise.resolve();
  c.delete("x");
  resolve(1);
  await p;
  assert.equal(await c.get("x", async () => 2), 2);
});
