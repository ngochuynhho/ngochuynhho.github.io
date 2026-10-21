/* CSV and input preparation shared by the browser worker and numerical tests. */
export function parseCSV(text) {
  text = text.replace(/^\uFEFF/, "");
  const rows = [];
  let row = [], cell = "", quoted = false, closed = false;
  const field = () => {row.push(cell); cell = ""; closed = false;};
  const record = () => {field(); if (!(row.length === 1 && row[0].trim() === "")) rows.push(row); row = [];};
  for (let i = 0; i < text.length; i++) {
    const character = text[i];
    if (quoted) {
      if (character === '"') {
        if (text[i + 1] === '"') {cell += '"'; i++;}
        else {quoted = false; closed = true;}
      } else cell += character;
    } else if (character === ",") field();
    else if (character === "\n" || character === "\r") {if (character === "\r" && text[i + 1] === "\n") i++; record();}
    else if (character === '"' && !cell && !closed) quoted = true;
    else if (closed) throw Error("Unexpected text after a quoted CSV field.");
    else cell += character;
  }
  if (quoted) throw Error("The CSV contains an unclosed quoted field.");
  if (cell || row.length || closed) record();
  if (!rows.length) throw Error("The CSV is empty.");
  const columns = rows.shift().map(name => name.trim());
  if (new Set(columns).size !== columns.length) throw Error("Duplicate CSV column names.");
  if (!rows.length || rows.length > 50000) throw Error("Choose a CSV containing 1 to 50,000 data rows.");
  for (const row of rows) {
    if (row.length > columns.length) throw Error("A CSV row has more values than the column header.");
    while (row.length < columns.length) row.push("");
  }
  return {columns, rows};
}

export function numeric(value) {
  const text = String(value ?? "").trim();
  return /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(text) ? Number(text) : NaN;
}

export function diagnosis(value) {
  const label = String(value ?? "").trim().toUpperCase();
  if (["CN", "NORMAL", "CONTROL", "0", "0.0"].includes(label)) return "CN";
  if (["AD", "DA", "DEMENTIA OF ALZHEIMER", "1", "1.0"].includes(label)) return "DA";
  if (["MCI", "MILD COGNITIVE IMPAIRMENT"].includes(label)) return "MCI";
  return "Unlabeled";
}

export function inputRows(text, features) {
  const {columns, rows} = parseCSV(text);
  const missing = features.filter(feature => !columns.includes(feature));
  if (missing.length) throw Error("Missing required model features: " + missing.join(", "));
  const indices = features.map(feature => columns.indexOf(feature));
  const ageIndex = columns.findIndex(name => name.toUpperCase() === "AGE");
  const dxIndex = columns.findIndex(name => ["DX", "DIAGNOSIS"].includes(name.toUpperCase()));
  const idColumn = ["MRI_ID", "Subject_ID", "PTID", "RID"].find(name => columns.includes(name));
  const idIndex = columns.indexOf(idColumn), cohortIndex = columns.indexOf("COHORT"), ethnicityIndex = columns.indexOf("ETHNICITY");
  return rows.map((row, index) => {
    const age = ageIndex < 0 ? NaN : numeric(row[ageIndex]);
    return {values: indices.map(column => numeric(row[column])), metadata: {
      row: index + 1, id: idIndex < 0 ? `Input ${index + 1}` : row[idIndex], age: Number.isFinite(age) ? age : null,
      diagnosis: dxIndex < 0 ? "Unlabeled" : diagnosis(row[dxIndex]),
      cohort: cohortIndex < 0 ? "Uploaded" : row[cohortIndex], ethnicity: ethnicityIndex < 0 ? "Unknown" : row[ethnicityIndex], partition: "Uploaded",
    }};
  });
}
