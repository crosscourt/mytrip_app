angular.module('myApp').service('JournalService', function ($q) {
  // ...
  var _db = null;
    
  var service = {
	
	init: function() {
		try {
			if (!window.openDatabase) {
				alert('Databases are not supported in this browser.');
			} else {
				_db = window.openDatabase('mytripdb', '1.0', 'trips database', 2 * 1024 * 1024);
				
				// AUTOINCREMENT - lifetime uniqueness
				// no point storing local+utc/timezone because we don't know when and where the user will add the entry
				// better to use the location to determine timezone if its set 
				_db.transaction(function (tx) {
				  tx.executeSql('CREATE TABLE IF NOT EXISTS Activities (Id INTEGER PRIMARY KEY AUTOINCREMENT, StartTime, Notes, FoursquareLocationId, LocationName, Latitude, Longitude, Status INTEGER, CreatedTime INTEGER)');  
				  tx.executeSql('CREATE TABLE IF NOT EXISTS ActivityImages (Id INTEGER PRIMARY KEY AUTOINCREMENT, ActivityId INTEGER REFERENCES Activity(id), ImageUrl, CloudinaryUrl, Caption, Status INTEGER)');  
				});
			}
		}
		catch (e) {
			if (e == 2) {
				// Version number mismatch.
				console.log("Invalid database version.");
			} else {
				console.log("Unknown error "+e+".");
			}
			return;
		}
	},
  
	getEntries: function(){

		var deferred = $q.defer();
		
		try{
			var data = getEntriesAndImages(function(data){
				deferred.resolve(data);
			}, function(err){
				deferred.reject(err);
			});			
				
			//setTimeout(function(){
			//	deferred.resolve(data);
			//}, 2000);		
		
		}catch(e){
			deferred.reject(e);
		}

		return deferred.promise;
 	},
	
	addEntry: function(entry){
		// pick top matching location, user can edit later
		// var location = { Id: '1', Name: "somewhere"};
		
		var startTimeLocal = entry.StartTime.toYYYYMMDDHHMM();
		//var startTimeUTC = entry.StartTime.toISOString(); // toISO at the time this is called, not relative to the location of the photo?
		
		_db.transaction(function (tx) {
		  tx.executeSql('INSERT INTO Activities (Id, StartTime, Notes, FoursquareLocationId, LocationName, Latitude, Longitude) VALUES (?, ?, ?, ?, ?, ?, ?)', [null, startTimeLocal, entry.Notes, entry.Location.Id, entry.Location.Name, 1, 2]);
		  //tx.executeSql("INSERT INTO Activities (Id, Notes, Latitude, Longitude) VALUES (?, ?, ?, ?)", [null, entry.Notes, 1, 2]);
		  if (entry.Images && entry.Images.length > 0) {
			tx.executeSql('INSERT INTO ActivityImages (Id, ActivityId, ImageUrl, Caption) VALUES (null, last_insert_rowid(), ?, ?)', [entry.Images[0].ImageUrl, entry.Images[0].Caption]);
		  }
		},
		function (tx, err) {
			console.log("addEntry: " + err);
			alert(err);
		},
		function(tx, results) {
			//alert('success');
		});
		
		return true; // this returns true before the sql has executed
	},
	
	publish: function(trip) {
		
	}
	
  } 
  
  function getEntriesAndImages(success, fail){
	//var data = [
	//		{Day: 'Friday, May 16', Activities: [{StartTime: '1100', Notes: "have a nice breakfast", Images: [{Url: "Penguins.jpg", Caption: "caption 1"},{Url: "Penguins.jpg", Caption: "caption 2"}]}, {StartTime: "1500", Notes: "queue for entry"}]},
	//		{Day: 'Thursday, May 15', Activities: [{StartTime: '0900', Notes: "early start for today"}, {StartTime: "1000", Notes: "drive to the park"}]}];
	//return data;
	
	_db.transaction(function (tx) {
		tx.executeSql('SELECT *, ai.Id as ActivityImageId FROM Activities a JOIN ActivityImages ai on a.Id = ai.ActivityId ORDER BY a.StartTime', [], 
		function (tx, results) {
			var len = results.rows.length;
			//var activities = [];
			var prevDate;
			var prevLocation;
			var activityGroups = [];
			var group;
			var i = 0;
			while(i<len){
				var item = results.rows.item(i);
				var currentDate = Date.fromYYYYMMDDHHMM(item.StartTime); //new Date(Date.parse(item.StartTime)); // grouping needs to be done using local time
				var currentLocation = item.LocationName;
				
				if (!currentDate.sameDay(prevDate) && prevLocation != currentLocation) {
					group = { Date: currentDate, Location: currentLocation, Activities: [] };
					activityGroups.push(group);
				}
				
				var activity = {
					Id: item.Id,
					StartTime: item.StartTime,
					Notes: item.Notes,					
					FoursquareLocationId: item.FoursquareLocationId,
					LocationName: item.LocationName,
					Images: []
				};
				group.Activities.push(activity);
				
				// add the images to activity
				while (i<len){
					var item = results.rows.item(i);
					var activityId = item.ActivityId;
					if (activityId == activity.Id) {
						var activityImage = { ImageUrl: item.ImageUrl, Caption: item.Caption };
						activity.Images.push(activityImage);
						i++;
					}
					else {
						break;
					}
				}
				
				prevDate = currentDate;
				prevLocation = currentLocation;
			}
			
			success(activityGroups);
		}, 
		function(err) {
			console.log("Error processing SQL: "+err.code);
			fail(err);
		});
	});
	
  }
  
  service.init();
  
  return service;
  
});