angular.module('myApp').controller('JournalCtrl', function ($scope, JournalService) {

	$scope.loadData = function () {
		JournalService.getEntries().then(function(data){
			
			// wrap the entry in an item 
			var items = [];
			for (var i=0; i<data.length; i++) {
				var item = { Entry: data[i], IsStart: false, IsEnd: false };
				items.push(item);
			}
			
			$scope.journalItems = items;
		});
	}

	$scope.loadData();

	$scope.fetchMore = function() {
		//alert('aa');
	};
	
	$scope.canShare = function() {
		// have set start and end, start is before end
		var startIndex = getStartEntryIndex();
		var endIndex = getEndEntryIndex();
		
		if (startIndex != -1 && endIndex != -1 && startIndex <= endIndex) {
			return true;
		}
		
		return false;
	};
	
	$scope.moreActions = function(index) {
		$scope.currentEntryIndex = index;
	
		var options = {
	        'buttonLabels': ['Set Trip Start', 'Set Trip End'],
	        'addCancelButtonWithLabel': 'Cancel'
		    };

	    window.plugins.actionsheet.show(options, tripActionCallback);
	}
	
	$scope.addEntry = function() {	
		// get image
		var options = {
	        'buttonLabels': ['Take Photo', 'Choose Existing Photo'],
	        'addCancelButtonWithLabel': 'Cancel'
		    };

	    window.plugins.actionsheet.show(options, photoActionCallback);
	};
	
	$scope.publish = function() {
		var startIndex = getStartEntryIndex();
		var endIndex = getEndEntryIndex();
		
		if (startIndex != -1 && endIndex != -1) {
			var startEntryDate = $scope.journalItems[startIndex].StartTime;
			var endEntryDate = $scope.journalItems[endIndex].StartTime;
			
			$scope.ons.navigator.pushPage('journalPublishPage.html', { start: startEntryDate, end: endEntryDate });
		}
		
	};
	
	var tripActionCallback = function (buttonIndex) {
		if (buttonIndex == 1) { // trip start
			setTripStart();
		}
		else if (buttonIndex == 2) { // trip end
			setTripEnd();
		}
	}
	
	function setTripStart() {
		clearStart();
	
		var item = $scope.journalItems[$scope.currentEntryIndex];
		item.IsStart = true;
	}
	
	function setTripEnd() {		
		clearEnd();
	
		var item = $scope.journalItems[$scope.currentEntryIndex];
		item.IsEnd = true;
	}
	
	var photoActionCallback = function (buttonIndex) {
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
	/*
	function getEntryIndexByStatus(status) {
		var index = -1;
		for (var i=0; i<$scope.journalItems.length; i++) {
			var item = $scope.journalItems[i];
			if (item.Status == status) {
				index = i;
				break;
			}
		}
		
		return index;
	}
	
	function clearAllStatus(status) {
		for (var i=0; i<$scope.journalItems.length; i++) {
			var item = $scope.journalItems[i];
			if (item.Status == status) {
				item.Status = '';
			}
		}
	}
	*/
	function getStartEntryIndex(status) {
		var index = -1;
		for (var i=0; i<$scope.journalItems.length; i++) {
			var item = $scope.journalItems[i];
			if (item.IsStart) {
				index = i;
				break;
			}
		}
		
		return index;
	}
	
	function getEndEntryIndex(status) {
		var index = -1;
		for (var i=0; i<$scope.journalItems.length; i++) {
			var item = $scope.journalItems[i];
			if (item.IsEnd) {
				index = i;
				break;
			}
		}
		
		return index;
	}
	
	function clearStart() {
		for (var i=0; i<$scope.journalItems.length; i++) {
			var item = $scope.journalItems[i];
			if (item.IsStart) {
				item.IsStart = false;
			}
		}
	}
	
	function clearEnd() {
		for (var i=0; i<$scope.journalItems.length; i++) {
			var item = $scope.journalItems[i];
			if (item.IsEnd) {
				item.IsEnd = false;
			}
		}
	}
	
});