angular.module('myApp').controller('JournalCtrl', function ($scope, JournalService) {

	$scope.journalItems = [];

	$scope.loadData = function () {
		JournalService.getEntries().then(function(activities){
			
			var activityGroups = groupEntriesByDateAndLocation(activities);
			
			// add extra view properties 
			for (var i=0; i<activityGroups.length; i++) {				
				var group = activityGroups[i]; //{ Entry: activityGroups[i], IsStart: false, IsEnd: false };			
				for (var j=0; j<group.Activities.length; j++) {
					var activity = group.Activities[j];
					activity.IsStart = j == 0 ? true :false;
					activity.IsEnd = j == 1 ? true: false;
				}				
			}
			
			$scope.journalItems = activityGroups;
		});
	}

	function groupEntriesByDateAndLocation(activities) {
		var prevDate;
		var prevLocation;
		var activityGroups = [];
		var group;
		var i = 0;
		
		while(i<activities.length){
			var activity = activities[i];
			var currentDate = activity.StartTime; //new Date(Date.parse(item.StartTime)); // grouping needs to be done using local time
			var currentLocation = activity.LocationName;
			
			if (!currentDate.sameDay(prevDate) && prevLocation != currentLocation) {
				group = { Date: currentDate, Location: currentLocation, Activities: [] };
				activityGroups.push(group);
			}
			
			group.Activities.push(activity);			
			
			prevDate = currentDate;
			prevLocation = currentLocation;
			i++
		}
		
		return 	activityGroups;
	}
	
	
	$scope.loadData();

	$scope.fetchMore = function() {
		//alert('aa');
	};
	
	$scope.canShare = function() {
		// have set start and end, start is before end
		var startActivity = getEntryByProperty('IsStart');
		var endActivity = getEntryByProperty('IsEnd');
		
		if (startActivity != null && endActivity != null && startActivity.StartTime <= endActivity.StartTime) {
			return true;
		}
		
		return false;
	};
	
	$scope.moreActions = function(id) {
		$scope.currentEntryId = id;
	
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
		var startActivity = getEntryByProperty('IsStart');
		var endActivity = getEntryByProperty('IsEnd');
		
		if (startActivity != null && endActivity != null) {
			$scope.ons.navigator.pushPage('journalPublishPage.html', { start: startActivity.StartTime, end: endActivity.StartTime });
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
		clearAllByProperty("IsStart");	
		setEntryByProperty("IsStart", $scope.currentEntryId);
	}
	
	function setTripEnd() {		
		clearAllByProperty("IsEnd");
		setEntryByProperty("IsEnd", $scope.currentEntryId);
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
		myNavigator.on('postpop', function(event) {
			var page = event.currentPage; // Get current page object
			if (true) {
			  $scope.loadData();
			}
		});
  
		//$scope.ons.navigator.pushPage('journalEntryPage.html', {selectedImage: imageUri});
		myNavigator.pushPage('journalEntryPage.html', {selectedImage: imageUri});
    }

    function getPhotoFail(message) {
      alert('Failed because: ' + message);
    }
	
	function getEntryByProperty(key) {		
		for (var i=0; i<$scope.journalItems.length; i++) {
			var group = $scope.journalItems[i];
			for (var j=0; j<group.Activities.length; j++) {
				if (group.Activities[j][key]) {
					return group.Activities[j];
				}
			}
		}
		
		return null;
	}
	
	function setEntryByProperty(key, id) {
		for (var i=0; i<$scope.journalItems.length; i++) {
			var group = $scope.journalItems[i];
			for (var j=0; j<group.Activities.length; j++) {
				if (group.Activities[j].Id == id) {
					group.Activities[j][key] = true;
				}
			}
		}
		
		return null;
	}
	
	function clearAllByProperty(key) {
		for (var i=0; i<$scope.journalItems.length; i++) {
			var group = $scope.journalItems[i];
			for (var j=0; j<group.Activities.length; j++) {
				if (group.Activities[j][key]) {
					group.Activities[j][key] = false;
				}
			}
		}
	}
	
});