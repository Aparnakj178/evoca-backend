const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Evoca backend running');
});

app.post('/send-sms', async (req, res) => {
  return res.json({
    success: true,
    message: 'Fast2SMS route ready',
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Evoca backend running on port ${PORT}`);
});