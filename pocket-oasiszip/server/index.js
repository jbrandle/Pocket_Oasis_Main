import express from 'express';
import { createServer as createViteServer } from 'vite';

const app = express();
app.use(express.json());

app.post('/api/verify-admin', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.VITE_ADMIN_PASSWORD;

  if (!adminPassword) {
    return res.status(500).json({ success: false, error: 'Admin password not configured' });
  }

  if (password === adminPassword) {
    return res.json({ success: true });
  }

  return res.status(401).json({ success: false, error: 'Access denied. Invalid authorization code.' });
});

async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(5000, '0.0.0.0', () => {
    console.log('Server running on port 5000');
  });
}

startServer();
