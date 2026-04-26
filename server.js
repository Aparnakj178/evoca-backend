app.post('/send-sms', async (req, res) => {
  try {
    const { phone, name, message } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone is required' });
    }

    const smsMessage =
      message || `Hi ${name || 'Customer'}, your booking is confirmed.`;

    const params = new URLSearchParams({
      authorization: process.env.FAST2SMS_API_KEY,
      route: 'q',
      message: smsMessage,
      numbers: phone,
    });

    const response = await fetch(`https://www.fast2sms.com/dev/bulkV2?${params.toString()}`, {
      method: 'GET',
      headers: { accept: 'application/json' },
    });

    const data = await response.json();

    return res.json({ success: true, data });
  } catch (error) {
    console.log('SMS ERROR:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});