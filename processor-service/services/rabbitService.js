const { createRabbitService } = require('@weather-system/rabbit-service');

const rabbit = createRabbitService({
  prefetch: 1
});

async function connectRabbit() {
  return rabbit.connect();
}

async function closeRabbit() {
  return rabbit.close();
}

function consumeWeatherRequests(onMessage) {
  return rabbit.consumeJson(onMessage, { requeueOnError: false });
}

module.exports = { connectRabbit, closeRabbit, consumeWeatherRequests };
