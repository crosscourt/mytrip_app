angular.module('myApp').controller('JournalPublishCtrl', function ($scope, $filter, JournalService, CloudinaryService) {
		
	// $filter('date')(imageData.DateTimeOriginal, 'medium')
	$scope.trip = { Name: "", StartTime: new Date(), StartTimeDisplay: "", EndTime: new Date(), EndTimeDisplay: "", Privacy: "friends" };
	
	$scope.trip.StartTime.getDisplayDateTime(function(displayString){
		$scope.trip.StartTimeDisplay = displayString;
	});
	
	$scope.trip.EndTime.getDisplayDateTime(function(displayString){
		$scope.trip.EndTimeDisplay = displayString;
	});
	
	$scope.publish = function() {
				

				
		if (true) {
			$scope.ons.navigator.popPage();
		}
		
	};		

	$scope.showStartTimePicker = function() {
		var options = {
		  date: $scope.trip.StartTime,
		  mode: 'datetime'
		};

		window.plugins.datePicker.show(options, function(date){
			$scope.trip.StartTime = date;
			
			$scope.trip.StartTime.getDisplayDateTime(function(displayString){
				$scope.trip.StartTimeDisplay = displayString;
			});
		});
	}
	
	$scope.showEndTimePicker = function() {
		var options = {
		  date: $scope.trip.EndTime,
		  mode: 'datetime'
		};

		window.plugins.datePicker.show(options, function(date){
			$scope.trip.EndTime = date;
			
			$scope.trip.EndTime.getDisplayDateTime(function(displayString){
				$scope.trip.EndTimeDisplay = displayString;
			});
		});
	}
	
});