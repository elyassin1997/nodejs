const express = require('express');
const qrcode = require('qrcode');
const { Client } = require('whatsapp-web.js');

const app = express();
const port = 3000;
let clients = [];

app.get('/qr', (req, res) => {
  const client = new Client();
  client.initialize();
  let canQr = true;
  client.on('qr', (qr) => {
    if(canQr){
        canQr=false;
        console.log('Qr ready');
        qrcode.toDataURL(qr,(error,url)=>{
            res.send(`<img src="${url}" style="margin:150px auto;">`);
        });
        
    }else{
        client.destroy().then(()=>{
            console.log('Client Distroyed');
        }).catch((reason)=>{
            console.log('Error');
        });
    }
  });
  client.on('ready', () => {
    clients.push(client);
    console.log('WhatsApp Web client is ready');
    
  });
  /*client.on('disconnected', (reason) => {
    console.log('WhatsApp Web client is disconnected!');
  });*/
  client.on('disconnected', (reason) => {
    console.log('WhatsApp Web client is disconnected!');
  });
  
});



app.get('/msg', (req, res) => { 

clients[0].getChatById("212610740846@c.us").then((chat)=>{
  chat.sendMessage("MSG").then((msg)=>{
    console.log(msg)
}).catch((err)=>{
    console.log('This Is The Error : '+err);
})
}).catch((tre)=>{
  console.log('fuck new tre :'+tre);
})
    
    res.send("Ok!");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
