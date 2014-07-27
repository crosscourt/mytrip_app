angular.module('myApp').controller('MenuCtrl', function ($scope, $rootScope, LoginService) {
  
  $scope.loginMenu = 'Login';
    
  $rootScope.$watch('isLoggedIn', function() { 
	$scope.loginMenu = $rootScope.isLoggedIn ? 'Logout' : 'Login'; }
	, true);
  
});