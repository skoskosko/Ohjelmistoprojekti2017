/*


Mene osoitteeseen

:3000/lights
Jos ei o valoja käy osoitteessa
:3000/haeValot
jos on valoja käy osoitteessa
:3000/congestion
jos ei ole tietoja käy osoitteessa
:3000/HaeData
sitten taas kun dataakin löytyy voit hakea entrytjä
osoitteesta
:3000/getCongestion
parametreilla
lat long dist
eli latitude londitude ja etäisyys siitä pisteestä kuin kaukaa haluu dataa


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

app.get('/getTrafamount', function(req, res) {

    var parts = url.parse(req.url, true);
    var query = parts.query;

    // lat
    // long
    // dist
    Trafamount.find(function(err, allItems) {
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






    // Congestion.find(function(err, response) {
    //     if (err) return console.error(err);
    //     res.send(response);
    //   });


});


app.get('/getCongestion', function(req, res) {

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






    // Congestion.find(function(err, response) {
    //     if (err) return console.error(err);
    //     res.send(response);
    //   });


});


app.get('/Trafamount', function(req, res) {

    Trafamount.find(function(err, response) {
        if (err) return console.error(err);
        res.send(response);
    });


});

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

app.get('/HaeData', function(req, res) { // get-traffic-queue-length-and-wait-time

    var request = require("request")

    donearray = [];
    lights = []
    Light.find(function(err, light) {
        if (err) return console.error(err);
        handleLights(light);

    });

    function handleLights(lights) {

        for (index = 0; index < lights.length; ++index) {
            u = lights[index]
            if (donearray.indexOf(u.device) > -1) {
                //if (donearray.length > 0){
                continue
            }
            SaveDeviceInfoToDB(u.device);
            donearray.push(u.device)
        }

    }


    console.log("ny ollaan lopussa");
    res.send("Miksi Tama tulee ennenku on valmista?")
});


app.get('/HaeDataAmount', function(req, res) { // gget-traffic-amount
    var request = require("request")

    var url = "http://193.185.142.46/TrafficlightdataService/rest/get-traffic-amount?device=tre306&detector=d50"

    donearray = [];
    lights = []
    Light.find(function(err, light) {
        if (err) return console.error(err);
        handleLights(light);

    });

    function handleLights(lights) {

        for (index = 0; index < lights.length; ++index) {
            u = lights[index]
            if (donearray.indexOf(u.device) > -1) {
                //if (donearray.length > 0){
                continue
            }
            SaveTrafAmountToDB(u.device);
            donearray.push(u.device)
        }

    }

    res.send("trafficamounttiahaetaansiälätaustallameinaaperkele")
});


function SaveTrafAmountToDB(device){ // get-traffic-amount

  var url = "http://193.185.142.46/TrafficlightdataService/rest/get-traffic-amount?" +
      "device=" + device + "&" +
      "historyMinutes=3";
  console.log(url);


  request.get({
      url: url,
      json: true,
      headers: {
          'User-Agent': 'request'
      }
  }, (err, res, resp) => {
      if (err) {
          console.log('Error:', err);
      } else if (res.statusCode !== 200) {
          console.log('Status:', res.statusCode);
      } else {
          // data is already parsed as JSON:
          //console.log(resp);
          console.log(resp.results.length);
          console.log("Loopdy");
          try {
              // Congestion.remove({}, function() {});
              donedetector = [];
              for (index = 0; index < resp.results.length; ++index) {
                  console.log("result");
                  if (donedetector.indexOf(resp.results[index].detector) > -1) {
                      continue;
                  }
                  donedetector.push(resp.results[index].detector);
                  var men = false;
                  try {
                      var newItem = new Trafamount({
                          hostId: u._id,
                          device: resp.results[index].device,
                          detector: resp.results[index].detector,
                          coordinates: u.coordinates,
                          tsPeriodEnd: resp.results[index].tsPeriodEnd,
                          countPeriod: resp.results[index].countPeriod,
                          trafficAmount: resp.results[index].trafficAmount,
                          unitTrafficAmount: resp.results[index].unitTrafficAmount,
                          reliabValue: resp.results[index].reliabValue,
                          unitReliab: resp.results[index].unitReliab,
                      });
                      console.log("item in");
                      Trafamount.findOneAndUpdate({
                          hostId: u._id
                      }, {
                          newItem
                      }, {
                          new: true
                      }, function(err, doc) {
                          if (err) {

                          } else {
                              console.log("paivitetty")
                              men = true;
                          }

                      });
                      if (men == false) {
                          newItem.save(function(err, fluffy) {
                              if (err) return console.error(err);
                              console.log("sin men iha uus");
                          });
                      }
                  } catch (err) {
                      console.log(err);
                      console.log(resp.features[index]);
                  }
              }
          } catch (err) {
              console.log(err)
              console.log("valivaliälähaedataa");
          }
      }
  });

}


function SaveDeviceInfoToDB(device) { // get-traffic-queue-length-and-wait-time


    var url = "http://193.185.142.46/TrafficlightdataService/rest/get-traffic-queue-length-and-wait-time?" +
        "device=" + device + "&" +
        "historyMinutes=2";
    console.log(url);


    request.get({
        url: url,
        json: true,
        headers: {
            'User-Agent': 'request'
        }
    }, (err, res, resp) => {
        if (err) {
            console.log('Error:', err);
        } else if (res.statusCode !== 200) {
            console.log('Status:', res.statusCode);
        } else {
            // data is already parsed as JSON:
            //console.log(resp);
            console.log(resp.results.length);
            console.log("Loopdy");
            try {
                // Congestion.remove({}, function() {});
                donedetector = [];
                for (index = 0; index < resp.results.length; ++index) {
                    console.log("result");
                    if (donedetector.indexOf(resp.results[index].detector) > -1) {
                        continue;
                    }
                    donedetector.push(resp.results[index].detector);
                    var men = false;
                    try {
                        var newItem = new Congestion({
                            hostId: u._id,
                            device: resp.results[index].device,
                            detector: resp.results[index].detector,
                            coordinates: u.coordinates,
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
                        console.log("item in");
                        Congestion.findOneAndUpdate({
                            hostId: u._id
                        }, {
                            newItem
                        }, {
                            new: true
                        }, function(err, doc) {
                            if (err) {

                            } else {
                                console.log("paivitetty")
                                men = true;
                            }

                        });
                        if (men == false) {
                            newItem.save(function(err, fluffy) {
                                if (err) return console.error(err);
                                console.log("sin men iha uus");
                            });
                        }
                    } catch (err) {
                        console.log(err);
                        console.log(resp.features[index]);
                    }
                }
            } catch (err) {
                console.log(err)
                console.log("valivaliälähaedataa");
            }
        }
    });

}


app.get('/haeValot', function(req, res) { // WFS_LIIKENNEVALO_ILMAISIN

    var request = require("request")

    var url = "http://opendata.navici.com/tampere/opendata/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=opendata:WFS_LIIKENNEVALO_ILMAISIN&outputFormat=json&srsName=EPSG:4326"

    http.get(url, function(rs) {
        var body = '';

        rs.on('data', function(chunk) {
            body += chunk;
        });

        rs.on('end', function() {
            var resp = JSON.parse(body);
            console.log(resp);
            Light.remove({}, function() {});

            for (index = 0; index < resp.features.length; ++index) {

                try {
                    var newItem = new Light({
                        coordinates: resp.features[index].geometry.coordinates, // geometry.coordinates
                        device: "tre" + resp.features[index].properties.LIITTYMAN_NRO, // "tre" + properties.ILMAISIN_ID
                        distance: resp.features[index].properties.ETAISYYS, // properties.ETAISYYS
                        detector: resp.features[index].properties.TUNNUS
                    });
                } catch (err) {
                    console.log(resp.features[index]);
                } finally {

                    newItem.save(function(err, fluffy) {
                        if (err) return console.error(err);
                        // console.log("sin men");
                    });
                }


            }

            res.send("njoum");
        });
    }).on('error', function(e) {
        console.log("Got an error: ", e);
    });
});






app.listen(expressPort);
