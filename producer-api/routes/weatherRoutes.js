const express = require('express');
const router = express.Router();
const { publishWeatherRequest } = require('../services/rabbitService');

/**
 * @openapi
 * components:
 *   schemas:
 *     WeatherRequest:
 *       type: object
 *       required:
 *         - city
 *       properties:
 *         city:
 *           type: string
 *           example: Tel Aviv
 */

/**
 * @openapi
 * /weather/request:
 *   post:
 *     summary: Request weather processing for a city
 *     description: Sends a message to RabbitMQ and returns immediately.
 *     tags:
 *       - Weather
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WeatherRequest'
 *     responses:
 *       202:
 *         description: Request accepted
 *       400:
 *         description: City is required
 *       500:
 *         description: Failed to send to queue
 */
router.post('/request', async (req, res) => {
  const { city } = req.body;

  if (typeof city !== 'string' || !city.trim()) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    publishWeatherRequest(city.trim());
    return res.status(202).json({ message: 'Request accepted and is being processed' });
  } catch (error) {
    if (error && error.message === 'Rabbit channel not initialized') {
      return res.status(503).json({ error: 'RabbitMQ unavailable' });
    }

    return res.status(500).json({ error: 'Failed to send to queue' });
  }
});

module.exports = router;
