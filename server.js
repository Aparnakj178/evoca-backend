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
  console.log('API KEY EXISTS:', !!process.env.FAST2SMS_API_KEY);
  try {
    const response = await axios.get(
      'https://www.fast2sms.com/dev/bulkV2',
      {
        params: {
          authorization: process.env.FAST2SMS_API_KEY,
          route: 'q',
          message: `Hello ${name}, welcome to Evoca!`,
          language: 'english',
          flash: 0,
          numbers: phone,
        }
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