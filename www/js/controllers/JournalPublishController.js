angular.module('myApp').controller('JournalPublishCtrl', function ($scope, $filter, JournalService, CloudinaryService) {
		
	// $filter('date')(imageData.DateTimeOriginal, 'medium')
	$scope.trip = { Name: "", StartTime: new Date(), StartTimeDisplay: "", EndTime: new Date(), EndTimeDisplay: "", Privacy: "friends" };
	
	var startTime = $scope.ons.navigator.getCurrentPage().options.start;
	var endTime = $scope.ons.navigator.getCurrentPage().options.end;

	$scope.trip.StartTime.getDisplayDateTime(function(displayString){
		$scope.trip.StartTimeDisplay = displayString;
	});
	
	$scope.trip.EndTime.getDisplayDateTime(function(displayString){
		$scope.trip.EndTimeDisplay = displayString;
	});
	
	$scope.publish = function() {
		
		// perform validations? check if locations are set

		var activities = JournalService.getEntriesBetweenDates(startTime, endTime);

		// call server to create trip

		// update activities with trip id or mark as uploaded

		// upload images or mark them as ready for upload
		CloudinaryService.uploadImage(activities[0].images[0].ImageUrl, function(result){
			alert(result);
		});

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