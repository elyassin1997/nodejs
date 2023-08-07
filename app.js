const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000; // Change this to the desired port number

app.use(express.json());

app.get('/capture-data', async (req, res) => {
  try {
    // Simulate captured data from the GET request query parameters
    const capturedData = req.query.key;
    console.log(capturedData);
    // Make an HTTP request to another URL using the captured data
    const response = await axios.get(`http://localhost/api/fetch.php/?${capturedData}`);

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

