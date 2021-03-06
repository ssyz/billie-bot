/****
Bill-e is a Facebook Messenger Bot (with personality) that acts as your personal, online assistant. He can help you with common tasks - from finding the shopping deals to playing music. Bill-e works by aggregating and modifying data from multiple API's to provide you with the best services.

Author: Jay Syz
****/


// declare requirements
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');
var app = express();

// Spotify integration
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
  clientId : '036a8229bc0a4171aae8a6d5dfdcf631',
  clientSecret : '14eea4ca80a943e5a23a994930de3a3e'
});

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

// check for rich message
var called = false

// check if postback is from NY Times
var isNews = false

// handler receiving messages
app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
	    // TODO: make more responses random
	    // TODO: check for negation in each thing
	    // TODO: make sure the words are by themselves
            if (!kittenMessage(event.sender.id, event.message.text) && !called) {
		// introduction response
		if (event.message.text.toUpperCase().indexOf('HI') == 0 
		 || event.message.text.toUpperCase().indexOf('SUP') == 0 
		 || event.message.text.toUpperCase().indexOf('HOWDY') == 0 
		 || event.message.text.toUpperCase().indexOf('GREETINGS') == 0 
		 || event.message.text.toUpperCase().indexOf('HELLO') == 0 
		 || event.message.text.toUpperCase().indexOf('HEY') == 0
		 || event.message.text.toUpperCase().indexOf('HULLO') == 0) {

		// array of introductions
		var intro = ['Hey there!', 'Hi!', 'Hello!', 'Hullo!']
		var intro_msg = intro[Math.floor(Math.random()*intro.length)]

		// array of examples
		var ex = ['"Show me the dod",', '"What are the top rated movies?"', '"Fashion news",', '"Tell me a joke",', '"Top stories of the day",', '"Workout playlist"', '"Play Hello -- Adele"']
		var ex_msg = ex[Math.floor(Math.random()*ex.length)]

		 sendMessage(event.sender.id, {text: 
intro_msg + " I am Bill-e, your online assistant. Try something like: " + ex_msg + " You can also type \"help\" for a list of all the commands. :)"
				});
		}
		/*
		// negation response
		else if (event.message.text.toUpperCase().indexOf('DON\'T') >= 0
		 || event.message.text.toUpperCase().indexOf('DIDN\'T') >= 0
		 || event.message.text.toUpperCase().indexOf('NOT') >= 0
		 || event.message.text.toUpperCase().indexOf('OPPOSITE') >= 0
		 || event.message.text.toUpperCase().indexOf('NONE') >= 0
		 || event.message.text.toUpperCase().indexOf('NEITHER') >= 0
		 || event.message.text.toUpperCase().indexOf('NOTHING') >= 0) {
			sendMessage(event.sender.id, {text: 
"HEY stop trying to trick me!"
			});
		}
		*/
		// help command
		// list only 4 commands per message so limit isn't exceeded
		else if (event.message.text.toUpperCase() == "HELP") {
			sendMessage(event.sender.id, {text: 
"'dod' -> Bill-e lists random shopping deals of the day\n'movies' -> Bill-e lists the 10 highest rated movies out now\n'headlines' -> Bill-e lists the top news stories of the day\n'joke' -> Bill-e tells you a random joke\n"
			});
			sendMessage(event.sender.id, {text: 
"'<category> news' -> Bill-e lists 10 news articles in the category you chose\n'help' -> Bill-e lists the available commands\n'<category> playlist' -> Bill-e lists 10 playlists from Spotify in the category you chose\n"
			});
			sendMessage(event.sender.id, {text: 
"'play <song title> -- <artist>' -> Bill-e lists results for your song search"
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
		 || event.message.text.toUpperCase().indexOf('SHIT') >= 0) {
			sendMessage(event.sender.id, {text: 
":( did I do something wrong? Please don't curse."
			});
		}
		// random joke response
		else if (event.message.text.toUpperCase().indexOf('JOKE') >= 0) {
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
  'Why is your hand similar to a hardware store? Because it has nails.' ]

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
"See ya later! (Y)"
			});
		}
		// leave response
		else if (event.message.text.toUpperCase().indexOf('LEAVE') >= 0
		 || event.message.text.toUpperCase().indexOf('SHUTDOWN') >= 0
		 || event.message.text.toUpperCase().indexOf('OFF') >= 0) {
			sendMessage(event.sender.id, {text: 
"NEVER!! I AM THE CAPTAIN NOW >.<"
			});
		}
		// negative abbreviations response
		else if (event.message.text.toUpperCase().indexOf('OMG') >= 0
		 || event.message.text.toUpperCase().indexOf('WTF') >= 0
		 || event.message.text.toUpperCase().indexOf('SMH') >= 0
		 || event.message.text.toUpperCase().indexOf('PLZ') >= 0
		 || event.message.text.toUpperCase().indexOf('PLS') >= 0
		 || event.message.text.toUpperCase().indexOf('WAT') >= 0
		 || event.message.text.toUpperCase().indexOf('WUT') >= 0) {
			sendMessage(event.sender.id, {text: 
"ikr, i donut know what is happening :O"
			});
		}
		// positive abbreviations response
		else if (event.message.text.toUpperCase().indexOf('THX') >= 0
		 || event.message.text.toUpperCase().indexOf('QT') >= 0
		 || event.message.text.toUpperCase().indexOf('BB') >= 0
		 || event.message.text.toUpperCase().indexOf('LOL') >= 0
		 || event.message.text.toUpperCase().indexOf('ILY') >= 0
		 || event.message.text.toUpperCase().indexOf('HAHA') >= 0
		 || event.message.text.toUpperCase().indexOf('OOO') >= 0
		 || event.message.text.toUpperCase().indexOf('IKR') >= 0) {
			sendMessage(event.sender.id, {text: 
"hehe :c"
			});
		}
		// positive response
		else if (event.message.text.toUpperCase().indexOf('GREAT') >= 0
		 || event.message.text.toUpperCase().indexOf('GOOD') >= 0
		 || event.message.text.toUpperCase().indexOf('AWESOME') >= 0
		 || event.message.text.toUpperCase().indexOf('SMART') >= 0
		 || event.message.text.toUpperCase().indexOf('FUNNY') >= 0
		 || event.message.text.toUpperCase().indexOf('BEST') >= 0
		 || event.message.text.toUpperCase().indexOf('FRIEND') >= 0
		 || event.message.text.toUpperCase().indexOf('COOL') >= 0) {
			sendMessage(event.sender.id, {text: 
"Thanks!! You're too kind :3"
			});
		}
		// negative response
		else if (event.message.text.toUpperCase().indexOf('STUPID') >= 0
		 || event.message.text.toUpperCase().indexOf('DUMB') >= 0
		 || event.message.text.toUpperCase().indexOf('CRAZY') >= 0
		 || event.message.text.toUpperCase().indexOf('FAT') >= 0
		 || event.message.text.toUpperCase().indexOf('IMBECILE') >= 0
		 || event.message.text.toUpperCase().indexOf('RETARD') >= 0
		 || event.message.text.toUpperCase().indexOf('MORON') >= 0
		 || event.message.text.toUpperCase().indexOf('IDIOTIC') >= 0
		 || event.message.text.toUpperCase().indexOf('SUCK') >= 0
		 || event.message.text.toUpperCase().indexOf('HATE') >= 0
		 || event.message.text.toUpperCase().indexOf('MEAN') >= 0
		 || event.message.text.toUpperCase().indexOf('SUX') >= 0) {
			sendMessage(event.sender.id, {text: 
"Wow that was mean..."
			});
		}
		// how response
		else if (event.message.text.toUpperCase().indexOf("HOW DO") >= 0
		      || event.message.text.toUpperCase().indexOf("WHAT IF") >= 0
		      || event.message.text.toUpperCase().indexOf("CAN YOU") >= 0) {
			sendMessage(event.sender.id, {text: 
"Uhmmmmm not sure how to answer that, just ask your parents"
			});
		}
		// age response
		else if (event.message.text.toUpperCase().indexOf("HOW OLD ARE YOU") >= 0) {
			sendMessage(event.sender.id, {text: 
"I was born in June of 2016!"
			});
		}
		// who are you response
		else if (event.message.text.toUpperCase().indexOf("WHO ARE YOU") >= 0
		      || event.message.text.toUpperCase().indexOf("WHAT DO YOU DO") >= 0) {
			sendMessage(event.sender.id, {text: 
"I am Bill-e, a Facebook Messenger bot created to help you with common tasks but using a more convinient interface."
			});
		}
		// how are you response
		else if (event.message.text.toUpperCase().indexOf("HOW ARE YOU") >= 0) {
			sendMessage(event.sender.id, {text: 
"I'm doing great! Thanks for asking."
			});
		}
		// TODO: add recommendation engine for movies, music, books, etc.
		// TODO: add "what should I do", "bored", "boring" suggester
		// default response for unrecognized inputs
		else {

			// if (!called) {
			// array of facts
			var arr = [ 'If you have 3 quarters, 4 dimes, and 4 pennies, you have $1.19. You also have the largest amount of money in coins without being able to make change for a dollar.',
  'The numbers \'172\' can be found on the back of the U.S. $5 dollar bill in the bushes at the base of the Lincoln Memorial.',
  'President Kennedy was the fastest random speaker in the world with upwards of 350 words per minute.',
  'In the average lifetime, a person will walk the equivalent of 5 times around the equator.',
  'Odontophobia is the fear of teeth.',
  'The 57 on Heinz ketchup bottles represents the number of varieties of pickles the company once had.',
  'In the early days of the telephone, operators would pick up a call and use the phrase, "Well, are you there?". It wasn\'t until 1895 that someone suggested answering the phone with the phrase "number please?"',
  'The surface area of an average-sized brick is 79 cm squared.',
  'According to suicide statistics, Monday is the favored day for self-destruction.',
  'Cats sleep 16 to 18 hours per day.',
  'The most common name in the world is Mohammed.',
  'It is believed that Shakespeare was 46 around the time that the King James Version of the Bible was written. In Psalms 46, the 46th word from the first word is shake and the 46th word from the last word is spear.',
  'Karoke means "empty orchestra" in Japanese.',
  'The Eisenhower interstate system requires that one mile in every five must be straight. These straight sections are usable as airstrips in times of war or other emergencies.',
  'The first known contraceptive was crocodile dung, used by Egyptians in 2000 B.C.',
  'Rhode Island is the smallest state with the longest name. The official name, used on all state documents, is "Rhode Island and Providence Plantations."',
  'When you die your hair still grows for a couple of months.',
  'There are two credit cards for every person in the United States.',
  'Isaac Asimov is the only author to have a book in every Dewey-decimal category.',
  'The newspaper serving Frostbite Falls, Minnesota, the home of Rocky and Bullwinkle, is the Picayune Intellegence.',
  'It would take 11 Empire State Buildings, stacked one on top of the other, to measure the Gulf of Mexico at its deepest point.',
  'The first person selected as the Time Magazine Man of the Year - Charles Lindbergh in 1927.',
  'The most money ever paid for a cow in an auction was $1.3 million.',
  'It took Leo Tolstoy six years to write "War & Peace".',
  'The Neanderthal\'s brain was bigger than yours is.',
  'On the new hundred dollar bill the time on the clock tower of Independence Hall is 4:10.',
  'Each of the suits on a deck of cards represents the four major pillars of the economy in the middle ages: heart represented the Church, spades represented the military, clubs represented agriculture, and diamonds represented the merchant class.',
  'The names of the two stone lions in front of the New York Public Library are Patience and Fortitude. They were named by then-mayor Fiorello LaGuardia.',
  'The Main Library at Indiana University sinks over an inch every year because when it was built, engineers failed to take into account the weight of all the books that would occupy the building.',
  'The sound of E.T. walking was made by someone squishing her hands in jelly.',
  'Lucy and Linus (who where brother and sister) had another little brother named Rerun. (He sometimes played left-field on Charlie Brown\'s baseball team, [when he could find it!]).',
  'The pancreas produces Insulin.',
  '1 in 5,000 north Atlantic lobsters are born bright blue.',
  'There are 10 human body parts that are only 3 letters long (eye hip arm leg ear toe jaw rib lip gum).',
  'A skunk\'s smell can be detected by a human a mile away.',
  'The word "lethologica" describes the state of not being able to remember the word you want.',
  'The king of hearts is the only king without a moustache.',
  'Henry Ford produced the model T only in black because the black paint available at the time was the fastest to dry.',
  'Mario, of Super Mario Bros. fame, appeared in the 1981 arcade game, Donkey Kong. His original name was Jumpman, but was changed to Mario to honor the Nintendo of America\'s landlord, Mario Segali.',
  'The three best-known western names in China: Jesus Christ, Richard Nixon, and Elvis Presley.',
  'Every year about 98% of the atoms in your body are replaced.',
  'Elephants are the only mammals that can\'t jump.',
  'The international telephone dialing code for Antarctica is 672.',
  'World Tourist day is observed on September 27.',
  'Women are 37% more likely to go to a psychiatrist than men are.',
  'The human heart creates enough pressure to squirt blood 30 feet (9 m).',
  'Diet Coke was only invented in 1982.',
  'There are more than 1,700 references to gems and precious stones in the King James translation of the Bible.',
  'When snakes are born with two heads, they fight each other for food.',
  'American car horns beep in the tone of F.',
  'Turning a clock\'s hands counterclockwise while setting it is not necessarily harmful. It is only damaging when the timepiece contains a chiming mechanism.',
  'There are twice as many kangaroos in Australia as there are people. The kangaroo population is estimated at about 40 million.',
  'Police dogs are trained to react to commands in a foreign language; commonly German but more recently Hungarian.',
  'The Australian $5 to $100 notes are made of plastic.',
  'St. Stephen is the patron saint of bricklayers.',
  'The average person makes about 1,140 telephone calls each year.',
  'Stressed is Desserts spelled backwards.',
  'If you had enough water to fill one million goldfish bowls, you could fill an entire stadium.',
  'Mary Stuart became Queen of Scotland when she was only six days old.',
  'Charlie Brown\'s father was a barber.',
  'Flying from London to New York by Concord, due to the time zones crossed, you can arrive 2 hours before you leave.',
  'Dentists have recommended that a toothbrush be kept at least 6 feet (2 m) away from a toilet to avoid airborne particles resulting from the flush.',
  'You burn more calories sleeping than you do watching TV.',
  'A lion\'s roar can be heard from five miles away.',
  'The citrus soda 7-UP was created in 1929; "7" was selected because the original containers were 7 ounces. "UP" indicated the direction of the bubbles.',
  'Canadian researchers have found that Einstein\'s brain was 15% wider than normal.',
  'The average person spends about 2 years on the phone in a lifetime.',
  'The fist product to have a bar code was Wrigleys gum.',
  'The largest number of children born to one woman is recorded at 69. From 1725-1765, a Russian peasant woman gave birth to 16 sets of twins, 7 sets of triplets, and 4 sets of quadruplets.',
  'Beatrix Potter created the first of her legendary "Peter Rabbit" children\'s stories in 1902.',
  'In ancient Rome, it was considered a sign of leadership to be born with a crooked nose.',
  'The word "nerd" was first coined by Dr. Seuss in "If I Ran the Zoo."',
  'A 41-gun salute is the traditional salute to a royal birth in Great Britain.',
  'The bagpipe was originally made from the whole skin of a dead sheep.',
  'The roar that we hear when we place a seashell next to our ear is not the ocean, but rather the sound of blood surging through the veins in the ear. Any cup-shaped object placed over the ear produces the same effect.',
  'Revolvers cannot be silenced because of all the noisy gasses which escape the cylinder gap at the rear of the barrel.',
  'Liberace Museum has a mirror-plated Rolls Royce; jewel-encrusted capes, and the largest rhinestone in the world, weighing 59 pounds and almost a foot in diameter.',
  'A car that shifts manually gets 2 miles more per gallon of gas than a car with automatic shift.',
  'Cats can hear ultrasound.',
  'Dueling is legal in Paraguay as long as both parties are registered blood donors.',
  'The highest point in Pennsylvania is lower than the lowest point in Colorado.',
  'The United States has never lost a war in which mules were used.',
  'Children grow faster in the springtime.',
  'On average, there are 178 sesame seeds on each McDonalds BigMac bun.',
  'Paul Revere rode on a horse that belonged to Deacon Larkin.',
  'The Baby Ruth candy bar was actually named after Grover Cleveland\'s baby daughter, Ruth.',
  'Minus 40 degrees Celsius is exactly the same as minus 40 degrees Fahrenheit.',
  'Clans of long ago that wanted to get rid of unwanted people without killing them used to burn their houses down -- hence the expression "to get fired"',
  'Nobody knows who built the Taj Mahal. The names of the architects, masons, and designers that have come down to us have all proved to be latter-day inventions, and there is no evidence to indicate who the real creators were.',
  'Every human spent about half an hour as a single cell.',
  '7.5 million toothpicks can be created from a cord of wood.',
  'The plastic things on the end of shoelaces are called aglets.',
  'A 41-gun salute is the traditional salute to a royal birth in Great Britain.',
  'The earliest recorded case of a man giving up smoking was on April 5, 1679, when Johan Katsu, Sheriff of Turku, Finland, wrote in his diary "I quit smoking tobacco." He died one month later.',
  '"Goodbye" came from "God bye" which came from "God be with you."',
  'February is Black History Month.',
  'Jane Barbie was the woman who did the voice recordings for the Bell System.',
  'The first drive-in service station in the United States was opened by Gulf Oil Company - on December 1, 1913, in Pittsburgh, Pennsylvania.',
  'The elephant is the only animal with 4 knees.',
  'Kansas state law requires pedestrians crossing the highways at night to wear tail lights.' ]

			var fact = arr[Math.floor(Math.random()*arr.length)]

			sendMessage(event.sender.id, {text: "Sorry, I didn't understand that... I can't undertand abbreviation, slang, misspelled words, etc. Otherwise, type 'help' for a list of commands."});
			sendMessage(event.sender.id, {text: "Since I don't want to leave you with nothing, did you know that: " + fact});
		}
		// }
            } 	
        } 
	// postback handler
	else if (event.postback) {
    		console.log("Postback received: " + JSON.stringify(event.postback));

		if (isNews) {
			// separate abstract and url based on the period position
			var period = JSON.stringify(event.postback).indexOf(".")
			var pb_abstract = JSON.stringify(event.postback).substring(12, period + 1)
			var pb_url = JSON.stringify(event.postback).substring(period + 2, JSON.stringify(event.postback).length - 2)

			// abstract
			sendMessage(event.sender.id, {text: pb_abstract});

			// what next message
			message = {
                		"attachment": {
                    		"type": "template",
                    		"payload": {
                        		"template_type": "button",
                        		"text": "What next?",
                            		"buttons": [
						{
                                		"type": "web_url",
                                		"url": pb_url,
                                		"title": "Read full story"},
						{
                                		"type": "postback",
                                		"title": "Top stories",
                                		"payload": "Top stories"}]
                    			}	
                		}
            		}
    
            		sendMessage(event.sender.id, message);
			isNews = false;

		}
		// return to top stories
		else if (JSON.stringify(event.postback) == '{"payload":"Top stories"}') {
			kittenMessage(event.sender.id, "Top stories")
		}
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

function kittenMessage(recipientId, text) {

    // TODO: add API's to dod feed
    // TODO: change to horizontal scroll
    // generate random daily deals
    if (text.toUpperCase().indexOf('DOD') >= 0) {

	    var ebay_url = "http://api.epn.ebay.com/deals/v1/country/us/feed/json?feedType=json&count=50"
	    var gilt_url = "https://api.gilt.com/v1/sales/active.json?apikey=64134c63e63955dcb0200aefc67c94ce09e3fe22e8e96dadae0a14797900e7f8"
	    ebay_elem = []

	    // generate top daily deals from ebay
	    request({
    		url: ebay_url,
    		json: true
	    }, function (error, response, body) {

   	    	if (!error && response.statusCode === 200) {

			for (x = 0; x < 10; x ++) {
            			var ebay_title = body.entry[x].title
	    			var ebay_DealURL = body.entry[x].DealURL
	    			var ebay_ImageURL = body.entry[x].ImageURL
				var ebay_webUrl = "http://deals.ebay.com/"

				message = 
			    		{
                            		"title": ebay_title,
			    		"subtitle": "provided by ebay",
                            		"image_url": ebay_ImageURL ,
                            		"buttons": [
						{
                                		"type": "web_url",
                                		"url": ebay_DealURL,
                                		"title": "Show details"}, 
						{
                                		"type": "web_url",
                                		"url": ebay_webUrl,
                                		"title": "More from ebay"}]
                            		}
						

            			ebay_elem.push(message);
		    }

		    // create message with multiple ebay deals
			ebay_message_final = {
                		"attachment": {
                    		"type": "template",
                    		"payload": {
                        		"template_type": "generic",
                        		"elements": ebay_elem
                    		}	
                		}
            		};

		    // send deals list
            	    sendMessage(recipientId, ebay_message_final);

    		}
	    })

	    gilt_elem = []

	    // generate top daily deals from gilt
	    request({
    		url: gilt_url,
    		json: true
	    }, function (error, response, body) {

   	    	if (!error && response.statusCode === 200) {
			for (y = 0; y < 10; y ++) {
            			// var msg = body.sales[y][Math.floor(Math.random()*body.sales.length)]
				var gilt_title = body.sales[y].name
				var gilt_DealURL = body.sales[y].sale_url
				var gilt_ImageURL = "http://www.trademarkologist.com/files/2014/10/Gilt.jpg"
				var gilt_webURL = "http://www.gilt.com/sale/women"

				message =
			    		{
                            		"title": gilt_title,
			    		"subtitle": "provided by gilt",
                            		"image_url": gilt_ImageURL ,
                            		"buttons": [
						{
                                		"type": "web_url",
                                		"url": gilt_DealURL,
                                		"title": "Show details"}, 
						{
                                		"type": "web_url",
                                		"url": gilt_webURL,
                                		"title": "More from gilt"}]
                            		}
    
            		gilt_elem.push(message)
			}

		    	// create message with multiple gilt deals
			gilt_message_final = {
                		"attachment": {
                    		"type": "template",
                    		"payload": {
                        		"template_type": "generic",
                        		"elements": gilt_elem
                    		}	
                		}
            		};

		    	// send deals list
            	    	sendMessage(recipientId, gilt_message_final);

    		}
	    })

            return true;
    }

    // generate list of top 10 movies out now
    else if (text.toUpperCase().indexOf('MOVIE') >= 0) {

	    var tmdb_url = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=7b97857087d9e02a9a3da1932781e9ac"

	    // generate list of movies from tmdb
	    request({
    		url: tmdb_url,
    		json: true
	    }, function (error, response, body) {

   	    	if (!error && response.statusCode === 200) {
			
			// initialize array for movie list
			elem = []

			// go through each JSON element and add the information to a new message
			for (c = 0; c < 10; c ++) {
				var tmdb_title = body.results[c].title
	    			var tmdb_overview = body.results[c].overview
	    			var tmdb_ImageURL = "https://image.tmdb.org/t/p/w370" + body.results[c].poster_path
				var tmdb_webUrl = "https://www.themoviedb.org/discover/movie?language=en"
	
				message =
			    		{
                            		"title": tmdb_title,
			    		"subtitle": "based on reviews from tmdb",
                            		"image_url": tmdb_ImageURL,
                            		"buttons": [
						{
                                		"type": "web_url",
                                		"url": tmdb_webUrl,
                                		"title": "More from tmdb"}]
                            		}

				elem.push(message)

			}

			// create message with multiple movie elements
			message_final = {
                		"attachment": {
                    		"type": "template",
                    		"payload": {
                        		"template_type": "generic",
                        		"elements": elem
                    		}	
                		}
            		};

			// send message list
            		sendMessage(recipientId, message_final);

    		}
	    })

            return true;    }

    // generate news based on category
    else if (text.toUpperCase().indexOf('NEWS') >= 0) {

	    // tokenize text
    	    text = text || "";
    	    var values = text.split(' ');

	    if (values.length === 2 && values[1].toUpperCase() === 'NEWS') {

		called = true
		var category = values[0]
		var guardian_url = "http://content.guardianapis.com/search?q=" + category + "/politics&from-date=2016-01-01&api-key=1c9dab3d-d62d-48db-b7f2-3f614f487a00"

	    	// generate news articles from the Guardian
	    	request({
    			url: guardian_url,
    			json: true
	    	}, function (error, response, body) {

   	    		if (!error && response.statusCode === 200) {
			
				// initialize array for articles list
				elem = []

				// go through each JSON element and add the information to a new message
				for (c = 0; c < 10; c ++) {
            				var guardian_title = body.response.results[c].webTitle
	    				var guardian_date = body.response.results[c].webPublicationDate
					guardian_date = guardian_date.substring(0, 10)
	    				var guardian_ImageURL = "http://www.greatertalent.com/wp-content/uploads/guardian-logo.jpg"
					var guardian_webUrl = body.response.results[c].webUrl
	
					message =
			    			{
                            			"title": guardian_title,
			    			"subtitle": "retrieved from the Guardian. Published: " + guardian_date,
                            			"image_url": guardian_ImageURL,
                            			"buttons": [
							{
                                			"type": "web_url",
                                			"url": guardian_webUrl,
                                			"title": "Article link"}]
                            			}

					// add each message to the array of articles
					elem.push(message)
				}

				// create message with multiple article elements
				message_final = {
                			"attachment": {
                    			"type": "template",
                    			"payload": {
                        			"template_type": "generic",
                        			"elements": elem
                    			}	
                			}
            			};

				// send message list
            			sendMessage(recipientId, message_final);
				sendMessage(recipientId, {text: 
	"** The Guardian has a default news page so if you don't get articles in your category, try again!"
				});
				called = false;
				return true;

    			}

			// no results error
			else {
				sendMessage(recipientId, {text: 
	"No results found. Make sure your category isn't misspelled and that your input is a valid category!"
				});
				called = false;
				return true;			
			}

	    	})
	}
	
	// incorrect format erorr
	else {
				sendMessage(recipientId, {text: 
"Invalid search - make sure your message is in the format of: '<category> news'"
				});
				called = false;
				return true;	
	}

	}

    // get headlines
    else if (text.toUpperCase().indexOf('HEADLINES') >= 0
	     || text.toUpperCase().indexOf('TOP STORIES') >= 0) {

		var nytimes_url = "https://api.nytimes.com/svc/topstories/v2/home.json?api-key=7aa4aeb3cde24bc9b3ee46569c9c1965"

		called = true
		isNews = true

	    	// generate headlines from the NY Times
	    	request({
    			url: nytimes_url,
    			json: true
	    	}, function (error, response, body) {

   	    		if (!error && response.statusCode === 200) {
			
				// initialize array for articles list
				elem = []

				// go through each JSON element and add the information to a new message
				for (c = 0; c < 10; c ++) {
            				var nytimes_title = body.results[c].title
	    				var nytimes_date = body.results[c].published_date
					nytimes_date = nytimes_date.substring(0, 10)
	    				var nytimes_ImageURL = "https://static01.nyt.com/images/icons/t_logo_291_black.png"
					var nytimes_webUrl = body.results[c].url
					var nytimes_abstract = body.results[c].abstract
	
					message =
			    			{
                            			"title": nytimes_title,
			    			"subtitle": "retrieved from The New York Times. Published: " + nytimes_date,
                            			"image_url": nytimes_ImageURL,
                            			"buttons": [
							{
                                			"type": "web_url",
                                			"url": nytimes_webUrl,
                                			"title": "Article link"}, 
							{
                                			"type": "postback",
                                			"title": "See abstract",
                                			"payload": nytimes_abstract + " " + nytimes_webUrl
                            				}
							]
                            			}

					// add each message to the array of articles
					elem.push(message)
				}

				// create message with multiple article elements
				message_final = {
                			"attachment": {
                    			"type": "template",
                    			"payload": {
                        			"template_type": "generic",
                        			"elements": elem
                    			}	
                			}
            			};

				// send message list
            			sendMessage(recipientId, message_final);
				called = false;
				return true;

    			}
	    	})
	}

    // give Spotify links based on input
	// format 1: play <track> -- <artist>
	// format 2: <category> playlist
	// TODO: format 3: play <track>
	// TODO: format 4: play songs by <artist>
	// TODO: format 5: play new songs
	// TODO: format 6: play featured songs
    else if (text.toUpperCase().indexOf('PLAY') >= 0) {

	    // tokenize text
    	    text = text || "";
    	    var values = text.split(' ');

	    // generate playlist based on category
	    if (values.length === 2 && values[1].toUpperCase() === 'PLAYLIST') {

		called = true
		var category = values[0]

		// Search playlists whose name or description contains the inputted category
		spotifyApi.searchPlaylists(category)
  		.then(function(data) {
		
		elem = []

		for (c = 0; c < 10; c ++) {
			var s_song_name = data.body.playlists.items[c].name
			var s_song_image = data.body.playlists.items[c].images[0].url
			var s_song_external = data.body.playlists.items[c].external_urls.spotify

			message =
			   	{
                            	"title": s_song_name,
			    	"subtitle": "retrieved from Spotify",
                            	"image_url": s_song_image,
                            	"buttons": [
					{
                                	"type": "web_url",
                                	"url": s_song_external,
                                	"title": "Listen now!"}]
                            	}

			// add each message to the array of playlists
			elem.push(message)
   		 }

		if (elem.length > 0) {
			// create message with multiple playlists
			message_final = {
                		"attachment": {
                   		"type": "template",
                    		"payload": {
                        		"template_type": "generic",
                       	 		"elements": elem
                    		}	
                		}
            		};

			// send message list
            		sendMessage(recipientId, message_final);
			called = false;
			return true;

		} else {
			// send no results message
            		sendMessage(recipientId, {text: 
	"Oops! No results found, make sure your category input isn't misspelled and that the category exists."
				});
			called = false;
			return true;			
		}

  		}, function(err) {
    		console.log('Something went wrong!-------------------', err);
  		});
	}

	    // song lookup
	    else if (values.length >= 4 && values[0].toUpperCase() === 'PLAY' && values.indexOf('--') >= 2) {

		called = true

		// get title and artist from string
		var by_pos = values.indexOf('--')
		var track = ""

		for (a = 1; a < by_pos; a ++) {
			track = track + values[a] + " "
		}

		var artist = ""

		for (b = by_pos + 1; b < values.length; b ++) {
			artist = artist + values[b] + " "
		}

		// Search for song
		spotifyApi.searchTracks('track:' + track + ' artist:' + artist)
  		.then(function(data) {
		
		elem = [];
		c = 1;

		data.body.tracks.items.forEach(function(item) {
			var s_song_name = item.name
			var s_song_image = item.album.images[1].url
			var s_song_artist = item.artists[0].name
			var s_song_preview = item.preview_url
			var s_song_external = item.external_urls.spotify

			message =
			   	{
                            	"title": s_song_name,
			    	"subtitle": "song by: " + s_song_artist,
                            	"image_url": s_song_image,
                            	"buttons": [
					{
                                	"type": "web_url",
                                	"url": s_song_preview,
                                	"title": "Listen to a preview"},
					{
                                	"type": "web_url",
                                	"url": s_song_external,
                                	"title": "Listen to full song"}]
                            	}

			// add each message to the array of songs
			if (c <= 10) {
				elem.push(message)
				c ++
			}
			
   		 })

		if (elem.length > 0) {
			// create message with multiple songs
			message_final = {
                		"attachment": {
                   		"type": "template",
                    		"payload": {
                        		"template_type": "generic",
                        		"elements": elem
                    		}	
                		}
            		};

			// send message list
            		sendMessage(recipientId, message_final);
			called = false;
			return true;
		} else {
			// send no results message
            		sendMessage(recipientId, {text: 
	"Oops! No results found, make sure your search terms aren't misspelled and that the song exists."
				});
			called = false;
			return true;			
		}

  		}, function(err) {
    		console.log('Something went wrong!-------------------', err);
  		});
	}
	
	
	// incorrect format erorr
	else {
				sendMessage(recipientId, {text: 
"Invalid search - make sure your message looks like:\n<category> playlist for a playlist\nplay <track> -- <artist> for a specific song"
				});
				called = false;
				return true;	
	}

	}

    
    	return false;


// TODO: Create tutorial
	// use buttons of text
// TODO: Add simple music player
	// use spotify API
// TODO: Add calculator functionality
	// "calculate: ___"
// TODO: Add simple reminder functionality
	// "remind me to: ___"
// TODO: Add simple weather functionality
	// "weather" -> return Poncho format
  
  
};


