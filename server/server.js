// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS to allow requests from your React app
app.use(cors());

// Endpoint for fetching cinemas nearby from MovieGlu API
app.get('/api/cinemasNearby', async (req, res) => {
  try {
    const movieGluApiKey = process.env.REACT_APP_X_API_KEY;
    const movieGluBaseUrl = 'https://api.movieglu.com/v1';

    // Make a request to the MovieGlu API for cinemas nearby
    const response = await axios.get(`${movieGluBaseUrl}/cinemasNearby`, {
      headers: {
        'x-api-key': movieGluApiKey,
      },
      params: {
        lat: req.query.lat, // Pass latitude as a query parameter
        lon: req.query.lon, // Pass longitude as a query parameter
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
