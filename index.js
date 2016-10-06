const express = require('express')
    , bodyParser = require('body-parser')
    , config = require('./config');
const stripe = require('stripe')(config.testSecretKey);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/node_modules', express.static('./node_modules'));
app.use(express.static('./public'));

app.post('/api/charge', function(req, res) {
  console.log(req.body);


  // Get the credit card details submitted by the form
  var token = req.body.stripeToken; // Using Express

  // Create a charge: this will charge the user's card
  var charge = stripe.charges.create({
   amount: '2000', // Amount in cents
   currency: "usd",
   source: token,
   description: "Example charge"
  }, function(err, charge) {
   if (err && err.type === 'StripeCardError') {
     // The card has been declined
     console.log('err', err);
   } else {
     console.log('ARGS', arguments);
     // Store order status
     console.log('CHARGE', charge);
     res.status(200).send(charge);
   }
  });
})

const port = 3000;
app.listen(port, function() {
  console.log('Listening on port');
})
