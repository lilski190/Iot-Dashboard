import { loadSensors } from "./sensors.js";

import { initChart, renderTemperature } from "./dataCharts.js";

import {
  renderCurrentWeather,
  initCurrentWeather
} from "./currentweather.js";

import {
  renderPredictions,
  init
} from "./predictions.js";

import { cityColors } from "./config.js";

async function initApp() {
  console.log("init Loaded")

  // JSON laden
  await loadSensors();

  // Komponenten initialisieren
  initCurrentWeather();
  init();
  initChart();
 

  // optional initial render
  renderCurrentWeather();
  renderPredictions();
  renderTemperature();
}

console.log("🔥 MAIN.JS LOADED");
initApp();
