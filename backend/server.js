import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import devicesRouter from './routes/devices.js';
import networkRouter from './routes/network.js';
import contentRouter from './routes/content.js';
import scheduleRouter from './routes/schedule.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Log de requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mikrotik: {
      host: process.env.MIKROTIK_HOST,
      port: process.env.MIKROTIK_PORT
    }
  });
});

// Rutas
app.use('/api/devices', devicesRouter);
app.use('/api/network', networkRouter);
app.use('/api/content', contentRouter);
app.use('/api/schedule', scheduleRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Backend corriendo en http://localhost:${PORT}`);
  console.log(`📡 MikroTik: ${process.env.MIKROTIK_HOST}:${process.env.MIKROTIK_PORT}`);
  console.log(`🔐 Usuario: ${process.env.MIKROTIK_USER}\n`);
});
