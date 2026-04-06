// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendEmail } from './email.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Email endpoint
app.post('/send-email', async (req, res) => {
  const { email, subdomain, order_id } = req.body;

  if (!email || !subdomain || !order_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await sendEmail({ email, subdomain, order_id });
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});