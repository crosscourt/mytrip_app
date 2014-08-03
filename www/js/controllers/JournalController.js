angular.module('myApp').controller('JournalCtrl', function ($scope, JournalService) {

	$scope.loadData = function () {
		JournalService.getEntries().then(function(data){
		  $scope.journalEntries = data;
		});
	}

	$scope.loadData();

	$scope.fetchMore = function() {
		//alert('aa');
	};	
	
	$scope.addEntry = function() {
	
		// get image
		var options = {
	        'buttonLabels': ['Take Photo', 'Choose Existing Photo'],
	        'addCancelButtonWithLabel': 'Cancel'
		    };

	    window.plugins.actionsheet.show(options, actionCallback);
	};
	
	$scope.publish = function() {
		$scope.ons.navigator.pushPage('journalPublishPage.html');
	};
	
	var actionCallback = function (buttonIndex) {
		if (buttonIndex == 1) {
			alert("clicked 1");
		}
		else if (buttonIndex == 2) {
			getPhotos();
		}
	}

	
	function getPhotos(){
        navigator.camera.getPicture(getPhotoSuccess, getPhotoFail, { 
          quality: 50,
          sourceType : Camera.PictureSourceType.SAVEDPHOTOALBUM,
          destinationType: Camera.DestinationType.FILE_URI
        });
    }

    function getPhotoSuccess(imageUri) {
        
		//console.log("imageUri=" + imageUri);
		// part 1 - copy photo to app dir
		//window.resolveLocalFileSystemURI(imageUri, gotFileEntry, fsFail); 

		// part 2
		/*
		cordova.plugins.ImageUtility.getExifData(imageUri, function(jsonResult) {
			var data = JSON.parse(jsonResult);
			//alert(data["{GPS}"]["Longitude"]);
		}, function(err) {
			console.log("unable to get EXIF from " + imageUri);
		});
		*/
		$scope.ons.navigator.on('postpop', function(event) {
			var page = event.currentPage; // Get current page object
			if (true) {
			  $scope.loadData();
			}
		});
  
		$scope.ons.navigator.pushPage('journalEntryPage.html', {selectedImage: imageUri});
    }

    function getPhotoFail(message) {
      alert('Failed because: ' + message);
    }
	
});