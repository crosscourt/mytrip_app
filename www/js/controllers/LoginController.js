angular.module('myApp').controller('LoginCtrl', function ($scope, $http, LoginService) {
  
  $scope.menuName = "abcde";
  
  $scope.login = function(){
	
	LoginService.login($scope.username, $scope.password, onLoginSuccess);
  }
  
  function onLoginSuccess() {
	//$http.get('http://localhost:53758/api/1.0/trips/1').success(function(){});	
	//$scope.ons.navigator.resetToPage('homePage.html');  
	$scope.ons.slidingMenu.setAbovePage('home.html');
  }
  
});