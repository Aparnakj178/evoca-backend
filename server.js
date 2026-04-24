const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Evoca backend running');
});

app.post('/send-sms', async (req, res) => {
  const { phone, name } = req.body;

  console.log('SMS REQUEST:', { phone, name });

  return res.json({
    success: true,
    message: 'SMS API test success',
  });
});

app.listen(5000, () => {
  console.log('Evoca backend running on http://localhost:5000');
});