//(function() {
//	'use strict';
	var app = angular.module('myControls', []);

	app.directive('slideItemGroup', function() {  
		return {  
			controller: function($scope) {  
				this.scope = $scope; //.$parent;  // $parent because transclude created child scope?, scope of the current controller
				this.scope.nextItemId = 0;
				this.scope.openedItem = -1;
				
				this.getNextItemId = function() {
					var id = this.scope.nextItemId++;
					return id;
				};
				
				
			}  
		};  
	}); 
	
	app.directive('slideItem', function($timeout) {
		return {
			require: '^slideItemGroup', 
			restrict: 'E',
			//replace: true,
			transclude: true,
			scope: {
				onTap: '&'				
			},
			templateUrl: 'js/directives/templates/swipe-item.html',
			link: function(scope, element, attrs, slideItemGroupController, transclude) {
					
				scope.itemId = slideItemGroupController.getNextItemId();
				
                // adjust sizes after rendering
				// this doesn't work when using jquery
				//angular.element(document).ready(function() {					
				//});		
				
				var afterRender = function(){
					var topDiv = element[0].querySelector('.swipe-item-top');
					var menuDivs = element[0].querySelectorAll('.swipe-item-menu');
					for(i=0; i<menuDivs.length; i++) {
						// set the height to be the same (no auto height because of absolute positing)
						menuDivs[i].style.height = topDiv.clientHeight + "px";
						
						// close the slider if a menu is clicked, so we don't need to use a service or something to detect when it needs to close
						angular.element(menuDivs[i]).on('click', function() {
							swiper.close();
						});
					}
				};
				$timeout(afterRender, 0);
				
				slideItemGroupController.scope.$watch('openedItem', function() { 					
					if (slideItemGroupController.scope.openedItem != scope.itemId) {
						swiper.close();
					}
				});
				
				/* the css attrs to set */
				var BROWSER_TRANSFORMS = [
					"webkitTransform",
					"mozTransform",
					"msTransform",
					"oTransform",
					"transform"
				];
				
				var Swiper = Class.extend({
					init: function(element) {
						this.el = element[0];
						this.topDiv = element[0].querySelector('.swipe-item-top');
						this.bottomDiv = element[0].querySelector('.swipe-item-bottom');
						this.menuDivs = element[0].querySelectorAll('.swipe-item-menu');
						this.originalX = this.topDiv.getBoundingClientRect().left;
						
						this.totalMenuWidth = 0;
						for(i=0; i<this.menuDivs.length; i++) {
							this.totalMenuWidth += this.menuDivs[i].clientWidth; 
							// set the height to be the same (no auto height because of absolute positing)
							//this.menuDivs[i].style.height = this.topDiv.clientHeight + "px";
						}
						
						this.currentX = 0;
						this.startX = 0;
						this.MAX = -this.totalMenuWidth;
						
						this.hammertime = new Hammer(this.el);
						this.boundHammerEvent = this.handleEvent.bind(this);
					},
					
					activateHammer: function() {
						this.hammertime.on("tap dragleft dragright swipeleft swiperight release", this.boundHammerEvent);
					},

					deactivateHammer: function() {
						this.hammertime.off("tap dragleft dragright swipeleft swiperight release", this.boundHammerEvent);
					},
					
					handleEvent: function(ev) {
						//if (this.isInsideIgnoredElement(ev.target))
						//	ev.gesture.stopDetect();

						switch (ev.type) {

						    case 'tap':
								if(this.isClosed()){
									scope.onTap();
								}
								
								break;
								
							case 'touch':
								if(this.isClosed()){
									if(!this.isInsideSwipeTargetArea(ev.gesture.center.pageX)){
										ev.gesture.stopDetect();
									}									
								}
								
								break;

							case 'dragright':
							case 'dragleft':		
								ev.gesture.preventDefault();
								
								if (!this.isClosed()) {
									ev.stopPropagation(); // stop the slide menu from receiving this event only if the slide item is opened
								}
								
								var deltaX = ev.gesture.deltaX;
								this.currentX = this.startX + deltaX;
								if (this.currentX <= 0) {
									this.translate(this.currentX);
								}

								break;

							case 'swipeleft':
								if (this.canSlide()){
									ev.gesture.preventDefault();

									//if (this.isClosed()) { // need to call open() to make the topDiv bounce back to max open position
										ev.stopPropagation();
										this.open();
									//}
								}
								break;

							case 'swiperight':
								if (this.canSlide()){
									ev.gesture.preventDefault();

									if (!this.isClosed()) {
										ev.stopPropagation();
										this.close();			
									}
								}
								break;

							case 'release':
							    ev.gesture.preventDefault();
								
								// if slide to more than half the width of all menus
								if (this.currentX < this.MAX / 2) {
									this.open();
								} else {
									this.close();
								}
								
								break;
						}
					},
					
					isInsideSwipeTargetArea: function(x){
						return x < this.MAX;
					},
					
					isClosed: function(){						
						return this.startX == 0;
					},
					
					canSlide: function(){
						//console.log(this.topDiv.getBoundingClientRect().left + " != " + this.originalX);
					    //this.topDiv.getBoundingClientRect().left != this.originalX;
						return true;
					},

					close: function() {
						this.startX = 0;
						if (this.currentX !== 0) {
							//this.$abovePage.addClass('transition');
							//this.$behindPage.addClass('transition');
							this.translate(0);
						}
					},

					open: function() {
						this.startX = this.MAX;
						if (this.currentX != this.MAX) {
							//this.$abovePage.addClass('transition');
							//this.$behindPage.addClass('transition');
							this.translate(this.MAX);
							
							slideItemGroupController.scope.openedItem = scope.itemId; // this == swiper
							slideItemGroupController.scope.$apply(); // trigger change event
						}						
					},

					toggle: function() {
						if (this.startX === 0) {
							this.open();
						} else {
							this.close();
						}
					},

					translate: function(x) {
						var aboveTransform = 'translate3d(' + x + 'px, 0, 0)';
						
						var property;
						for (var i = 0; i < BROWSER_TRANSFORMS.length; i++) {
							property = BROWSER_TRANSFORMS[i];
							this.topDiv.style[property] = aboveTransform;							
						}
												
						this.currentX = x;
					}
				});

				var swiper = new Swiper(element);
				swiper.activateHammer();		
			}
		};
	});
//}());