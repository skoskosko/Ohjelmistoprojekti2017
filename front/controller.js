var myapp = angular.module('myapp');
var servers = [];
//multi tag search


myapp.controller('route1', function($scope, $http) {


  $scope.lisaakantaan = function(){
    if (document.getElementById("textfield").value){
        pdata =  {};
        pdata.name = document.getElementById("textfield").value;
        document.getElementById("textfield").value = ""
        poster('http://localhost:3000/newLight', pdata, logger);
    }
  }

  var poster = function(url, data, handler){
    $http({
    method: 'POST',
    data: data,
    url: url
  }).then(function successCallback(response) {
      handler(response)
    }, function errorCallback(response) {
    });
  }

  var getter = function(url, handler){
    $http({
    method: 'GET',
    url: url
  }).then(function successCallback(response) {
      handler(response)
    }, function errorCallback(response) {
    });
  }

  var logger= function(data){
    console.log(data);
  }

  var datahandler = function(alert){
    servers = alert;
    $scope.data = servers;
    console.log(alert);
  }


  getter('http://localhost:3000/lights', datahandler);


  $scope.oneAtATime = true;

}).controller('route2', function($scope) {

});
