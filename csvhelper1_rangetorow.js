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
  if (!row) {
    return row;
  }
  const keys = [
    "period",
    "isMinibrot",
    "angledInternalAddress",
    "xlowerAngleNumerator",
    "xlowerAngleDenominator",
    "xupperAngleNumerator",
    "xupperAngleDenominator",
    "orientationRadians",
    "minibrotSize",
    "realNucleus",
    "imagNucleus",
  ];

  const obj = {};
  keys.forEach((key, i) => {
    if (key[0] != "x") {
      obj[key] = row[i];
    }
  });

  return obj;
}

function printJsStyle(it) {
  return console.log(
    `[${rowToObject(it).realNucleus},${rowToObject(it).imagNucleus},'${
      rowToObject(it).period
    }-${rowToObject(it).angledInternalAddress}',${
      rowToObject(it).minibrotSize
    },${rowToObject(it).orientationRadians}], `
  );
}
function printGlslStyle(it) {
  var obj = rowToObject(it);
  return console.log(
    `vec4(${obj.orientationRadians},${obj.minibrotSize},${obj.realNucleus},${obj.imagNucleus}), `
  );
}
const center = rows[index];
const x0 = center[9];
const y0 = center[10];

function printJsStyle(it) {
  return console.log(
    `[${rowToObject(it).realNucleus},${rowToObject(it).imagNucleus},'${
      rowToObject(it).period
    }-${rowToObject(it).angledInternalAddress}',${
      rowToObject(it).minibrotSize
    },${rowToObject(it).orientationRadians}], `
  );
}
console.log("---------------------------- Reference Row");
console.log(rowToObject(center));
console.log(printGlslStyle(center));
console.log("---------------------------- /Reference Row");

// === Euklidische Distanz und Filter ===
const result = rows
  .filter((it) => /** remove mirrors */ it[10] < 0)
  .filter((it) => /** remove periods of choice */ it[0] < 8)
  .filter((row) => {
    //console.log("row is", row);
    const dx = row[9] - x0;
    const dy = row[10] - y0;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= radius;
  });

// === Ergebnis ausgeben ===
result.forEach((row) => {
  var obj = rowToObject(row);
  console.log(`${obj.period} ${obj.angledInternalAddress}`);
  console.log(printGlslStyle(row));
});
