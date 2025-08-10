#!/usr/bin/env node

/* as of now this is a standalone utility to work with the feature database */
/* here we introduce the angle as main search parameter, to opbtain a full 360 degree rotation more or less which would be a nice fit for walz but to expensive too much expensive*/
// rudimentary usage> node .\csvhelper2.js feature-database_by_fractalforums_org.csv 200 .005
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
  const center = rows[index];
  const x0 = center[9];
  const y0 = center[10];

  console.log("---------------------------- Reference Row");
  console.log(rowToObject(center));
  console.log("---------------------------- Reference Row");

  function getClosestNextRow(row) {
    function dist(row1, row2) {
      const dx = row1[9] - row2[9];
      const dy = row1[10] - row2[10];
      return Math.sqrt(dx * dx + dy * dy);
    }

    const result = rows
      .filter((it) => it[0] == row[0] - 1)
      .filter((it) => it[1] == "True")
      // .filter((it) => it[2] == row[2].split(" ").slice(0, -1).join(" "))
      .sort((it1, it2) => {
        // console.log("row is", it, dist(row, it));

        return dist(row, it1) - dist(row, it2);
      })[0];

    return result;
  }

  function outputGlsl(row) {
    var obj = rowToObject(row);
    return `vec3(${obj.realNucleus},${obj.imagNucleus},${
      obj.minibrotSize * 10.0
    }),`;
  }

  function getAngleDist(row1, row2) {
    return row1[7] - row2[7];
  }
  // Define a function named degrees_to_radians that converts degrees to radians.
  function degrees_to_radians(degrees) {
    // Store the value of pi.
    var pi = Math.PI;
    // Multiply degrees by pi divided by 180 to convert to radians.
    return degrees * (pi / 180);
  }
  var objCenter = rowToObject(center);
  console.log("Ok wir sind auf level", objCenter.period);
  console.log("und haben winkel", objCenter.orientationRadians);
  console.log("und arbeiten mit", objCenter);

  // filtern wir mal so nah wie moeglich an 10 grad away +

  rows
    .filter((it) => it[1] === "True")
    .filter((it) => it[0] < 13)
    .filter((it) => it[9] < -0.7)
    .filter((it) => it[9] > -0.8)
    .filter((it) => /** remove mirrors */ it[10] < 0)
    .forEach((it) => printJsStyle(it));
}
