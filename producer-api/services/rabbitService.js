const { createRabbitService } = require('@weather-system/rabbit-service');

const rabbit = createRabbitService({ confirmPublish: true });

async function connectRabbit() {
  return rabbit.connect();
}

async function closeRabbit() {
  return rabbit.close();
}

async function publishWeatherRequest(city) {
  return rabbit.publishJson({ city });
}

module.exports = { connectRabbit, closeRabbit, publishWeatherRequest };
