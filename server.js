var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
process.env.COSMIC_BUCKET='cosmic-real-estate';

app.use(express.static(__dirname + '/public'));


require('./app/routes')(app);

app.listen(port);

exports = module.exports = app;
