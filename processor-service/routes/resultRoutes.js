const express = require('express');
const router = express.Router();
const storage = require('../storage');

/**
 * @openapi
 * components:
 *   schemas:
 *     WeatherResult:
 *       type: object
 *       properties:
 *         city:
 *           type: string
 *           example: Tel Aviv
 *         data:
 *           type: string
 *           example: The weather in Tel Aviv is sunny!
 */

/**
 * @openapi
 * /weather/result:
 *   get:
 *     summary: Get processed weather result for a city
 *     tags:
 *       - Weather
 *     parameters:
 *       - in: query
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         example: Tel Aviv
 *     responses:
 *       200:
 *         description: Weather result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WeatherResult'
 *       400:
 *         description: Missing required input
 *       404:
 *         description: Data not ready or city not found
 */
router.get('/result', (req, res) => {
  const city = typeof req.query.city === 'string' ? req.query.city.trim() : '';
  if (!city) return res.status(400).json({ error: 'city query param is required' });

  const result = storage.getResult(city);
  if (!result) return res.status(404).json({ message: 'Data not ready or city not found' });

  return res.json(result);
});

module.exports = router;
