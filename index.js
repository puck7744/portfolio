var express = require('express');
var favicon = require('serve-favicon');
var marked = require('marked');
var fs = require('fs');
var path = require('path');

var app = express();

app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(favicon('public/favicon.ico'));

app.get(['/', '/:page'], function(request, response) {
  var workEntries = {};
  fs.readdirSync('views/work/content').forEach((file) => {
    workEntries[path.basename(file, path.extname(file))] = marked(fs.readFileSync('views/work/content/'+file, 'utf8'));
  });

  response.render('index', {
    page: request.params.page||'home',
    work: workEntries
  });
})

app.listen(app.get('port'));
