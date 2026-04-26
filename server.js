app.post('/send-sms', async (req, res) => {
  try {
    const { phone, message } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone required' });
    }

    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        authorization: process.env.FAST2SMS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        route: 'q',
        message: message || 'Test SMS from Evoca',
        language: 'english',
        numbers: phone,
      }),
    });

    const data = await response.json();

    res.json({
      success: true,
      data,
    });

  } catch (error) {
    console.log('SMS ERROR:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});