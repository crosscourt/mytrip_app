angular.module('myApp').controller('TripInputCtrl', function ($scope, TripsService) {
	$scope.trip = TripsService.selectedTrip;
 
	$scope.save = function(){
		//var newTrip = TripsService.Save
		TripsService.selectedTrip = { name: 'new' };
		
		$scope.ons.navigator.resetToPage('TripPage.html', {title: 'Trip'});
	}
  
});