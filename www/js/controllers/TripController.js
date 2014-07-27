angular.module('myApp').controller('TripCtrl', function ($scope, TripsService) {
	$scope.trip = TripsService.selectedTrip;
  
	$scope.showPlans = function(index){
		var selectedItem = $scope.trips[index];
		TripsService.selectedTrip = selectedItem;
		$scope.ons.navigator.pushPage('PlansPage.html', {title: selectedItem.name});
	}
  
});