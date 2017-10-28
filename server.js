const config = require('./config');
const app = require('express')();
const fetch = require('node-fetch');
const Giphy = require('giphy-api')(config.giphy);
const TeleBot = require('telebot');
const bot = new TeleBot(config.telegram); // API KEY

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/index.html')
})

var port = process.env.PORT || 8080;
app.listen(port);

bot.on('/help', (msg) => msg.reply.text('Available commands: /ping, /hello, /random, /acid, /miro, /hodl /iss'))

bot.on('/ping', (msg) => msg.reply.text('pong!'));

bot.on('/hello', (msg) => {
  return bot.sendMessage(msg.from.id, `Hello, ${ msg.from.first_name }!`);
});

bot.on('/random', (msg) => {
  Giphy.random('*', function(err, res) {
    if (err) throw err;
    var result = res.data.image_original_url;
    msg.reply.video(result);
  })
})

bot.on('/acid', (msg) => {
  Giphy.random('trippy', function (err, res) {
    if (err) throw err;
    var result = res.data.image_original_url;
    msg.reply.text('What if I told you.. ');
    msg.reply.video(result);
  });
})

bot.on('/miro', (msg) => {
  Giphy.random('rave', (err, res) => {
    if (err) throw err;
    var result = res.data.image_original_url;
    msg.reply.text('Hello Alex!')
    msg.reply.video(result);
  })
})

bot.on('/hodl', (msg) => {
  fetch('https://api.coinmarketcap.com/v1/ticker/?convert=EUR&limit=4')
    .then((data) => {
      return data.json();
    }).then((json) => {
      var msg_output = [];

      // ugly, but trying to make output look nice
      for (var i=0;i<json.length;i++) {
        var price = json[i].price_eur;
        //msg_output.push(json[i].name + ': '+ price.substring(0, price.length - 7) + '€ - ')
        msg_output.push(`+------------------------+ \n |             ${json[i].symbol}: ${price.substring(0, price.length - 7)}€ \n`)
      }

      bot.sendAction('typing');
      msg_output.unshift(' |    Top 4 by market cap💰   \n')
      msg_output.unshift('+------------------------+ \n')
      msg_output.push('+------------------------+ \n')

      var result = msg_output.toString().replace(/,/g, '');
      msg.reply.text(result);
    })
    .then(() => {
      let replyMarkup = bot.inlineKeyboard([
          [
              bot.inlineButton('View chart (BTC)', {url: 'https://bitcoinwisdom.com/markets/bitcoinde/btceur'}),
              bot.inlineButton('View Chart (ETH)', {url: 'https://www.coingecko.com/en/price_charts/ethereum/eur'})
          ]
      ]);

      return bot.sendMessage(msg.from.id, '📈📉', {replyMarkup});
    })
    .catch((err) => {
      console.log(err)
    })
})

bot.on('/iss', (msg) => {
  fetch('http://api.open-notify.org/iss-now.json')
    .then(data => data.json())
    .then((json) => {
      msg.reply.text('Position of the International Space Station: ')
      bot.sendLocation(msg.from.id, json.iss_position.latitude, json.iss_position.longitude)
    })
})

// stupid heroku SIGTERM error fix
setInterval(() => {
  fetch('https://trellogram-skyboys.herokuapp.com/')
}, 30000)

bot.start();
