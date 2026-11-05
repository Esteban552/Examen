const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');

const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,72}$/;

router.post('/registro', async (req, res) => {
  const nombre = typeof req.body.nombre === 'string' ? req.body.nombre.trim() : '';
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  const idPlan = Number(req.body.id_plan);

  if (nombre.length < 3 || nombre.length > 100) {
    return res.status(400).json({ mensaje: 'El nombre debe tener entre 3 y 100 caracteres.' });
  }
  if (!emailPattern.test(email) || email.length > 150) {
    return res.status(400).json({ mensaje: 'Ingresá un correo electrónico válido.' });
  }
  if (!passwordPattern.test(password)) {
    return res.status(400).json({ mensaje: 'La contraseña debe tener entre 8 y 72 caracteres, mayúscula, minúscula y número.' });
  }
  if (![1, 2, 3].includes(idPlan)) {
    return res.status(400).json({ mensaje: 'El plan seleccionado no es válido.' });
  }

  const [usuarios] = await db.query('SELECT id FROM usuarios WHERE email = ? LIMIT 1', [email]);
  if (usuarios.length) {
    return res.status(409).json({ mensaje: 'El correo ya está registrado.' });
  }

  const diasPorPlan = { 1: 30, 2: 90, 3: 180 };
  const fechaVencimiento = new Date();
  fechaVencimiento.setDate(fechaVencimiento.getDate() + diasPorPlan[idPlan]);
  const passwordHash = await bcrypt.hash(password, 12);

  await db.query(
    'INSERT INTO usuarios (nombre, email, password, id_plan, fecha_vencimiento) VALUES (?, ?, ?, ?, ?)',
    [nombre, email, passwordHash, idPlan, fechaVencimiento],
  );

  return res.status(201).json({ mensaje: 'Usuario registrado con éxito. Ya podés iniciar sesión.' });
});

router.post('/login', async (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  if (!emailPattern.test(email) || !password) {
    return res.status(400).json({ mensaje: 'Ingresá correo y contraseña válidos.' });
  }

  const [usuarios] = await db.query(
    'SELECT id, nombre, email, password, id_plan FROM usuarios WHERE email = ? LIMIT 1',
    [email],
  );
  const usuario = usuarios[0];
  const credencialesValidas = usuario ? await bcrypt.compare(password, usuario.password) : false;

  if (!credencialesValidas) {
    return res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
  }

  return res.json({
    mensaje: 'Login exitoso.',
    usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, plan: usuario.id_plan },
  });
});

module.exports = router;
