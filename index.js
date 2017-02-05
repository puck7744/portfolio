var express = require('express');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var sendmail = require('sendmail');
var form = require('express-form');
var fs = require('fs');
var path = require('path');

var app = express();
var field = form.field; // Shorthand for using express-form

// Set up Express environment
app.set('port', (process.env.PORT || 5000));
app.set('views', 'views');
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(favicon('public/favicon.ico'));
app.use(bodyParser.urlencoded({
  extended: false.
}));

/*
 * Handle submission and verification of the contact form
 */
app.post(
  '/contact/send',
  form(
    field('name').trim().required().is(/^[a-z0-9 `\-]+$/i),
    field('email').trim().required().isEmail(),
    field('message').required().is(/^[\w\s]+$/)
  ),
  function(request, response) {
    if (request.form.isValid) {
      sendmail({
        from: `"${request.form.name}" <${request.form.email}>`,
        to: 'niftyws@gmail.com',
        subject: 'Portfolio contact from '+request.form.name,
        html: request.form.message,
      });
    }

    response.redirect('/?fpostsub=true');
  }
);

// Handle rendering of the main pages
app.get(['/', '/:page'], function(request, response) {
  response.render('index', {
    page: request.params.page||'home'
  });
});

// Start the app
app.listen(app.get('port'));
