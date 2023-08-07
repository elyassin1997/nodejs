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


/**Magic Start Here */



const clients = []; // Array to store Client instances

// Endpoint to create new Client instance and store it in the array
app.get('/qrcode', (req, res) => {
    const clientId = generateClientId(); // You can implement your own unique ID generation logic

    const client = new Client({
        authStrategy: new LocalAuth({ clientId })
    });

    client.on('authenticated', () => {
        console.log(`Client ${clientId} authenticated`);
    });

    client.initialize();

    clients.push({ clientId, client });

    res.send(`Scan QR code for Client ${clientId}`);
});

// Function to generate a unique ID
function generateClientId() {
    return Math.random().toString(36).substr(2, 9); // Generate a random alphanumeric string
}

// Function to send a message from a specific client
function sendMessageFromClient(client, recipientPhoneNumber, messageText) {
    return client.sendMessage(recipientPhoneNumber, messageText);
}

// Example usage: Send a message from a specific client
app.get('/send-message/:clientId', (req, res) => {
    const clientId = req.params.clientId;
    const client = clients.find(c => c.clientId === clientId);

    if (client) {
        sendMessageFromClient(client.client, 'recipient_phone_number', 'Hello from your client!');
        res.send(`Message sent from Client ${clientId}`);
    } else {
        res.status(404).send(`Client ${clientId} not found`);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
