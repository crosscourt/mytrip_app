angular.module('myApp').config(window.$QDecorator).controller('JournalEntryCtrl', function ($scope, $filter, $q, JournalService, FoursquareService) {
		
	$scope.name = "save";
	
	// get exif data of the image
	var imageUri = $scope.ons.navigator.getCurrentPage().options.selectedImage;
	//var imageUri = "http://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg/600px-Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg";
	//"file:///users/anthony/dev/mytrip_app/www/images/Penguins.jpg"

	var imageData = { DateTimeOriginal: Date.now(), Latitude: 112, Longitude: 90 };
	
	//
	var place = FoursquareService.searchPlaces(imageData.Latitude, imageData.Longitude, 1);
	
	// probably need a callback to update this entry when the imageData returns
	// $filter('date')(imageData.DateTimeOriginal, 'medium')
	$scope.entry = { StartTime: imageData.DateTimeOriginal, Notes: "", Location: place, Images: [{ImageUrl: imageUri, Caption: ""}] };
	
	$scope.save = function(isValid) {
		
		if (!isValid) {
			return;
		}
		
		// for chrome testing
		//checkQuotaForChrome().then(requestQuotaForChrome).then(function(grantedBytes){			
		//});
		
		// save the image to local disk
		copyImageFileToAppFolder(imageUri).then(
			function(fileUrl) {
				$scope.entry.Images[0].ImageUrl = fileUrl;
				var added = JournalService.addEntry($scope.entry);
				if (added) {
					$scope.ons.navigator.popPage();
				}
			});
	};
	
	function checkQuotaForChrome()
	{
		var deferred = $q.defer();
		
		if (navigator.webkitPersistentStorage) {
			navigator.webkitPersistentStorage.queryUsageAndQuota( 
				function(quota) { 
					deferred.resolve(quota);
				}, function(err){
					deferred.reject(err);
				});
		}
		else {
			deferred.resolve(1000); // fake a quota
		}
		
		return deferred.promise;
	}
	
	function requestQuotaForChrome(currentQuota)
	{
		var deferred = $q.defer();
		
		var quota = 1024*1024;
		
		if (currentQuota == 0) {
			navigator.webkitPersistentStorage.requestQuota(quota, 
				function(grantedBytes) { 
					deferred.resolve(grantedBytes);
				}, function(err){
					deferred.reject(err);
				});
		}
		else {
			deferred.resolve(quota); //
		}
		
		return deferred.promise;
	}

	function copyImageFileToAppFolder(imageUri){
		var deferred = $q.defer();
		$q.all([ 
					getLocalFile(imageUri),
					getFileSystem().then(getDirectory)
				])
				.then(
					$q.spread(function(fileEntry, directory){
							if (fileEntry != null && directory != null && typeof(fileEntry) == 'FileEntry') {
								var destUrl = copyFile(fileEntry, directory);
								deferred.resolve(destUrl);
							}
							else {
								deferred.resolve(imageUri);
							}
						}),
					function(err) {
						console.log(err);
						return imageUri;
					}
				);
				
		return deferred.promise;
	}

	function getLocalFile(imageUri) {
		var deferred = $q.defer();

		// for debugging, if http url, then no need to find on the filesystem
		if (imageUri.lastIndexOf("http", 0) === 0) {
			deferred.resolve(imageUri);
		}
		else {
			window.resolveLocalFileSystemURI(imageUri, 
				function(fileEntry) { 
			    	deferred.resolve(fileEntry);
				}, function(err){
					deferred.reject(err);
				});
		}

		return deferred.promise;
	}

	function getFileSystem() { 
		var deferred = $q.defer();

		window.requestFileSystem(LocalFileSystem.PERSISTENT, 1024*1024, 
			function(fileSys) {      
		    	deferred.resolve(fileSys);
			}, function(err){
				deferred.reject(err);
			});

		return deferred.promise;
	}
/*
	function getFileEntryFailed(error) { 
		console.log("get local image file failed: " + error.code); 
	} 

	function successMove(entry) {
	  	//I do my insert with "entry.fullPath" as for the path
	    //alert('move success');
	}
*/

	function getDirectory(fileSys) {
		var deferred = $q.defer();
		var myFolderApp = "Journal";

		fileSys.root.getDirectory( myFolderApp,
			{ create: true, exclusive: false },
          	function(directory) {
              	deferred.resolve(directory);
      		},
          	function(err){
				deferred.reject(err);
			});

		return deferred.promise;
	}

	function copyFile(fileEntry, directory) {
		var deferred = $q.defer();
		var d = new Date();
		var n = d.getTime();
		//new file name
		var newFileName = n + ".jpg";

		fileEntry.moveTo(directory, newFileName, 
          	function(entry) { // success
				deferred.resolve(entry.fullPath);
          	}, function(err){
				deferred.reject(err);
			});

		return deferred.promise;
	}

	function resOnError(error) {
		alert(error.code);
	}		
	
});