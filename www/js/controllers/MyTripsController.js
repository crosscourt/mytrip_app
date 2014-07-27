angular.module('myApp').controller('MyTripsCtrl', function ($scope, TripsService) {
	$scope.trips = [{name: "trip to abc, Dec '10"}, {name: "GP Singapore"}];
  
	//TripsService.getTrips(getTripsCallback);
  
	function getTripsCallback(data){
		alert(data);
	}
  
	$scope.addTrip = function(){
		TripsService.selectedTrip = null;
		$scope.ons.navigator.pushPage('tripInputPage.html');
	}
  
	$scope.showPlans = function(index){
		var selectedItem = $scope.trips[index];
		TripsService.selectedTrip = selectedItem;
		$scope.ons.navigator.pushPage('PlansPage.html', {title: selectedItem.name});
	}
  
});