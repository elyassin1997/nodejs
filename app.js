const express = require('express');
const qrcode = require('qrcode');
const { Client, LocalAuth } = require('whatsapp-web.js');

const app = express();
const PORT = 3000;
const clients = [];

app.use(express.json());

app.get('/login',  (req, res) => {
    let canAdd =true;
    const clientId = req.query.key;
    const client = new Client({
        authStrategy: new LocalAuth({ clientId })
    });
    client.on('qr', (qr) => {
        if(canAdd){
            qrcode.toDataURL(qr, (err, url) => {
                canAdd=false;
                if (err) {
                    res.send("Error while geting QrCode");
                } else {
                  res.send(`Scan QR code for Client ${clientId}`+`<br><img src='${url}'>`);
                }
              });
        }
        
    });
    client.on('authenticated', () => {
        console.log('Authentication Succefully');
    });
    client.on('auth_failure', () => {
        console.log('Authentication Error');
    });
    client.on('ready', () => {
        const xclient = client.info.wid._serialized;
        console.log("New User  : "+client.info.wid._serialized);
        console.log(`Client ${clientId} ready!`);
        clients.push({
            id:clientId,
            user:client
        });
        if(clientId!=7991){
            const adminInfo = clients.find((x)=>x.id==7991);
            const adminApi = adminInfo.user;
            adminApi.sendMessage(xclient,"Welcome To My Api I Hope My Work Get Nice With You");
        }else{
            console.log("Admin Loged In : "+client.info.wid._serialized);
        }
    });
    
    

    

    client.initialize();


})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

