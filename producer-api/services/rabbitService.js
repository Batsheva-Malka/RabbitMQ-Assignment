const { createRabbitService } = require('@weather-system/rabbit-service');

const rabbit = createRabbitService();

async function connectRabbit() {
  return rabbit.connect();
}

async function closeRabbit() {
  return rabbit.close();
}

function publishWeatherRequest(city) {
  return rabbit.publishJson({ city });
}

module.exports = { connectRabbit, closeRabbit, publishWeatherRequest };
