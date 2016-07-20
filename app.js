/**********************************************************************************************************
 *                                                      Sir PlayABot
 *                                                      @author: SIMONINI Thomas
 *                                                      @email: simonini_thomas@outlook.fr
 *                                                      All Rights Reserved
 * *******************************************************************************************************/
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var Parse = require('parse').Parse;

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
            if (text == 'hello' || 'hi' || "Hello" || "Hi") {
                sendTextMessage(sender, "Hello, May I propose you some games based on your tastes?")
            }
            if (text == 'Generic'){
                sendGenericMessage(sender);
                continue;
            }

            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
        }
        else if (messagingEvent.postback) {
            receivedPostback(messagingEvent);
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

// Send a structured message
function sendGenericMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [{
                        title: "rift",
                        subtitle: "Next-generation virtual reality",
                        item_url: "https://www.oculus.com/en-us/rift/",
                        image_url: "http://i.giphy.com/l41YrmTg81L4ds5pK.gif",
                        buttons: [{
                            type: "web_url",
                            url: "https://www.oculus.com/en-us/rift/",
                            title: "Open Web URL"
                        }, {
                            type: "postback",
                            title: "Call Postback",
                            payload: "Payload for first bubble",
                        }],
                    }, {
                        title: "touch",
                        subtitle: "Your Hands, Now in VR",
                        item_url: "https://www.oculus.com/en-us/touch/",
                        image_url: "http://messengerdemo.parseapp.com/img/touch.png",
                        buttons: [{
                            type: "web_url",
                            url: "https://www.oculus.com/en-us/touch/",
                            title: "Open Web URL"
                        }, {
                            type: "postback",
                            title: "Call Postback",
                            payload: "Payload for second bubble",
                        }]
                    }]
                }
            }
        }
    };

    callSendAPI(messageData);
}

function receivedPostback(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfPostback = event.timestamp;

    // The 'payload' param is a developer-defined field which is set in a postback
    // button for Structured Messages.
    var payload = event.postback.payload;

    console.log("Received postback for user %d and page %d with payload '%s' " +
        "at %d", senderID, recipientID, payload, timeOfPostback);

    // When a postback is called, we'll send a message back to the sender to
    // let them know it was successful
    sendTextMessage(senderID, "Postback called");
}