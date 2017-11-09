/*
Eskon muistiinpanot

http://193.185.142.46/TrafficlightdataService/rest/get-traffic-amount?historyMinutes=1&device=tre053&detector=a100_1
traffic amountti laitteelta

http://opendata.navici.com/tampere/opendata/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=opendata:WFS_LIIKENNEVALO_LIITTYMA&outputFormat=json&srsName=EPSG:4326
laite listaus sijainneilla

http://opendata.navici.com/tampere/opendata/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=opendata:WFS_LIIKENNEVALO_ILMAISIN&outputFormat=json&srsName=EPSG:4326
valo sijainti


http://infotripla.fi/LIIRA/DynniqTrafficlightdataService_ver1_2.pdf
Ohjeet kamoille

http://193.185.142.46/TrafficlightdataService/rest/get-traffic-queue-length-and-wait-time?device=tre309&historyMinutes=3
Valon tila


------------------------------------


http://opendata.navici.com/tampere/opendata/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=opendata:WFS_LIIKENNEVALO_ILMAISIN&outputFormat=json&srsName=EPSG:4326
valo sijainti

Hae valojen sijainnit
Tallenna kantaan.
>>>>





*/
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
    coordinates: [Number], // geometry.coordinates
    laite: String, // "tre" + properties.ILMAISIN_ID
    etaisyys: Number, // properties.ETAISYYS
    tunnus: String // properties.TUNNUS
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

// app.post('/newLight', function(req, res) {
//   console.log(req.body)
//   var newItem = new Light(req.body);
//       newItem.save(function(err, fluffy) {
//         if (err) return console.error(err);
//         console.log("sin men??");
//         res.send(fluffy);
//       });
//
// });


 // #######
 //    #    #    #  ####  #    # # #    #    #####   ##   #####  ##### ##### ###### ######
 //    #    #    # #      #   #  # ##   #      #    #  #  #    #   #     #   #      #
 //    #    #    #  ####  ####   # # #  #      #   #    # #    #   #     #   #####  #####
 //    #    #    #      # #  #   # #  # #      #   ###### #####    #     #   #      #
 //    #    #    # #    # #   #  # #   ##      #   #    # #   #    #     #   #      #
 //    #     ####   ####  #    # # #    #      #   #    # #    #   #     #   ###### ######


// app.post('/updateLight', function(req, res) {
//   console.log("/updateLight")
//   console.log(req.body)
//   var id = req.body.id
//   delete req.body.id;
//   Light.findByIdAndUpdate(id, { $set: req.body }, { new: true }, function (err, dat) {
//   if (err) return handleError(err);
//   res.send(dat);
// });
// });


app.get('/lights', function(req, res) {
  Light.find(function(err, response) {
    if (err) return console.error(err);
    res.send(response);
  });
});


app.get('/haeValot', function(req, res) {

  var request = require("request")

  var url = "http://opendata.navici.com/tampere/opendata/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=opendata:WFS_LIIKENNEVALO_ILMAISIN&outputFormat=json&srsName=EPSG:4326"


http.get(url, function(rs){
    var body = '';

    rs.on('data', function(chunk){
        body += chunk;
    });

    rs.on('end', function(){
        var resp = JSON.parse(body);
        // console.log(resp);
        Light.remove({}, function(){});

        for (index = 0; index < resp.features.length; ++index) {

          try {
            var newItem = new Light({
              coordinates:  resp.features[index].geometry.coordinates, // geometry.coordinates
              laite: "tre"+resp.features[index].properties.LIITTYMAN_NRO, // "tre" + properties.ILMAISIN_ID
              etaisyys: resp.features[index].properties.ETAISYYS, // properties.ETAISYYS
              tunnus: resp.features[index].properties.TUNNUS
            });
          }
          catch(err) {
              console.log(resp.features[index]);
          }
          finally{

            newItem.save(function(err, fluffy) {
              if (err) return console.error(err);
              console.log("sin men");
            });
          }


        }

        res.send("njoum");
    });
}).on('error', function(e){
      console.log("Got an error: ", e);
});




});






app.listen(expressPort);
