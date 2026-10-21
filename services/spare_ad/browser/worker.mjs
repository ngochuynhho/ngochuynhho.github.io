import {readModel, prepareFeatures, probability, scores, classify} from "./engine.mjs";
import {inputRows} from "./csv.mjs";
import {assetBuffer} from "./compression.mjs";

const models = new Map();
const contexts = new Map();
let config, manifest;

async function loadModel(name, id) {
  if (models.has(name)) return models.get(name);
  const entry = manifest[name];
  if (!entry || !["best", "average"].includes(name)) throw Error("Choose Best model or Average model.");
  postMessage({id, progress: `Downloading ${name === "best" ? "Best" : "Average"} model for local processing…`});
  const response = await fetch(new URL(`models/${name}.bin.gz`, import.meta.url));
  if (!response.ok) throw Error("The browser model could not be downloaded.");
  const buffer = await assetBuffer(response);
  if (entry.sha256 && self.crypto?.subtle) {
    const digest = await crypto.subtle.digest("SHA-256", buffer);
    const hex = [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
    if (hex !== entry.sha256) throw Error("The model download failed its integrity check. Reload the page and retry.");
  }
  const model = readModel(buffer);
  if (model.models !== entry.model_count) throw Error("The browser model has an unexpected ensemble size.");
  models.set(name, model);
  return model;
}

self.onmessage = async ({data}) => {
  const {id, action, value} = data;
  try {
    let result;
    if (action === "init") {config = value.config; manifest = value.manifest; result = true;}
    else if (action === "context") {contexts.set(value.model, value.reference); result = true;}
    else {
      const reference = contexts.get(value.model);
      if (!reference) throw Error("Select a model and wait for its reference data to load.");
      if (action === "classify") {
        if (!Array.isArray(value.rows) || !value.rows.length || value.rows.length > 50000) throw Error("Expected 1–50,000 previously scored rows.");
        result = {rows: value.rows.map(row => classify(row, reference, value.score, value.trend))};
      } else if (action === "predict") {
        if (typeof value.csv !== "string" || new TextEncoder().encode(value.csv).byteLength > 18 * 1024 * 1024) throw Error("Please choose a CSV smaller than 18 MB.");
        const inputs = inputRows(value.csv, config.features);
        const model = await loadModel(value.model, id);
        const rows = [];
        for (let index = 0; index < inputs.length; index++) {
          const {values, metadata} = inputs[index];
          const p = probability(model, prepareFeatures(values));
          if (!Number.isFinite(p)) throw Error("The browser model produced an invalid probability.");
          const row = {...metadata, p, ...scores(p, metadata.age, reference.norm), binary_prediction: p >= reference.threshold ? "DA" : "CN",
            model: value.model, model_count: model.models, decision_threshold: reference.threshold,
            age_z_extrapolated: Number.isFinite(metadata.age) && (metadata.age < reference.norm.age_min || metadata.age > reference.norm.age_max),
            reference_overlap: null, reference_overlap_status: "not_checked_browser"};
          rows.push(classify(row, reference, value.score, value.trend));
          if (index % 32 === 0) postMessage({id, progress: `Scoring ${index + 1} of ${inputs.length.toLocaleString()} scans on this device…`});
        }
        const warnings = [];
        const missing = rows.filter(row => !Number.isFinite(row.age)).length;
        if (missing) warnings.push(`${missing} input rows have no finite AGE: Index and Logit are returned, but those rows cannot be plotted or receive Age-Z.`);
        if (rows.some(row => row.age_z_extrapolated)) warnings.push("Some Age-Z values extrapolate beyond the CN reference age range; see age_z_extrapolated in the export.");
        result = {rows, warnings, model: value.model, threshold: reference.threshold};
      } else throw Error("Unknown browser calculation.");
    }
    postMessage({id, result});
  } catch (error) {postMessage({id, error: error.message || "The browser calculation did not complete."});}
};
