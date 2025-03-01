const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.get('/api/crypto-prices', async (req, res) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
    res.json(response.data); // Send the data to the frontend
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
