const resultsByCity = new Map();

function setResult(city, data) {
  resultsByCity.set(city, { city, data });
}

function getResult(city) {
  return resultsByCity.get(city);
}

module.exports = { setResult, getResult };
