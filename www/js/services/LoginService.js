angular.module('myApp').service('LoginService', function ($rootScope, $http) {
  
  return {
	
	login: function(username, password, successCallback){
		/*
		$http.post('http://localhost:53758/api/1.0/authenticate', {username: username, password: password}).success(function(result){
			if (result.Success){
				$rootScope.isLoggedIn = true;
				$rootScope.token = result.ApiToken;
				$http.defaults.headers.common.Authorization = result.ApiToken;
				
				successCallback();
			}
		});
		*/
		
		$rootScope.isLoggedIn = true;
		$rootScope.token = "asdf";
				
		successCallback();
	},
	
	logout: function(){
	}
	
  }
  
});