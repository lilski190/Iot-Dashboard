let sensors = [];

export async function loadSensors() {
  try {
    const res = await fetch("/sensor_readings.json");
    sensors = await res.json();
  } catch (err) {
    console.error("Error when loading data", err);
  }
}

export function getAllSensors() {
  return sensors;
}

export function getSensorsByCity(city) {
  return sensors.filter(item => item.location === city);
}

export function getLatestSensorByCity(city) {
  const filtered = getSensorsByCity(city);

  if (filtered.length === 0) return null;

  return filtered.reduce((latest, current) => {
    return new Date(current.timestamp) > new Date(latest.timestamp)
      ? current
      : latest;
  });
}

export function getCityStatistics() {
  const stats = {};
  sensors.forEach(sensor => {
    const city = sensor.location;

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

    if (sensor.temperature < stats[city].temperature.min.value) {
      stats[city].temperature.min = {
        value: sensor.temperature,
        date: sensor.timestamp
      };
    }

    if (sensor.temperature > stats[city].temperature.max.value) {
      stats[city].temperature.max = {
        value: sensor.temperature,
        date: sensor.timestamp
      };
    }

    if (sensor.humidity < stats[city].humidity.min.value) {
      stats[city].humidity.min = {
        value: sensor.humidity,
        date: sensor.timestamp
      };
    }

    if (sensor.humidity > stats[city].humidity.max.value) {
      stats[city].humidity.max = {
        value: sensor.humidity,
        date: sensor.timestamp
      };
    }

    stats[city].temperature.sum += sensor.temperature;
    stats[city].humidity.sum += sensor.humidity;

    stats[city].count++;
  });


Object.keys(stats).forEach(city => {
  stats[city].temperature.avg = Number(
    (stats[city].temperature.sum / stats[city].count).toFixed(2)
  );

  stats[city].humidity.avg = Number(
    (stats[city].humidity.sum / stats[city].count).toFixed(2)
  );

  delete stats[city].temperature.sum;
  delete stats[city].humidity.sum;
});

  return stats;
}

export function compareCitiesByDate(date) {

  return sensors.filter(sensor =>
    sensor.timestamp === date
  );
}