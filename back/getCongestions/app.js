process.title = 'getCongestions';

var expressPort = 3333; // port you want your express in
var http = require('http');
var fs = require('fs'),
    path = require('path');
var bodyParser = require('body-parser')
var express = require('express');
var app = express();
var sleep = require("sleep");
var request = require('request');
var url = require('url');
var GeoPoint = require('geopoint');

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


var trafamountschema = mongoose.Schema({
      hostId: String,
      device: String,
      detector: String,
      coordinates: [Number],
      tsPeriodEnd: String,
      countPeriod: Number,
      trafficAmount: Number,
      unitTrafficAmount: String,
      reliabValue: Number,
      unitReliab: String,
});


var Trafamount = mongoose.model('Trafamount', trafamountschema);


var congestionschema = mongoose.Schema({
    hostId: String,
    coordinates: [Number],
    device: String,
    detector: String,
    tsPeriodEnd: String,
    redPeriod: Number,
    queueLength: Number,
    unitQueueLength: String,
    vehicleCount: Number,
    unitVehicleCount: String,
    maxWaitTime: Number,
    avgWaitTime: Number,
    unitWaitTime: String,
    reliabValue: Number,
    unitReliab: String
});


var Congestion = mongoose.model('Congestion', congestionschema);


console.log("test");
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


app.get('/congestions/getCongestion', function(req, res) {

    var parts = url.parse(req.url, true);
    var query = parts.query;

    // lat
    // long
    // dist
    Congestion.find(function(err, allItems) {
        if (err) return console.error(err);
    }).exec(function(err, allItems) {
        var resItems = [];
        for (index = 0; index < allItems.length; ++index) {
            try {
                var User = statueOfLiberty = new GeoPoint(parseFloat(query.lat), parseFloat(query.long));
                var Item = statueOfLiberty = new GeoPoint(allItems[index].coordinates[0], allItems[index].coordinates[1]);

            } catch (e) {
                res.send(e);
                return

            }


            if (Item.distanceTo(User, true) < parseFloat(query.dist)) {
                resItems.push((allItems[index]));
            }
        }
        res.send(resItems);

    });

});


app.get('/congestions/', function(req, res) {

    Congestion.find(function(err, response) {
        if (err) return console.error(err);
        res.send(response);
    });


});

app.listen(expressPort);
