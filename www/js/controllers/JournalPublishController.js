angular.module('myApp').controller('JournalPublishCtrl', function ($scope, $filter, JournalService) {
		
	// $filter('date')(imageData.DateTimeOriginal, 'medium')
	$scope.trip = { Name: "", StartTime: Date.now(), EndTime: Date.now(), Privacy: "friends" };
	
	$scope.publish = function() {
				
		if (true) {
			$scope.ons.navigator.popPage();
		}
		
	};		
	
});