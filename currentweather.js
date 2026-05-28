import {
  getLatestSensorByCity,
  getAllSensors,
  loadSensors,
  getCityStatistics
} from "/sensors.js";

export function getSelectedCity() {
  const selected = document.querySelector('input[name="city"]:checked');
  return selected ? selected.value : null;
}

export function renderMinMaxAvg(){

  const city = getSelectedCity();
  if (!city) return;

  const container = document.getElementById("output_avg");
  if (!container) return;

  if (city === "all") {
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

  const dataX = getCityStatistics();
  const data = dataX[city]
  if (!data) {
    container.innerHTML = "<p>No data found</p>";
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

export function renderCurrentWeather() {

  const city = getSelectedCity();
  if (!city) return;

  const container = document.getElementById("output_currentweather");
  if (!container) return;

  if (city === "all") {

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

  const data = getLatestSensorByCity(city);

  if (!data) {
    container.innerHTML = "<p>No data found</p>";
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

export function initCurrentWeather() {
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

  renderCurrentWeather(); 

  renderMinMaxAvg()
}

loadSensors().then(initCurrentWeather);