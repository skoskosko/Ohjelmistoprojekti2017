process.title = 'getLights';

var expressPort = 3333; // port you want your express in
// var http = require('http');
// var fs = require('fs'),
//     path = require('path');
var bodyParser = require('body-parser')
var express = require('express');
var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://db:27017', {
    useMongoClient: true,
    /* other options */
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() { // we're connected!
});

var lighschema = mongoose.Schema({
    coordinates: [Number], // geometry.coordinates
    device: String, // "tre" + properties.ILMAISIN_ID
    distance: Number, // properties.ETAISYYS
    detector: String // properties.TUNNUS
});


var Light = mongoose.model('Light', lighschema);


app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


app.get('/lights/', function(req, res) {
  console.log("valot haettu!!");
    Light.find(function(err, response) {
        if (err) return console.error(err);
        res.send(response);
    });
});


app.listen(expressPort);
