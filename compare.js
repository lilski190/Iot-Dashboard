// compare.js

import {
  loadSensors,
  compareCitiesByDate
} from "/sensors.js";

/**
 * Rendert den Vergleich aller Städte
 * für ein ausgewähltes Datum
 */
export function renderCompareByDate() {

  console.log("Render compare by date");

  const dateInput = document.getElementById("compare_date");
  const container = document.getElementById("output_compare");

  if (!dateInput || !container) return;

  const selectedDate = dateInput.value;

  // Kein Datum gewählt
  if (!selectedDate) {
    container.innerHTML = `
      <p>Bitte ein Datum auswählen</p>
    `;
    return;
  }

  const data = compareCitiesByDate(selectedDate);

  // Keine Daten gefunden
  if (!data || data.length === 0) {
    container.innerHTML = `
      <p>There is no weather data at this date</p>
    `;
    return;
  }

  // Nach Temperatur sortieren
  data.sort((a, b) => b.temperature - a.temperature);

  container.innerHTML = `
    <h3>Selected Date: ${selectedDate}</h3>

    <div class="card-wrapper">
      ${data.map(city => `
        <div class="card">
          <h4>${city.location}</h4>

          <p>
            Temperature:
            <strong>${city.temperature} °C</strong>
          </p>

          <p>
            Humidity:
            <strong>${city.humidity} %</strong>
          </p>
        </div>
      `).join("")}
    </div>
  `;
}

/**
 * Initialisiert den Datumsvergleich
 */
export function initCompareByDate() {

  console.log("Init compare by date");

  const dateInput = document.getElementById("compare_date");

  if (!dateInput) return;

  // bei Datumsänderung rendern
  dateInput.addEventListener(
    "change",
    renderCompareByDate
  );

  // optional: heutiges Datum setzen
  // dateInput.value = "2020-05-28";

  renderCompareByDate();
}

// START
loadSensors().then(initCompareByDate);