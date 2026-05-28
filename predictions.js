let predictions = [];

export async function loadPredictions() {
  try {
    const res = await fetch("./predictions.json");
    predictions = await res.json();
  } catch (err) {
        console.error("Error when loading data", err);
  }
}

export function getSelectedCity() {
  const selected = document.querySelector('input[name="city"]:checked');
  return selected ? selected.value : null;
}

export function renderPredictions() {
  const city = getSelectedCity();
  if (!city) return;

  const container = document.getElementById("output_prediction");
  if (!container) return;

  if (city === "all") {
    container.innerHTML = `
      <div class="card-wrapper">
        ${predictions.map(item => `
          <div class="card">
            <h3>${item.city}</h3>
            <p>Date: ${item.next_date}</p>
            <p>Temperature: ${item.pred_temp} °C</p>
            <p>Humidity: ${item.pred_hum} %</p>
            <p>Comfort: ${item.comfort}</p>
          </div>
        `).join("")}
      </div>
    `;
    return;
  }

  const result = predictions.find(item => item.city === city);

  if (!result) {
    container.innerHTML = "<p>No data found</p>";
    return;
  }

  container.innerHTML = `
    <div class="card">
      <h3>${result.city}</h3>
      <p>Date: ${result.next_date}</p>
      <p>Temperature: ${result.pred_temp} °C</p>
      <p>Humidity: ${result.pred_hum} %</p>
      <p>Comfort: ${result.comfort}</p>
    </div>
  `;
}

export function init() {
  const allRadio = document.querySelector('input[name="city"][value="all"]');
  if (allRadio) {
    allRadio.checked = true;
  }

  document.querySelectorAll('input[name="city"]').forEach(radio => {
    radio.addEventListener("change", renderPredictions);
  });

  renderPredictions();
}

loadPredictions().then(init);