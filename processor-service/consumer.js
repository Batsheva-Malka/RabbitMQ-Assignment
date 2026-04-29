const storage = require('./storage');
const { consumeWeatherRequests } = require('./services/rabbitService');

function startConsumer() {
  consumeWeatherRequests(async (message) => {
    const city = message && typeof message.city === 'string' ? message.city.trim() : '';
    if (!city) {
      console.warn('Invalid message received (missing/invalid city):', message);
      return;
    }

    const data = `The weather in ${city} is sunny!`;
    storage.setResult(city, data);
  });
}

module.exports = { startConsumer };
