let sensors = [];

/**
 * Lädt die Sensor-Daten aus der JSON Datei
 */
export async function loadSensors() {
  try {
    const res = await fetch("/sensor_readings.json");
    sensors = await res.json();
  } catch (err) {
    console.error("Fehler beim Laden der Sensor-Daten:", err);
  }
}

/**
 * Gibt alle Sensor-Daten zurück
 */
export function getAllSensors() {
  return sensors;
}

/**
 * Gibt die Daten einer bestimmten Stadt zurück
 */
export function getSensorsByCity(city) {
  return sensors.filter(item => item.location === city);
}

/**
 * Gibt den neuesten Sensorwert einer Stadt zurück
 */
export function getLatestSensorByCity(city) {
  const filtered = getSensorsByCity(city);

  if (filtered.length === 0) return null;

  return filtered.reduce((latest, current) => {
    return new Date(current.timestamp) > new Date(latest.timestamp)
      ? current
      : latest;
  });
}

/**
 * Berechnet Min, Max und Durchschnittswerte pro Stadt
 */
export function getCityStatistics() {
  const stats = {};
  console.log("Calculate Min, max avg")

  sensors.forEach(sensor => {
    const city = sensor.location;

    // Stadt initialisieren
    if (!stats[city]) {
      stats[city] = {
        temperature: {
          min: {
            value: sensor.temperature,
            date: sensor.timestamp
          },
          max: {
            value: sensor.temperature,
            date: sensor.timestamp
          },
          sum: 0,
          avg: 0
        },
        humidity: {
          min: {
            value: sensor.humidity,
            date: sensor.timestamp
          },
          max: {
            value: sensor.humidity,
            date: sensor.timestamp
          },
          sum: 0,
          avg: 0
        },
        count: 0
      };
    }

    // Temperatur MIN
    if (sensor.temperature < stats[city].temperature.min.value) {
      stats[city].temperature.min = {
        value: sensor.temperature,
        date: sensor.timestamp
      };
    }

    // Temperatur MAX
    if (sensor.temperature > stats[city].temperature.max.value) {
      stats[city].temperature.max = {
        value: sensor.temperature,
        date: sensor.timestamp
      };
    }

    // Luftfeuchtigkeit MIN
    if (sensor.humidity < stats[city].humidity.min.value) {
      stats[city].humidity.min = {
        value: sensor.humidity,
        date: sensor.timestamp
      };
    }

    // Luftfeuchtigkeit MAX
    if (sensor.humidity > stats[city].humidity.max.value) {
      stats[city].humidity.max = {
        value: sensor.humidity,
        date: sensor.timestamp
      };
    }

    // Summen für Durchschnitt
    stats[city].temperature.sum += sensor.temperature;
    stats[city].humidity.sum += sensor.humidity;

    stats[city].count++;
  });

 // Durchschnitt berechnen
Object.keys(stats).forEach(city => {
  stats[city].temperature.avg = Number(
    (stats[city].temperature.sum / stats[city].count).toFixed(2)
  );

  stats[city].humidity.avg = Number(
    (stats[city].humidity.sum / stats[city].count).toFixed(2)
  );

  // Summe entfernen
  delete stats[city].temperature.sum;
  delete stats[city].humidity.sum;
});

  console.log("stats:", stats)

  return stats;
}