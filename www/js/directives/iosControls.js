var app = angular.module('iosControls', ['onsen.directives', 'ngTouch']);
app.directive('iosList', function() {
		return {
			restrict: 'E',
			replace: false,
			transclude: true,			
			templateUrl: 'js/directives/templates/ios-list.html'
		};
	});
	
app.directive('iosListItem', function(ONSEN_CONSTANTS) {
return {
	restrict: 'E',
	replace: true,
	transclude: true,
	templateUrl: 'js/directives/templates/ios-list-item.html',
	compile: function(elem, attrs, transcludeFn) {
		return function(scope, element, attrs) {
			transcludeFn(scope, function(clone) {
				element.append(clone);
			});
		};
	},
	scope: {
        item: '=item'
    },
};
});