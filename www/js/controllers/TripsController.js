angular.module('myApp').controller('TripsCtrl', function ($scope, $swipe, TripsService) {
	$scope.trips = [{name: "trip to abc, Dec '10"}, {name: "GP Singapore"}, {name: "Boracay"}];
  
	//TripsService.getTrips(getTripsCallback);
	
  
	angular.element(document).ready(function () {
        var testDiv = angular.element(document.querySelector('#test'));
		$swipe.bind(testDiv, {
			'start': function(coords) { alert('start'); },
			'move': function(coords) { alert('move'); }			
		});
    });
  
	function getTripsCallback(data){
		alert(data);
	}
  
	$scope.showPlans = function(index){
		var selectedItem = $scope.trips[index];
		TripsService.selectedTrip = selectedItem;
		$scope.ons.navigator.pushPage('PlansPage.html', {title: selectedItem.name});
	}
  
});