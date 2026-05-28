import { loadSensors } from "./sensors.js";

import { initChart, renderTemperature, renderHumidity, renderBubbles } from "./dataCharts.js";

import {
  renderCurrentWeather,
  initCurrentWeather
} from "./currentweather.js";

import {
  renderPredictions,
  init
} from "./predictions.js";

import { renderCompareByDate, initCompareByDate } from "./compare.js";

import { cityColors } from "./config.js";

async function initApp() {

  await loadSensors();

  initCurrentWeather();
  init();
  initChart();
  initCompareByDate();
 
  renderCurrentWeather();
  renderPredictions();
  renderTemperature();
  renderHumidity();
  renderBubbles();
  renderCompareByDate();
}

initApp();
