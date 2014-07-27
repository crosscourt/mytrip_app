angular.module('myApp').controller('JournalEntryCtrl', function ($scope, $filter, JournalService, FoursquareService) {
		
	$scope.name = "save";
	
	// get exif data of the image
	var imageUri = $scope.ons.navigator.getCurrentPage().options.selectedImage;
	
	var imageData = { DateTimeOriginal: Date.now(), Latitude: 112, Longitude: 90 };
	
	//
	var place = FoursquareService.searchPlaces(imageData.Latitude, imageData.Longitude, 1);
	
	// probably need a callback to update this entry when the imageData returns
	// $filter('date')(imageData.DateTimeOriginal, 'medium')
	$scope.entry = { StartTime: imageData.DateTimeOriginal, Notes: "asd", Location: place, Images: [{ImageUrl: imageUri, Caption: ""}] };
	
	$scope.save = function() {
		
		// save the image to local disk
		
		// save entry to db
		var added = JournalService.addEntry($scope.entry);
		if (added) {
			$scope.ons.navigator.popPage();
		}
		
	};		
	
});