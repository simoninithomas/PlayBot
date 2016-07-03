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



