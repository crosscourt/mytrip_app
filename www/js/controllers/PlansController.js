angular.module('myApp').controller('PlansCtrl', function ($scope, TripsService) {
	
	$scope.trip = TripsService.selectedTrip;   
	$scope.plans = [{day:'Day 1', name: "fly to somewhere"}, {day:'Day 2', name: "Beatles tour"}];
  
	//TripsService.getTrips(getTripsCallback);
  
	function getTripsCallback(data){
		alert(data);
	}
  
	$scope.showActivities = function(index){
		var selectedPlan = $scope.plans[index];
		TripsService.selectedPlan = selectedPlan;
		$scope.ons.navigator.pushPage('ActivitiesPage.html', {title: selectedPlan.name});
	}
  
});