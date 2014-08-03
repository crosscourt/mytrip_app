(function(){
	'use strict';
	var myApp = angular.module('myApp', ['onsen.directives', 'ngTouch', 'myControls']);

	// prevent console errors on browsers without firebug
	if (!window.console) {
		window.console = {};
		window.console.log = function(){};
	}	
	
})();
