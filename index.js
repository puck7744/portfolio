var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
//app.use(favicon('public/favicon.ico'));

app.get('/', function(request, response) {
  response.render('index');
})

app.listen(app.get('port'));
