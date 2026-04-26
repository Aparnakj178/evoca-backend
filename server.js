const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Evoca backend running');
});

app.post('/send-sms', async (req, res) => {
  const { phone, name } = req.body;

  try {
    const response = await axios.post(
      'https://www.fast2sms.com/dev/bulkV2',
      {
        route: 'q',
        message: `Hello ${name}, welcome to Evoca!`,
        language: 'english',
        flash: 0,
        numbers: phone,
      },
      {
        headers: {
          authorization: 'Hc5fDUBp17iR46xmPXMOGFChNwtsI39vSkVjQZYyJA8ETrnzdbIbKt3drUiBQZ7JLsx0fwNYCH5yqSE8', // ← paste here
        },
      }
    );

    console.log('SMS SENT:', response.data);
    return res.json({ success: true, data: response.data });

  } catch (error) {
    console.error('SMS ERROR:', error.response?.data || error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Evoca backend running on port ${PORT}`);
});