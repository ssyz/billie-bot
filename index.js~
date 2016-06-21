var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {
    res.send('This is the bill-e Server');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

// handler receiving messages
app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            if (!kittenMessage(event.sender.id, event.message.text)) {
		// introduction response
		if (event.message.text.toUpperCase().indexOf('HI') >= 0 
		 || event.message.text.toUpperCase().indexOf('SUP') >= 0 
		 || event.message.text.toUpperCase().indexOf('HOWDY') >= 0 
		 || event.message.text.toUpperCase().indexOf('GREETINGS') >= 0 
		 || event.message.text.toUpperCase().indexOf('HELLO') >= 0 
		 || event.message.text.toUpperCase().indexOf('HEY') >= 0) {
			sendMessage(event.sender.id, {text: 
"Hey there! I am Bill-e, your personal, online, shopping assistant. I can help you find the best deals around. Simply type an item category like 'technology' or 'dod' (deals of the day) to begin! You can also type 'help' for a list of all the commands. Happy shopping :)"
			});
		}
		// help command
		else if (event.message.text.toUpperCase() == "HELP") {
			sendMessage(event.sender.id, {text: 
"dod -> list the deal of the day\ntechnology -> list the deals in technology\nfashion -> list the deals in fashion\nhelp -> list the available commands"
			});
		}
		// default response for unrecognized inputs
		else {
			sendMessage(event.sender.id, {text: "Sorry, I didn't understand that. Type 'help' for a list of commands."});
		}
            } 	
        } else if (event.postback) {
    		console.log("Postback received: " + JSON.stringify(event.postback));
	}
    }
    res.sendStatus(200);
});

// generic function sending messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

// send rich message with kitten
function kittenMessage(recipientId, text) {
    
    text = text || "";
    var values = text.split(' ');
    
    if (values.length === 3 && values[0] === 'kitten') {
        if (Number(values[1]) > 0 && Number(values[2]) > 0) {
            
            var imageUrl = "https://placekitten.com/" + Number(values[1]) + "/" + Number(values[2]);
            
            message = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Kitten",
                            "subtitle": "Cute kitten picture",
                            "image_url": imageUrl ,
                            "buttons": [{
                                "type": "web_url",
                                "url": imageUrl,
                                "title": "Show kitten"
                                }, {
                                "type": "postback",
                                "title": "I like this",
                                "payload": "User " + recipientId + " likes kitten " + imageUrl,
                            }]
                        }]
                    }
                }
            };
    
            sendMessage(recipientId, message);
            
            return true;
        }
    }
    
    return false;
    
};


