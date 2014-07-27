angular.module('myApp').controller('JournalCtrl', function ($scope, JournalService) {

	JournalService.getEntries().then(function(data){
	  $scope.journalEntries = data;
	});

	$scope.fetchMore = function() {
		//alert('aa');
	};	
	
	var actionCallback = function (buttonIndex) {
		if (buttonIndex == 1) {

		}
		else if (buttonIndex == 2) {

		}
	}

	$scope.addEntry = function() {

		getPhotos();
		//alert('actionsheet');
		// get image
		var options = {
	        'buttonLabels': ['Take Photo', 'Choose Existing Photo'],
	        'addCancelButtonWithLabel': 'Cancel'
		    };

	    window.plugins.actionsheet.show(options, actionCallback);
		
		
		//$scope.ons.navigator.pushPage('journalEntryPage.html', {selectedImage: "Penguins.jpg"})
	};

	function getPhotos(){
        navigator.camera.getPicture(onSuccess, onFail, { 
          quality: 50,
          sourceType : Camera.PictureSourceType.SAVEDPHOTOALBUM,
          destinationType: Camera.DestinationType.FILE_URI
        });
    }

    function onSuccess(imageUri) {
        alert(imageUri);
		//console.log("imageUri=" + imageUri);
		// part 1 - copy photo to app dir
		//window.resolveLocalFileSystemURI(imageUri, gotFileEntry, fsFail); 

		// part 2
		//cordova.plugins.ImageUtility.getExifData(imageUri, function(jsonResult) {
		//  var data = JSON.parse(jsonResult);
		//  alert(data["{GPS}"]["Longitude"]);
		//}, function(err) {
		//  alert(err);
		//});

    }

    function onFail(message) {
      alert('Failed because: ' + message);
    }
	
});