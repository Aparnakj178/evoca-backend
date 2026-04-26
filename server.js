app.post('/send-sms', async (req, res) => {
  const { phone, name } = req.body;

  console.log('API KEY EXISTS:', !!process.env.FAST2SMS_API_KEY);

  try {
    const response = await axios.get(        // ← changed to GET
      'https://www.fast2sms.com/dev/bulkV2',
      {
        params: {                             // ← changed to params
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