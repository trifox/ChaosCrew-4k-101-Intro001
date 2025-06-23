#!/usr/bin/env node

/* as of now this is a standalone utility to work with the feature database */
/* here we list the closest radius rows around a given row :) */

const fs = require("fs");
const path = require("path");

// === CONFIG: Kommandozeilenargumente ===
const [, , filePath, indexStr, radiusStr] = process.argv;

if (!filePath || !indexStr || !radiusStr) {
  console.error(
    "Nutzung: node filterByDistance.js <csvDatei> <index> <radius>"
  );
  process.exit(1);
}

const index = parseInt(indexStr);
const radius = parseFloat(radiusStr);

// === CSV-Datei lesen ===
const content = fs.readFileSync(path.resolve(filePath), "utf8");

// === CSV parsen ===
const rows = content
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line.length > 0)
  .map((line) => line.split(",").map((it) => (isNaN(it) ? it : Number(it))));

// === Mittelpunkt bestimmen ===
if (index < 0 || index >= rows.length) {
  console.error("Ungültiger Index.");
  process.exit(1);
}

function rowToObject(row) {
  const keys = [
    "period",
    "isMinibrot",
    "angledInternalAddress",
    "lowerAngleNumerator",
    "lowerAngleDenominator",
    "upperAngleNumerator",
    "upperAngleDenominator",
    "orientationRadians",
    "minibrotSize",
    "realNucleus",
    "imagNucleus",
  ];

  const obj = {};
  keys.forEach((key, i) => {
    obj[key] = row[i];
  });

  return obj;
}

const center = rows[index];
const x0 = center[9];
const y0 = center[10];

console.log("---------------------------- Reference Row");
console.log(rowToObject(center));
console.log("---------------------------- Reference Row");

// === Euklidische Distanz und Filter ===
const result = rows.filter((row) => {
  //console.log("row is", row);
  const dx = row[9] - x0;
  const dy = row[10] - y0;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance <= radius;
});

// === Ergebnis ausgeben ===
result.forEach((row) => {
  console.log(row.slice(-2).join(","));
  console.log(rowToObject(row));
});
