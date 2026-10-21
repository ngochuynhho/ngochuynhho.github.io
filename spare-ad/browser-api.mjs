/* Same-device message passing replaces the former POST API. */
import {assetBuffer} from "./compression.mjs";
export class BrowserAPI {
  constructor(onProgress = () => {}) {
    this.onProgress = onProgress;
    this.pending = new Map();
    this.references = new Map();
    this.sequence = 0;
  }
  async json(name) {
    const response = await fetch(new URL(name, import.meta.url));
    if (!response.ok) throw Error("The application assets could not be loaded. Reload the page and retry.");
    return response.json();
  }
  async init() {
    this.config = await this.json("data/config.json");
    this.manifest = await this.json("models/manifest.json");
    await this.startWorker();
    return this.config;
  }
  async startWorker() {
    this.worker = new Worker(new URL("worker.mjs", import.meta.url), {type: "module"});
    this.worker.onmessage = ({data}) => {
      if (data.progress) {this.onProgress(data.progress); return;}
      const promise = this.pending.get(data.id);
      if (!promise) return;
      this.pending.delete(data.id);
      if (data.error) promise.reject(Error(data.error)); else promise.resolve(data.result);
      if (!this.pending.size) this.onProgress("");
    };
    this.worker.onerror = () => this.cancel("The browser calculation stopped unexpectedly. Reload the page or try a smaller CSV.");
    await this.send("init", {config: this.config, manifest: this.manifest});
    for (const [model, reference] of this.references) await this.send("context", {model, reference: this.context(reference)});
  }
  send(action, value) {
    return new Promise((resolve, reject) => {
      const id = ++this.sequence;
      this.pending.set(id, {resolve, reject});
      this.worker.postMessage({id, action, value});
    });
  }
  context(reference) {
    return {norm: reference.norm, threshold: reference.threshold, trends: reference.trends};
  }
  async reference(model) {
    if (!["best", "average"].includes(model)) throw Error("Choose Best model or Average model.");
    if (!this.references.has(model)) {
      const response = await fetch(new URL(`data/${model}.reference.json.gz`, import.meta.url));
      if (!response.ok || !response.body) throw Error("The reference data could not be loaded.");
      const reference = JSON.parse(new TextDecoder().decode(await assetBuffer(response)));
      this.references.set(model, reference);
      await this.send("context", {model, reference: this.context(reference)});
    }
    return this.references.get(model);
  }
  async request(path, options) {
    if (path === "/api/config") return this.init();
    if (path.startsWith("/api/reference?")) return this.reference(new URLSearchParams(path.split("?")[1]).get("model"));
    if (!this.worker) await this.startWorker();
    const value = JSON.parse(options.body);
    if (path === "/api/predict") return this.send("predict", value);
    if (path === "/api/classify") return this.send("classify", value);
    throw Error("Unknown local application operation.");
  }
  cancel(message = "Calculation cancelled. Your CSV stays on this device.") {
    this.worker?.terminate();
    this.worker = null;
    for (const promise of this.pending.values()) promise.reject(Error(message));
    this.pending.clear();
    this.onProgress("");
  }
}
