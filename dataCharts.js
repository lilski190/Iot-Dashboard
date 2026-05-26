import {
 getAllSensors,
 getSensorsByCity
} from "/sensors.js";

import { cityColors } from "./config.js";

let chart;

console.log("📊 dataCharts.js loaded");

// Stadt holen
function getSelectedCity() {
  const selected = document.querySelector('input[name="city"]:checked');
  return selected ? selected.value : null;
}

export function renderTemperature() {
  console.log("🔥 renderTemperature called");

  const city = getSelectedCity();
  console.log("selected city:", city);

  const canvas = document.getElementById("temperatureChart");

  if (!canvas) {
    console.log("❌ canvas not found");
    return;
  }

  const ctx = canvas.getContext("2d");

  if (chart) chart.destroy();

  let datasets = [];

  if (city === "all") {

    const cities = [...new Set(
      getAllSensors().map(d => d.location)
    )];

    datasets = cities.map(c => {
      const data = getSensorsByCity(c);

      return {
        label: c,
        data: data.map(d => ({
          x: d.timestamp,
          y: d.temperature
        })),
        borderColor: cityColors[c] || "#999999",
        backgroundColor: cityColors[c] || "#999999",

        borderWidth: 2,
        tension: 0.3
      };
    });

  } else {

    const data = getSensorsByCity(city);

    datasets = [{
      label: city,
      data: data.map(d => ({
        x: d.timestamp,
        y: d.temperature
      })),
      borderColor: cityColors[city] || "#999999",
      backgroundColor: cityColors[city] || "#999999",

      borderWidth: 2,
      tension: 0.3
    }];
  }

  console.log("datasets:", datasets);

  chart = new Chart(ctx, {
    type: "line",
    data: { datasets },
    options: {
      parsing: true,
      responsive: true
    }
  });

  console.log("✅ chart rendered");
}

export function initChart() {

  console.log("🚀 initChart called");

  document.querySelectorAll('input[name="city"]').forEach(radio => {
    radio.addEventListener("change", () => {
      console.log("📡 radio changed");
      renderTemperature();
    });
  });

  renderTemperature();
}