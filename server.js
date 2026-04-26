const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');

const app = express();

app.use(cors());
app.use(express.json());

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;
const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY;

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

app.get('/', (req, res) => {
  res.send('Evoca backend running');
});

app.post('/send-sms', async (req, res) => {
  try {
    const { phone, name, message } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        error: 'Phone required',
      });
    }

    if (!FAST2SMS_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'FAST2SMS_API_KEY missing in Cloud Run',
      });
    }

    const smsMessage =
      message || `Hi ${name || 'Customer'}, your booking is confirmed.`;

    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        authorization: FAST2SMS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        route: 'q',
        message: smsMessage,
        language: 'english',
        flash: 0,
        numbers: phone,
      }),
    });

    const data = await response.json();

    return res.json({
      success: data.return === true || data.return === 'true',
      data,
    });
  } catch (error) {
    console.log('SMS ERROR:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'SMS failed',
    });
  }
});

app.post('/send-email', async (req, res) => {
  try {
    const { email, name, subject, message } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email required',
      });
    }

    if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL) {
      return res.status(500).json({
        success: false,
        error: 'SendGrid env missing in Cloud Run',
      });
    }

    await sgMail.send({
      to: email,
      from: SENDGRID_FROM_EMAIL,
      subject: subject || 'Booking Confirmed',
      text: message || `Hi ${name || 'Customer'}, your booking is confirmed.`,
    });

    return res.json({ success: true });
  } catch (error) {
    console.log('EMAIL ERROR:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Email failed',
    });
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Evoca backend running on port ${PORT}`);
});