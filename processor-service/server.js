const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const { connectRabbit, closeRabbit } = require('./services/rabbitService');
const { startConsumer } = require('./consumer');

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3001;

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Weather Processor Service',
      version: '1.0.0'
    },
    servers: [
      {
        url: `http://localhost:${PORT}`
      }
    ]
  },
  apis: [path.join(__dirname, 'routes', 'resultRoutes.js')]
});

app.get('/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/weather', require('./routes/resultRoutes'));

const server = app.listen(PORT, async () => {
  console.log(`Processor service running on http://localhost:${PORT}`);

  try {
    await connectRabbit();
    startConsumer();
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
  }
});

let isShuttingDown = false;
async function shutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`\nReceived ${signal}. Shutting down gracefully...`);

  await new Promise((resolve) => server.close(resolve));
  await closeRabbit();

  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
