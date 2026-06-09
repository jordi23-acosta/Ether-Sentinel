import express from 'express';

const router = express.Router();

/**
 * NOTA: Los horarios se pueden implementar de dos formas:
 * 
 * 1. Guardar en una BD local (SQLite/JSON) y ejecutar un cron job que 
 *    active/desactive reglas del firewall según el horario
 * 
 * 2. Usar scripts de MikroTik con /system/scheduler para programar
 *    activación/desactivación de reglas
 * 
 * Por ahora dejamos endpoints básicos para guardar/leer horarios
 * en memoria (se pierden al reiniciar). Para producción, usar BD.
 */

// Almacenamiento temporal en memoria
let schedules = {
  '08:00': [false, false, false, false, false, false, false],
  '09:00': [true,  true,  true,  true,  true,  false, false],
  '10:00': [true,  true,  true,  true,  true,  true,  true ],
  '11:00': [true,  true,  true,  true,  true,  true,  true ],
  '12:00': [false, false, false, false, false, false, false],
  '13:00': [true,  true,  true,  true,  true,  false, false],
  '14:00': [true,  true,  true,  true,  true,  false, false],
  '15:00': [true,  true,  true,  true,  true,  false, false],
  '16:00': [true,  true,  true,  true,  true,  false, false],
  '17:00': [false, false, false, false, false, false, false],
};

/**
 * GET /api/schedule
 * Obtiene el horario actual
 */
router.get('/', (req, res) => {
  res.json(schedules);
});

/**
 * PUT /api/schedule
 * Actualiza el horario completo
 */
router.put('/', (req, res) => {
  const { schedule } = req.body;

  if (!schedule || typeof schedule !== 'object') {
    return res.status(400).json({ error: 'Formato de horario inválido' });
  }

  schedules = schedule;

  res.json({ 
    success: true, 
    message: 'Horario actualizado correctamente',
    schedule: schedules 
  });
});

/**
 * PATCH /api/schedule/:hour/:day
 * Alterna una celda específica del horario
 */
router.patch('/:hour/:day', (req, res) => {
  const { hour, day } = req.params;
  const dayIndex = parseInt(day);

  if (!schedules[hour]) {
    return res.status(404).json({ error: 'Hora no encontrada' });
  }

  if (dayIndex < 0 || dayIndex > 6) {
    return res.status(400).json({ error: 'Día inválido (0-6)' });
  }

  schedules[hour][dayIndex] = !schedules[hour][dayIndex];

  res.json({ 
    success: true, 
    hour,
    day: dayIndex,
    active: schedules[hour][dayIndex]
  });
});

export default router;
