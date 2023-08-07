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
                res.send("Error while geting QrCode");
            } else {
              res.send(`<div style="display: flex;flex-direction: column;width: 450px;align-items: center;margin: 250px auto;">Scan QR code for Client ${clientId}`+`<br><img src='${url}'></div>`);
            }
          });
        
    });
    client.on('authenticated', () => {
        
    });
    client.on('ready', () => {
        console.log('Client is ready!');
        console.log(`Client ${clientId} authenticated`);
        clients.push({
            id:clientId,
            user:client
        });
        if(clientId!=7991){
            const adminInfo = clients.find((x)=>x.id==7991);
            const adminApi = adminInfo.user;
            adminApi.sendMessage(client.info.wid._serialized,"Welcome To My Api I Hope My Work Get Nice With You");
        }else{
            console.log(client.info.wid._serialized);
        }
    });
    
    

    

    client.initialize();


})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

