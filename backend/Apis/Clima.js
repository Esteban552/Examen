const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);

  if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lon) || lon < -180 || lon > 180) {
    return res.status(400).json({ mensaje: 'Las coordenadas enviadas no son válidas.' });
  }
  if (!process.env.OPENWEATHER_API_KEY) {
    return res.status(503).json({ mensaje: 'Configurá OPENWEATHER_API_KEY en el archivo .env del backend.' });
  }

  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    appid: process.env.OPENWEATHER_API_KEY,
    units: 'metric',
    lang: 'es',
  });

  const respuesta = await fetch(`https://api.openweathermap.org/data/2.5/weather?${params}`, {
    signal: AbortSignal.timeout(8000),
  });

  if (!respuesta.ok) {
    const status = respuesta.status === 401 ? 503 : 502;
    return res.status(status).json({ mensaje: respuesta.status === 401 ? 'La clave de OpenWeather no es válida.' : 'OpenWeather no respondió correctamente.' });
  }

  const datos = await respuesta.json();
  return res.json({
    ciudad: datos.name,
    pais: datos.sys.country,
    temperatura: datos.main.temp,
    sensacion: datos.main.feels_like,
    humedad: datos.main.humidity,
    viento: datos.wind.speed,
    descripcion: datos.weather[0].description,
    icono: datos.weather[0].icon,
  });
});

module.exports = router;
