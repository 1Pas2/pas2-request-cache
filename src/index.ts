export class RequestCache<K, V> {
  private readonly values = new Map<K, { value: V; expires: number }>();
  private readonly pending = new Map<K, Promise<V>>();
  constructor(
    readonly ttlMs = 1000,
    readonly maxEntries = 100,
    private readonly clock: () => number = Date.now,
  ) {
    if (
      !Number.isFinite(ttlMs) ||
      ttlMs < 0 ||
      !Number.isSafeInteger(maxEntries) ||
      maxEntries < 1
    )
      throw new RangeError("Invalid cache configuration");
  }
  get(key: K, load: () => Promise<V>): Promise<V> {
    const cached = this.values.get(key);
    if (cached && cached.expires > this.clock())
      return Promise.resolve(cached.value);
    this.values.delete(key);
    const running = this.pending.get(key);
    if (running) return running;
    const task = Promise.resolve()
      .then(load)
      .then((value) => {
        if (this.pending.get(key) === task) {
          if (this.values.size >= this.maxEntries)
            this.values.delete(this.values.keys().next().value!);
          this.values.set(key, { value, expires: this.clock() + this.ttlMs });
        }
        return value;
      })
      .finally(() => {
        if (this.pending.get(key) === task) this.pending.delete(key);
      });
    this.pending.set(key, task);
    return task;
  }
  delete(key: K): void {
    this.values.delete(key);
    this.pending.delete(key);
  }
  clear(): void {
    this.values.clear();
    this.pending.clear();
  }
}
