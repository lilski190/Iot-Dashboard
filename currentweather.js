import {
  getLatestSensorByCity,
  getAllSensors,
  loadSensors,
  getCityStatistics
} from "/sensors.js";

// ausgewählte Stadt holen
export function getSelectedCity() {
  const selected = document.querySelector('input[name="city"]:checked');
  return selected ? selected.value : null;
}

export function renderMinMaxAvg(){
   console.log("Render avg weather")

  const city = getSelectedCity();
  if (!city) return;

  const container = document.getElementById("output_avg");
  if (!container) return;

  // ALL CITIES
  if (city === "all") {

    // eindeutige Städte holen
    const cities = [...new Set(
      getAllSensors().map(item => item.location)
    )];

    container.innerHTML = `
      <div class="card-wrapper">
        ${cities.map(cityName => {

          const data = getCityStatistics();

          if (!data) return "";

          return `
            <div class="card">
              <h3>${cityName}</h3>
             <h4> Temperature: </h4>
              <p>Avg: ${data[cityName].temperature.avg} °C</p>
              <p>Min: ${data[cityName].temperature.min.value} °C <i> Date: ${data[cityName].temperature.min.date} </i></p>
              <p>Max: ${data[cityName].temperature.max.value} °C <i> Date: ${data[cityName].temperature.max.date} </i></p>
              
              <h4>Humidity </h4>
              <p>Avg: ${data[cityName].humidity.avg} %</p>
              <p>Min: ${data[cityName].humidity.min.value} % <i> Date: ${data[cityName].humidity.min.date} </i></p>
              <p>Max: ${data[cityName].humidity.max.value} % <i> Date: ${data[cityName].humidity.max.date} </i></p>
              
            </div>
          `;
        }).join("")}
      </div>
    `;

    return;
  }

  // EINZELNE STADT
  const dataX = getCityStatistics();
console.log("data x", dataX)
  const data = dataX[city]
console.log("Avg für ein city", data)
  if (!data) {
    container.innerHTML = "<p>Keine Daten gefunden</p>";
    return;
  }

  container.innerHTML = `
    <div class="card">
      <h3>${city}</h3>
      <h4> Temperature: </h4>
      <p>Avg: ${data.temperature.avg} °C</p>
      <p>Min: ${data.temperature.min.value} °C <i> Date: ${data.temperature.min.date} </i></p>
      <p>Max: ${data.temperature.max.value} °C <i> Date: ${data.temperature.max.date} </i></p>
      
      <h4>Humidity </h4>
      <p>Avg: ${data.humidity.avg} %</p>
      <p>Min: ${data.humidity.min.value} % <i> Date: ${data.humidity.min.date} </i></p>
      <p>Max: ${data.humidity.max.value} % <i> Date: ${data.humidity.max.date} </i></p>
      
    </div>
  `;
}
// rendern
export function renderCurrentWeather() {

  console.log("Render current weather")

  const city = getSelectedCity();
  if (!city) return;

  const container = document.getElementById("output_currentweather");
  if (!container) return;

  // ALL CITIES
  if (city === "all") {

    // eindeutige Städte holen
    const cities = [...new Set(
      getAllSensors().map(item => item.location)
    )];

    container.innerHTML = `
      <div class="card-wrapper">
        ${cities.map(cityName => {

          const data = getLatestSensorByCity(cityName);

          if (!data) return "";

          return `
            <div class="card">
              <h3>${data.location}</h3>
              <p>Date: ${data.timestamp}</p>
              <p>Temperature: ${data.temperature} °C</p>
              <p>Humidity: ${data.humidity} %</p>
            </div>
          `;
        }).join("")}
      </div>
    `;

    return;
  }

  // EINZELNE STADT
  const data = getLatestSensorByCity(city);

  if (!data) {
    container.innerHTML = "<p>Keine Daten gefunden</p>";
    return;
  }

  container.innerHTML = `
    <div class="card">
      <h3>${data.location}</h3>
      <p>Date: ${data.timestamp}</p>
      <p>Temperature: ${data.temperature} °C</p>
      <p>Humidity: ${data.humidity} %</p>
    </div>
  `;
}

// init
export function initCurrentWeather() {
console.log("innit current weather")
  const allRadio = document.querySelector(
    'input[name="city"][value="all"]'
  );

  if (allRadio) {
    allRadio.checked = true;
  }

  document.querySelectorAll('input[name="city"]').forEach(radio => {
    radio.addEventListener("change", renderCurrentWeather);
  });

  document.querySelectorAll('input[name="city"]').forEach(radio => {
    radio.addEventListener("change", renderMinMaxAvg);
  });

  renderCurrentWeather(); // initial render

  renderMinMaxAvg()
}

// START
loadSensors().then(initCurrentWeather);