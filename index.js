var express = require('express');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var marked = require('marked');
var sendmail = require('sendmail');
var form = require('express-form');
var fs = require('fs');
var path = require('path');

var app = express();
var field = form.field;

app.set('port', (process.env.PORT || 5000));
app.set('views', 'views');
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(favicon('public/favicon.ico'));
app.use(bodyParser.urlencoded({
   extended: false
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

app.get(['/', '/:page'], function(request, response) {
  var workEntries = {};
  var files = fs.readdirSync('content/work');

  files.forEach((file, index) => {
    var workId = path.basename(file, path.extname(file));
    var workTitle = workId.replace(/-/g, ' ').replace(/\w+\s*/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    var prevFile = (index == 0 ? files[files.length-1] : files[index-1]);
    var nextFile = (index == files.length-1 ? files[0] : files[index+1])

    workEntries[workId] = {
      id: workId,
      title: workTitle,
      blurb: marked(fs.readFileSync('content/work/'+file, 'utf8')),
      previous: path.basename(prevFile, path.extname(prevFile)),
      next: path.basename(nextFile, path.extname(nextFile))
    }
  });

  response.render('index', {
    page: request.params.page||'home',
    content: {
      about: marked(fs.readFileSync('content/about/index.md', 'utf8')),
      work: workEntries
    }
  });
});

app.listen(app.get('port'));
