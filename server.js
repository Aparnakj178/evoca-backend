const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;  // ← MUST be here

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Evoca backend running');
});

app.post('/send-sms', async (req, res) => {
  const { phone, name } = req.body;
  console.log('SMS REQUEST:', { phone, name });
  return res.json({ success: true, message: 'SMS API test success' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Evoca backend running on port ${PORT}`);
});