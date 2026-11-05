require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');

const usuariosRoutes = require('./Apis/Usuarios');
const pagosRoutes = require('./Apis/Pagos');
const ejerciciosRoutes = require('./Apis/Ejercicios');
const climaRoutes = require('./Apis/Clima');

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: frontendUrl, methods: ['GET', 'POST'] }));
app.use(express.json({ limit: '20kb' }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { mensaje: 'Demasiados intentos. Esperá unos minutos y volvé a intentar.' },
});

app.use('/api/usuarios', authLimiter, usuariosRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/ejercicios', ejerciciosRoutes);
app.use('/api/clima', climaRoutes);

app.get('/api/salud', (req, res) => {
  res.json({ servicio: 'Zayeg Workout API', estado: 'ok' });
});

app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  return res.status(500).json({ mensaje: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Zayeg Workout API disponible en http://localhost:${PORT}`);
});
