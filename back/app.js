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


Hae valojen tilat kantaan




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
    device: String, // "tre" + properties.ILMAISIN_ID
    distance: Number, // properties.ETAISYYS
    detector: String // properties.TUNNUS
});

var Light = mongoose.model('Light', lighschema);

var congestionschema = mongoose.Schema({
  hostId : String,
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

app.get('/congestion', function(req, res) {
  Congestion.find(function(err, response) {
    if (err) return console.error(err);
    res.send(response);
  });
});


app.get('/lights', function(req, res) {
  Light.find(function(err, response) {
    if (err) return console.error(err);
    res.send(response);
  });
});

// http://193.185.142.46/TrafficlightdataService/rest/get-traffic-queue-length-and-wait-time?device=tre309&historyMinutes=3

app.get('/HaeData', function(req, res) {

  var request = require("request")

  var url = "http://193.185.142.46/TrafficlightdataService/rest/get-traffic-queue-length-and-wait-time?device=tre309&historyMinutes=10"

  donearray = [];

  Light.find(function(err, lights) {
    if (err) return console.error(err);
    
    for (index = 0; index < lights.length; ++index) {

       u = lights[index]
       //if (donearray.indexOf(u.device) > -1){
        if (donearray.length > 0){
         continue
       }

       console.log('Waiting');
       var sleep = require("sleep");
       sleep.sleep(1);

      var url = "http://193.185.142.46/TrafficlightdataService/rest/get-traffic-queue-length-and-wait-time?"+
      "device="+u.device+"&"+
      "historyMinutes=2";
      console.log(url);
      http.get(url, function(rs){
          var body = '';
          console.log("Loopdi");
          rs.on('data', function(chunk){
              body += chunk;
          });

          rs.on('end', function(){
              try {
                console.log(body);
                var resp = JSON.parse(body);
                donedetector = [];
                for (index = 0; index < resp.results.length; ++index) {
                  if (donedetector.indexOf(resp.results[index].detector) > -1){
                    continue;
                  }
                  donedetector.push(resp.results[index].detector);
                  var men = false;
                  try {
                    var newItem = new Congestion({
                      coordinates:  resp.results[index].geometry.coordinates, // geometry.coordinates
                      hostId : u._id,
                      device: resp.results[index].device,
                      detector: resp.results[index].detector,
                      tsPeriodEnd: resp.results[index].tsPeriodEnd,
                      redPeriod: resp.results[index].redPeriod,
                      queueLength: resp.results[index].queueLength,
                      unitQueueLength: resp.results[index].unitQueueLength,
                      vehicleCount: resp.results[index].vehicleCount,
                      unitVehicleCount: resp.results[index].unitVehicleCount,
                      maxWaitTime: resp.results[index].maxWaitTime,
                      avgWaitTime: resp.results[index].avgWaitTime,
                      unitWaitTime: resp.results[index].unitWaitTime,
                      reliabValue: resp.results[index].reliabValue,
                      unitReliab: resp.results[index].unitReliab
                    });
                  }
                  catch(err) {
                      console.log(resp.features[index]);
                  }
                  finally{
                    Congestion.findOneAndUpdate({hostId: u._id}, {$set:newItem}, {new: true}, function(err, doc){
                      if(err){

                      }else{
                        console.log("paivitetty")
                        men = true;
                      }

                      });
                      if (men == false){
                        newItem.save(function(err, fluffy) {
                          if (err) return console.error(err);
                          console.log("sin men iha uus");

                        });
                      }


                  }
              }
              }
              catch(err) {
                  console.log(err)
                  console.log("valivaliälähaedataa");
              }

      });



      }).on('error', function(e){
            console.log("Got an error: ", e);
      });


      donearray.push(u.device)

    }

  });
res.send("Miksi Tama tulee ennenku on valmista?")

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
              device: "tre"+resp.features[index].properties.LIITTYMAN_NRO, // "tre" + properties.ILMAISIN_ID
              distance: resp.features[index].properties.ETAISYYS, // properties.ETAISYYS
              detector: resp.features[index].properties.TUNNUS
            });
          }
          catch(err) {
              console.log(resp.features[index]);
          }
          finally{

            newItem.save(function(err, fluffy) {
              if (err) return console.error(err);
              // console.log("sin men");
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
