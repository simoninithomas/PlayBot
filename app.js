/**********************************************************************************************************
 *                                                      Sir PlayABot
 *                                                      @author: SIMONINI Thomas
 *                                                      @email: simonini_thomas@outlook.fr
 *                                                      All Rights Reserved
 * *******************************************************************************************************/
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();

app.set('port', (process.env.PORT || 5000));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Process application/json
app.use(bodyParser.json());

// Index route
app.get('/', function(req, res) {
    res.send("Hello world! I'm a bot");
});

// Facebook verification
app.get('/webhook/', function(req, res){
    if(req.query['hub.verify_token'] === 'hello_sir'){
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token');
});

// Turn on the server
app.listen(app.get('port'), function(){
    console.log('Running on port', app.get('port'))
});

// API endpoint to process messages
app.post('/webhook/', function(req, res){
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
        }
    }
    res.sendStatus(200)
})


// Include Token (not safe like that)
var token = "EAAO3rk8Qk9oBAKP7wN9kZCisAi9YTwLaQgJApPmc7m0YTsBmcmQiKO1NpBigGh0DAUn3V5IDGvWoQS8VzxXNfHzq4ZCfpvDM78Bf9oCieoZAxK1BkLgXiyZCzcQVKFW5dS5ZABC6GJxmH4GyEY84QQPqTFdBEL8fA4522TWKWNwZDZD"

// Function that echo back messages
function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}