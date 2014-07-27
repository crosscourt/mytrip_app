angular.module('myApp').controller('ActivitiesCtrl', function ($scope, TripsService) {
	
	$scope.plan = TripsService.selectedPlan;   
	$scope.activities = [{time:'11:00am', notes: "catch the midnight plane to somewhere", images:[{imageUrl: ''},{imageUrl: ''}]}, {time:'01:00pm', notes: "arrive at destination"}];
  
	//TripsService.getTrips(getTripsCallback);
  
	function getTripsCallback(data){
		alert(data);
	}
  
	
  
});