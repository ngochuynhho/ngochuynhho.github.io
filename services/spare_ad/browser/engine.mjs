/* Inference-only interpreter for the supplied numerical XGBoost trees. */
const f32 = Math.fround;
const MIN_PROBABILITY = f32(1e-6);
const MAX_PROBABILITY = f32(1 - 1e-6);

export function readModel(buffer) {
  const header = new DataView(buffer);
  if (new TextDecoder().decode(new Uint8Array(buffer, 0, 8)) !== "SPAD0001") throw Error("Unknown model format.");
  const models = header.getUint32(8, true), features = header.getUint32(12, true);
  const trees = header.getUint32(16, true), nodes = header.getUint32(20, true);
  if (![1, 100].includes(models) || features !== 145 || !trees || !nodes) throw Error("Invalid model dimensions.");
  if (buffer.byteLength !== 32 + 4 * (models + models + 1 + trees + 4 * nodes)) throw Error("Incomplete model download.");
  let offset = 32;
  const array = (Type, count) => {const value = new Type(buffer, offset, count); offset += 4 * count; return value;};
  return {models, features, margins: array(Float32Array, models), offsets: array(Uint32Array, models + 1), roots: array(Uint32Array, trees), left: array(Int32Array, nodes), right: array(Int32Array, nodes), feature: array(Uint32Array, nodes), value: array(Float32Array, nodes)};
}

export function roundEven(value) {
  const low = Math.floor(value), fraction = value - low;
  return fraction === 0.5 ? (low % 2 === 0 ? low : low + 1) : Math.round(value);
}

export function prepareFeatures(values) {
  if (values.length !== 145 || values.some(value => !Number.isFinite(value))) throw Error("Model features must contain finite numeric values.");
  const icv = f32(values[0]);
  if (!Number.isFinite(icv) || icv <= 0) throw Error("ICV must be finite and strictly positive.");
  const output = new Float32Array(145);
  const denominator = Math.max(icv, f32(1e-6));
  for (let i = 0; i < 145; i++) {
    const rounded = f32(roundEven(values[i]));
    if (!Number.isFinite(rounded)) throw Error("Feature values exceed float32 range.");
    output[i] = f32(rounded / denominator);
    if (!Number.isFinite(output[i])) throw Error("Normalized feature values exceed float32 range.");
  }
  return output;
}

function sigmoid(margin) {
  const denominator = f32(1 + f32(Math.exp(-margin)));
  return f32(1 / denominator);
}

export function probability(model, input) {
  let total = 0;
  for (let member = 0; member < model.models; member++) {
    let margin = model.margins[member];
    for (let tree = model.offsets[member]; tree < model.offsets[member + 1]; tree++) {
      let node = model.roots[tree];
      while (model.left[node] >= 0) {
        const split = model.feature[node], feature = input[split & 0x7fffffff];
        node = Number.isNaN(feature) ? (split >>> 31 ? model.left[node] : model.right[node]) : (feature < model.value[node] ? model.left[node] : model.right[node]);
      }
      margin = f32(margin + model.value[node]);
    }
    total += Math.max(MIN_PROBABILITY, Math.min(MAX_PROBABILITY, sigmoid(margin)));
  }
  return total / model.models;
}

export function scores(p, age, norm) {
  const clipped = Math.max(1e-6, Math.min(1 - 1e-6, p));
  const logit = Math.log(clipped / (1 - clipped));
  return {index: 2 * p - 1, logit, age_z: Number.isFinite(age) ? (logit - (norm.intercept + norm.slope * age)) / norm.sd : null};
}

export function classify(row, reference, score = "index", kind = "linear") {
  if (!["index", "logit", "age_z"].includes(score) || !["linear", "curve"].includes(kind)) throw Error("Unknown score or trend type.");
  const groups = ["CN", "MCI", "DA"], fits = reference.trends[score][kind];
  const complete = groups.every(group => fits[group]);
  const finite = Number.isFinite(row.age) && Number.isFinite(row[score]);
  const output = {...row, trend_prediction: null, trend_status: complete ? "missing age or score" : "incomplete reference trends", trend_extrapolated: false, trend_score: score, trend_kind: kind};
  const distances = groups.map(group => {
    let distance = null;
    if (complete && finite) {
      const fit = fits[group], x = (row.age - fit.center) / fit.scale;
      let value = 0;
      for (let i = fit.coefficients.length - 1; i >= 0; i--) value = value * x + fit.coefficients[i];
      distance = Math.abs(row[score] - value);
      output.trend_extrapolated ||= row.age < fit.age_min || row.age > fit.age_max;
    }
    output["trend_distance_" + group] = distance;
    return distance;
  });
  if (complete && finite) {
    const ordered = groups.map((_, i) => i).sort((a, b) => distances[a] - distances[b]);
    if (Math.abs(distances[ordered[0]] - distances[ordered[1]]) <= 1e-10) output.trend_status = "tied nearest trends";
    else {output.trend_prediction = groups[ordered[0]]; output.trend_status = output.trend_extrapolated ? "extrapolated" : "ok";}
  }
  output.prediction = output.trend_prediction ?? row.binary_prediction;
  return output;
}
