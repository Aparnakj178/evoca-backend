app.post('/send-sms', async (req, res) => {
  try {
    const { phone, name, message } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        error: 'Phone required',
      });
    }

    const smsMessage =
      message || `Hi ${name || 'Customer'}, your booking is confirmed.`;

    const response = await axios.post(
      'https://www.fast2sms.com/dev/bulkV2',
      {
        route: 'q',
        message: smsMessage,
        language: 'english',
        flash: 0,
        numbers: phone,
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.json({
      success: true,
      data: response.data,
    });

  } catch (error) {
    console.log('SMS ERROR:', error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});