/****
Bill-e is a Facebook Messenger Bot (with personality) that aggregates and modifies data from multiple "deals" API's to generate listings detailing the best deals of the day. Bill-e also includes a search-by-category function where users input a desired category (ie Technology) and deals related to the search are listed.

Author: Jay Syz
****/


// declare requirements
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');
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
			// hi is part of shit...
			if (event.message.text.toUpperCase().indexOf('SHIT') >= 0) {
				sendMessage(event.sender.id, {text: 
":( did I do something wrong? Please don't curse."
				});
			}
			else { 
				sendMessage(event.sender.id, {text: 
"Hey there! I am Bill-e, your personal, online, shopping assistant. I can help you find the best deals around. Simply type an item category like 'technology' or 'dod' (deals of the day) to begin! You can also type 'help' for a list of all the commands. Happy shopping :)"
				});
			}
		}
		// help command
		else if (event.message.text.toUpperCase() == "HELP") {
			sendMessage(event.sender.id, {text: 
"dod -> list the deal of the day\ntechnology -> list the deals in technology\nfashion -> list the deals in fashion\nhelp -> list the available commands"
			});
		}
		// curse response
		else if (event.message.text.toUpperCase().indexOf('DICK') >= 0 
		 || event.message.text.toUpperCase().indexOf('PUSSY') >= 0 
		 || event.message.text.toUpperCase().indexOf('CUNT') >= 0 
		 || event.message.text.toUpperCase().indexOf('BASTARD') >= 0 
		 || event.message.text.toUpperCase().indexOf('FUCK') >= 0 
		 || event.message.text.toUpperCase().indexOf('DAMN') >= 0
		 || event.message.text.toUpperCase().indexOf('BITCH') >= 0
		 || event.message.text.toUpperCase().indexOf('ASSHOLE') >= 0
		 || event.message.text.toUpperCase().indexOf('SUCK') >= 0
		 || event.message.text.toUpperCase().indexOf('SHIT') >= 0) {
			sendMessage(event.sender.id, {text: 
":( did I do something wrong? Please don't curse."
			});
		}
		// random joke response
		else if (event.message.text.toUpperCase().indexOf('TELL ME A JOKE') >= 0) {
			// array of jokes
			var array = [ 'How can sea captains use amphibians? As froghorns.',
  'How did Colonel Sanders die? He choked on his fingers.',
  'How did Hitler tie his laces? In little Nazis.',
  'How did the dentist become a brain surgeon? When his drill slipped.',
  'How do you change tires on a duck? With a quackerjack.',
  'How do you tickle a rich girl? Say "Gucci Gucci Gucci!"',
  'How many sides does a circle have? Two: an inside and an outside.',
  'If a seagull flies over the sea, what flies over the bay? A bagel.',
  'Including Rudolph, how many reindeer does Santa have? Ten: Dasher, Dancer, Prancer, Vixen, Comet, Cupid, Donner, Blitzen, Rudolph and Olive. Olive? Yes, Olive the Other Reindeer.',
  'What are half-sized quartz watches? Pintz watches.',
  'What are tired Army clothes? Fatigues.',
  'What city has the largest rodent population? Hamsterdam.',
  'What colour is a belch? Burple.',
  'What cruises down the riverbed at 60 mph? A motorpike with two side carps.',
  'What did Godzilla say after eating a four-cylinder Datsun? "Gosh, I could have had a V-8!"',
  'What did Tarzan say to his wife? "Jane, it\'s a jungle out there!"',
  'What did the alien dandelion say to the Earth dandelion? "Take me to your weeder!"',
  'What did the guitar say to the musician? "Pick on someone your own size!"',
  'What did the kid say when his mother poured oatmeal on him? "How can you be so gruel?"',
  'What did the kids say when they saw Dr. Jekyll the Truant Officer coming? "Hyde! It\'s Dr. Jekyll!"',
  'What did the painter say to the wall? "One more crack and I\'ll plaster you!"',
  'What do you call a cow with no legs? Ground beef.',
  'What do you call a man who drinks and falls off his horse? The wine-stoned cowboy.',
  'What do you call a rabbit with fleas? Bugs Bunny.',
  'What do you call a veterinarian with laryngitis? A hoarse doctor.',
  'What do you call it when a walrus eats 1000 clams? A calamity.',
  'What do you get when you drop a piano down a mineshaft? A flat miner.',
  'What do you get when you drop boiling water down a rabbit hole? Hot cross bunnies.',
  'What do you get when you pour cement on a burglar? A hardened criminal.',
  'What do you get when you put the pictures of the Kings of Russia on a flag? The Tsar-Spangled Banner.',
  'What do you give a person with water on the brain? A tap on the head.',
  'What does a spy do when he gets cold? He goes undercover.',
  'What goes "Ha, ha, ha, plop"? A man laughing his head off.',
  'What grows up while growing down? A goose.',
  'What happened to the lawyer who was thrown out of a saloon? He was disbarred.',
  'What happens to deposed kings? They get throne away.',
  'What happens to illegally parked frogs? They get toad away.',
  'What is Batman\'s religion? Buddha, Buddha, Buddha, Buddha.',
  'What is a centrifuge? A place where 100 people hide.',
  'What is a newly hatched beetle? A baby buggy.',
  'What is copper nitrate? Overtime for policemen.',
  'What is green and red and goes around in a blender at 90 mph? A frog in a blender. ',
  'What do you get from all of this? Frognog.',
  'What is the electrician\'s favourite Christmas carol? "The Twelve Days of Christmas" because of the partridge in ampere tree.',
  'What is the gambler\'s heaven? Paradise.',
  'What jumps from cake to cake and smells of almonds? Tarzipan.',
  'What part of a cemetery is best for burying guns? The muzzleum.',
  'What\'s Irish and sits in the sun? Paddy O\'Furniture.',
  'What\'s a chimney sweep\'s most common ailment? The flue.',
  'What\'s a cow eating grass? A lawn mooer.',
  'What\'s a three-season bed? One without a spring.',
  'What\'s musical and handy in a supermarket? A Chopin Liszt.',
  'What\'s the motto of the ghoul\'s convention? The morgue the merrier.',
  'What\'s the similarity between a blacksmith and a counterfeiter? They\'re into forgery.',
  'Where are whales weighed? At a whale weigh station.',
  'Where did Noah keep his bees? In the ark hives.',
  'Where did the king put his armies? In his sleevies.',
  'Where does McDonald\'s get its burgers from? Macau.',
  'Where is Venice located? In Venice-zuela.',
  'Why are meteorologists always nervous? Their future is always up in the air.',
  'Why are there no floods in Paris? Because the water is always l\'eau.',
  'Why did the blonde throw butter out a window? She wanted to see a butterfly.',
  'Why do ambassadors never get sick? Diplomatic immunity.',
  'Why do people who throw away feather pillows get depressed? Their down is in the dumps.',
  'Why don\'t sharks eat divorce lawyers? Professional courtesy.',
  'Why isn\'t whispering permitted in class? Because it\'s not aloud.',
  '"Doctor, doctor! Birds keep building nests in my horses\' manes! What should I do?" "Sprinkle yeast on them and call me in the morning." "But why?" "Yeast is yeast and nest is nest and never the mane shall tweet!"',
  '"Doctor, doctor! Some days I think I\'m a teepee, others I think I\'m a wigwam! What do I do?" "Relax, you\'re two tents."',
  '"Have you got bills to pay? If you do, please give it back. He looks silly bald." (Laugh-In)',
  'A male snake charmer married a female undertaker. Their bath towels read "Hiss" and "Hearse".',
  'A man hit another on the head with a pop bottle, killing him. In court, he claimed he was influenced by the song "Let\'s Get Fizzy-Kill".',
  'A story about a pony on the pampas could be called "Little Horse on the Prairie".',
  'Addition in a dark Chinese restaurant is "dim sum".',
  'An expert farmer is outstanding in her field.',
  'An incompetent ship captain grounds the warship he walks on.',
  'Camels live in Camelfornia.',
  'Cannibals like to meat people.',
  'Did you hear about the optician? Two glasses and he made a spectacle of himself.',
  'Economist: A discount fog.',
  'Hands are like bells, especially when they\'re wrung.',
  'How about the bear that was hit by an 18-wheeler and splattered all over the place? They said it was a grizzly accident.',
  'How about the man who ran through a screen door? He strained himself.',
  'If life is like a bowl of cherries, what\'s the raisin for living?',
  'In some places fog will never be mist.',
  'Never give your uncle an anteater.',
  'Once upon a time, a tribe of cannibals caught a saint sent to them as a missionary and ate him. He was very tender and tasty, yet they were all violently sick afterwards. It shows that you can\'t keep a good man down.',
  'One can tell that a tree is nomadic when it packs up its trunk and leaves.',
  'One day the wind stopped blowing in Chicago and everyone fell down.',
  'One who does magic tricks with bandages is a wizard of gauze.',
  'Plug a pizza in the socket and get a pizza delight.',
  'Read the history of electronics of Biblical proportions: Solomon and Toshiba!',
  'Rust is edible. After all, it is a form of car-rot.',
  'Some people say my puns are sleep-inducing, but I keep laudanum anyways.',
  'Some river valleys are absolutely gorges.',
  'Spanish bullfighters use Oil of Olé face cream to beat wrinkles.',
  'The Hand family consists of 10 electricians. Their motto is "Many Hands make light work."',
  'The Irish government is wealthy because its capital is always Dublin.',
  'The sheep rustler who broke out of jail is now on the lam.',
  'The truth may ring out like a bell, but it is seldom ever tolled.',
  'We ought to rename summer "pride" because pride cometh before the fall.',
  'When the Lord said, "Go forth, be fruitful and multiply!" He didn\'t necessarily have Math teachers in mind.',
  'When the little boy was caught with his hand in the cookie jar, he said "I needed help with my homework." The reason: "God helps those who help themselves."',
  'You can have too much of a good thing, but since most people think puns are not good things, they can\'t have too many of them!',
  'How can a leopard change his spots? By moving.',
  'If a farmer raises wheat in dry weather, what does he raise in wet weather? An umbrella.',
  'What day of the year is a command to go forward? March 4th.',
  'What did the razor blade say to the razor? Schick \'em up!',
  'What do you call a frightened skindiver? Chicken of the sea.',
  'What four letters could end a game of hide and seek. O I C U.',
  'What goes up into the air white and comes down yellow and white? An egg.',
  'What has four wheels and flies? A garbage truck.',
  'What is the difference between a cat and a comma? A cat has claws at the end of its paws, and a comma has a pause at the end of its clause.',
  'What kind of coat can be put on only when wet? A coat of paint.',
  'What turns without moving? Milk. It can turn sour.',
  'What\'s the longest piece of furniture in the world? The multiplication table.',
  'When does a boat show affection? When it hugs the shore.',
  'When you lose something, why do you always find it in the last place you look? Because you stop looking as soon as you find it.',
  'Where does a jellyfish get its jelly? From ocean currents.',
  'Why are rivers always rich? Because they have two banks.',
  'Why did the little fella sleep on the chandelier? Because he was a light sleeper.',
  'Why do cows wear cowbells? Because their horns don\'t work.',
  'Why does lightning shock people? Because it doesn\'t know how to conduct itself.',
  'Why is your hand similar to a hardware store? Because it has nails.',
  '' ]

			var joke = array[Math.floor(Math.random()*array.length)]
			sendMessage(event.sender.id, {text: 
joke
			});
		}
		// thanks response
		else if (event.message.text.toUpperCase().indexOf('THANK') >= 0
		 || event.message.text.toUpperCase().indexOf('THANKS') >= 0) {
			sendMessage(event.sender.id, {text: 
"No problem ;)"
			});
		}
		// bye response
		else if (event.message.text.toUpperCase().indexOf('BYE') >= 0
		 || event.message.text.toUpperCase().indexOf('GOODBYE') >= 0) {
			sendMessage(event.sender.id, {text: 
"See ya later!"
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

// send rich message with 8coupon API
// TODO: check for dod
// TODO: check for different categories
function kittenMessage(recipientId, text) {
    if (text.toUpperCase().indexOf('DOD') >= 0) {
	    var imageUrl = "https://placekitten.com/200/300"
	    var webUrl = "http://www.8coupons.com/"
	    var deal_8 = "50% off!"
	    //var deal_source = "$10 off $50!"
            message = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
			    {
                            "title": deal_8,
			    "subtitle": "provided by 8coupons",
                            "image_url": imageUrl ,
                            "buttons": [
				{
                                "type": "web_url",
                                "url": imageUrl,
                                "title": "Show details"}, 
				{
                                "type": "web_url",
                                "url": webUrl,
                                "title": "More from 8coupons"}]
                            }/*,
			    {
                            "title": deal_source,
			    "subtitle": "provided by <source>",
                            "image_url": imageUrl ,
                            "buttons": [
				{
                                "type": "web_url",
                                "url": imageUrl,
                                "title": "Show details"}, 
				{
                                "type": "web_url",
                                "url": webUrl,
                                "title": "More from <source>"}]
                            }
			    */
			]
                    }
                }
            };
    
            sendMessage(recipientId, message);
            
            return true;
    }
    
    return false;


// example rich message
/*
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
*/
    
};


