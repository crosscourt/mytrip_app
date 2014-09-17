angular.module('myApp').controller('JournalPublishCtrl', function ($scope, $filter, JournalService, CloudinaryService) {
		
	var startTime = $scope.ons.navigator.getCurrentPage().options.start;
	var endTime = $scope.ons.navigator.getCurrentPage().options.end;
	$scope.trip = { Name: "", StartTime: startTime, StartTimeDisplay: "", EndTime: endTime, EndTimeDisplay: "", Privacy: "friends" };

	$scope.trip.StartTime.getDisplayDateTime(function(displayString){
		$scope.trip.StartTimeDisplay = displayString;
	});
	
	$scope.trip.EndTime.getDisplayDateTime(function(displayString){
		$scope.trip.EndTimeDisplay = displayString;
	});
	
	$scope.publish = function() {
		
		// perform validations? check if locations are set

		JournalService.getEntriesBetweenDates(startTime, endTime).then(uploadImages);

		// call server to create trip

		// update activities with trip id or mark as uploaded

		// upload images or mark them as ready for upload
		

		if (true) {
			$scope.ons.navigator.popPage();
		}
		
	};	

	function uploadImages(activities) {
		alert(activities.length);

		CloudinaryService.uploadImage(activities[0].Images[0].ImageUrl, function(result){
			alert(result);
		});
	}

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