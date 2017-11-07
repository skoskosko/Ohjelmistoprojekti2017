"use strict";
process.title = 'gabay';

var expressPort = 3000; // port you want your express in
var http = require('http');
var fs = require('fs'),
  path = require('path');
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
db.once('open', function() {
  // we're connected!
});

var lighschema = mongoose.Schema({
  name: String
});
var Light = mongoose.model('Light', lighschema);



console.log("test");
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.post('/newLight', function(req, res) {
  console.log(req.body)
  var newItem = new Light(req.body);
      newItem.save(function(err, fluffy) {
        if (err) return console.error(err);
        console.log("sin men??");
        res.send(fluffy);
      });

});


 // #######
 //    #    #    #  ####  #    # # #    #    #####   ##   #####  ##### ##### ###### ######
 //    #    #    # #      #   #  # ##   #      #    #  #  #    #   #     #   #      #
 //    #    #    #  ####  ####   # # #  #      #   #    # #    #   #     #   #####  #####
 //    #    #    #      # #  #   # #  # #      #   ###### #####    #     #   #      #
 //    #    #    # #    # #   #  # #   ##      #   #    # #   #    #     #   #      #
 //    #     ####   ####  #    # # #    #      #   #    # #    #   #     #   ###### ######


app.post('/updateLight', function(req, res) {
  console.log("/updateLight")
  console.log(req.body)
  var id = req.body.id
  delete req.body.id;
  Light.findByIdAndUpdate(id, { $set: req.body }, { new: true }, function (err, dat) {
  if (err) return handleError(err);
  res.send(dat);
});
});


app.get('/lights', function(req, res) {
  Light.find(function(err, response) {
    if (err) return console.error(err);
    res.send(response);
  });
});

app.listen(expressPort);
