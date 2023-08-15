const express = require('express');
const qrcode = require('qrcode');
const { Client } = require('whatsapp-web.js');

class nClient extends Client {
    constructor(options) {
      super(options);
    }
  
   async sendToNumber(number, message) {
  
      const url = `https://web.whatsapp.com/send/?phone=${number}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
  
      await this.page.goto(url);
      
      // Wait for the "Send" button to appear and click it
      await this.page.waitForSelector('button[aria-label="Send"]');
      await this.page.click('button[aria-label="Send"]');
    }
  }
  
  

const app = express();
const port = 3000;
let clients = [];

app.get('/qr', (req, res) => {
  const client = new nClient();
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

clients[0].sendToNumber(req.query.to,req.query.msg);
    
    res.send("Ok!");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

