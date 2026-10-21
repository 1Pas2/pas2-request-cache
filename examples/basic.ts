import { RequestCache } from "../dist/index.js";
const cache = new RequestCache<string, string>(1000);
console.log(await cache.get("greeting", async () => "hello"));
