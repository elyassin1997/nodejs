const express = require('express');
const qrcode = require('qrcode');
const { Client} = require('whatsapp-web.js');

const app = express();
const PORT = 3000;
const clients = [];

app.use(express.json());

app.get('/',  (req, res) => {
    res.send('OK!');
})
app.get('/login',  (req, res) => {
    let canAdd =true;
    const clientId = req.query.key;
    const client = new Client({
        authStrategy: new LocalAuth({ clientId }),
    });
    try{
    client.on('qr', (qr) => {
        console.log(`QrCode Ready For : ${clientId}`);
        if(canAdd){
            qrcode.toDataURL(qr, (err, url) => {
                canAdd=false;
                if (err) {
                    res.send("Error while geting QrCode");
                } else {
                  res.send(`Scan QR code for Client ${clientId}`+`<br><img src='${url}'>`);
                }
              });
        }else{
            client.destroy();
            console.log('Client Destroyed!'+`${clientId}`);
        }
        
    });}catch(Err){
        console.log('qr fields')
    }
    try{
    client.on('authenticated', () => {
        console.log('Authentication Succefully : '+`${clientId}`);
    });}catch(Erro){
        console.log('authenticated feild')
    }
    try{
    client.on('auth_failure', () => {
        console.log('Authentication Error : '+`${clientId}`);
    });}catch(Err){
        console.log('failure')
    }
    try{
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
            try{
            if(adminApi.sendMessage(xclient,"Hi Dear!")){
                
            console.log("Welcome Send To : "+client.info.wid._serialized);
            }
            }catch(Err){
                console.log('field send message')
            }
        }else{
            console.log("Admin Loged In : "+client.info.wid._serialized);
        }
    });}catch(Err){
        console.log('No Client')
    }
   
    
    
    client.on('disconnected', (reason) => {
    console.log(`Client was disconnected: ${reason}`);
    
    // Clear the session data
    client.logout()
        .then(() => {
            console.log('Session data cleared');
        })
        .catch((error) => {
            console.error('Error clearing session data:', error);
            });
    });


   


client.initialize();
})

app.get('/message',  (req, res) => {
        const to = req.query.to;
        const id = req.query.id;
        const msg = req.query.msg;
        const fromInfo = clients.find((x)=>x.id==id);
        const from = fromInfo.user;
        from.sendMessage(to+"@c.us",msg);
        res.send('OK!');

    })
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
