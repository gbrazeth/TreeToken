// Simple webhook server for Alchemy notifications
const express = require('express');
const app = express();
app.use(express.json());

app.post('/alchemy-webhook', (req, res) => {
  console.log('=== Alchemy Webhook Notification Received ===');
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200).send('ok');
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Webhook server listening on port ${PORT}`));
