angular.module('myApp').service('FoursquareService', function () {
  // ...
  var db = null;
  
  var service = {
	searchPlaces: function(lat, lng, maxResults) {
		return { Id: "1", Name: "abc"};
	}
  };
  
  return service;
  
});