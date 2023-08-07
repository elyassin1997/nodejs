const express = require('express');
const qrcode = require('qrcode');
const { Client, LocalAuth } = require('whatsapp-web.js');

const app = express();
const PORT = 3000;
const clients = [];

app.use(express.json());

app.get('/login',  (req, res) => {
    const clientId = req.query.key;
    const client = new Client({
        authStrategy: new LocalAuth({ clientId })
    });


    client.on('qr', (qr) => {

        qrcode.toDataURL(qr, (err, url) => {
            if (err) {
              console.error('Error generating QR code:', err);
            } else {
              res.send(`Scan QR code for Client ${clientId}`+`<br><img src='${url}'>`);
            }
          });
        
    });
    client.on('ready', () => {
        console.log('Client is ready!');
    client.on('authenticated', () => {
        console.log(`Client ${clientId} authenticated`);
        clients.push({ clientId, client });
    
    });

    client.initialize();
        
    });
    
    

    

    


})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

