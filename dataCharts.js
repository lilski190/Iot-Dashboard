import {
 getAllSensors,
 getSensorsByCity
} from "/sensors.js";

import { cityColors } from "./config.js";

let chart;
let chartH;
let chartB;

function getSelectedCity() {
  const selected = document.querySelector('input[name="city"]:checked');
  return selected ? selected.value : null;
}

export function renderTemperature() {

  const city = getSelectedCity();
  const canvas = document.getElementById("temperatureChart");

  if (!canvas) {
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

  chart = new Chart(ctx, {
    type: "line",
    data: { datasets },
    options: {
      parsing: true,
      responsive: true
    }
  });
}


export function renderHumidity() {

  const city = getSelectedCity();
  const canvas = document.getElementById("humidityChart");

  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d");

  if (chartH) chartH.destroy();

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
          y: d.humidity
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
        y: d.humidity
      })),
      borderColor: cityColors[city] || "#999999",
      backgroundColor: cityColors[city] || "#999999",

      borderWidth: 2,
      tension: 0.3
    }];
  }

  chartH = new Chart(ctx, {
    type: "line",
    data: { datasets },
    options: {
      parsing: true,
      responsive: true
    }
  });

}


export function renderBubbles() {
  const city = getSelectedCity();
  const canvas = document.getElementById("bubbleChart");

  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d");

  if (chartB) chartB.destroy();

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
          x: d.temperature,   
          y: d.humidity,      
          r: 8                
        })),

        backgroundColor: cityColors[c] || "#999999",
        borderColor: cityColors[c] || "#999999",
        borderWidth: 1
      };
    });

  } else {

    const data = getSensorsByCity(city);

    datasets = [{
      label: city,

      data: data.map(d => ({
        x: d.temperature,
        y: d.humidity,
        r: 8
      })),

      backgroundColor: cityColors[city] || "#999999",
      borderColor: cityColors[city] || "#999999",
      borderWidth: 1
    }];
  }

  chartB = new Chart(ctx, {
    type: "bubble",

    data: {
      datasets
    },

    options: {
      responsive: true,

      scales: {
        x: {
          title: {
            display: true,
            text: "Temperature (°C)"
          }
        },

        y: {
          title: {
            display: true,
            text: "Humidity (%)"
          }
        }
      },

      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Temp: ${context.raw.x}°C | Humidity: ${context.raw.y}%`;
            }
          }
        }
      }
    }
  });

}

export function initChart() {

  document.querySelectorAll('input[name="city"]').forEach(radio => {
    radio.addEventListener("change", () => {
      renderTemperature();
      renderHumidity();
      renderBubbles();
  
    });
  });
  

  renderTemperature();
  renderHumidity();
  renderBubbles();
}