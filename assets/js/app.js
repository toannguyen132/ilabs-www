var angular = require('angular');
var $ = require('jquery');
var TweenMax = require('tweenmax');
var d3 = require('d3');
require('angular-waypoints');
// more code here

angular.module('demo', ['zumba.angular-waypoints'])
.directive('documentParralax', function($timeout){
	return {
		restrict: 'A',
		scope: {},
		link: function(scope, element, attrs){
		},
		controller: function($scope, $element){
			this.element = $element;
			this.triggered = false;
			$this = this;
			$('.trigger-intro').click(function(){
				$($element).addClass('active');
	    		$('body').addClass('finish-intro');
			});
		}
	}
})
.directive('objectParralax', function(){
	return {
		scope: true,
		require: '^^documentParralax',
		restrict: 'A',
	    link: function(scope, element, attrs, controller) {
	    	var speed = attrs.speed;
	    	var parent = controller.element;
	    	var child = element.find('.object-inner');
	    	var backdrop = $('.object-parallax > .backdrop');
	    	var x = d3.scale.linear()
	    		.domain([0, $(parent).width()])
	    		.range([1,-1]);
	    	var y = d3.scale.linear()
	    		.domain([0, $(parent).height()])
	    		.range([1,-1]);

	    	// parralax
	    	setTimeout( function(){
	    		$(document).on('mousemove', function(event){
		    		TweenMax.to( child, 0.5, {
		    			x: x( event.pageX )*speed,
		    			y: y( event.pageY )*speed,
		    			force3D:false
		    		});

		    		backdrop.css({
		    			// transform: 'rotateY('+ (-x( event.pageX )*5) + 'deg) scale(0.8)'
		    			transform: 'rotateY('+ (-x( event.pageX )*1) + 'deg) rotateX(' + (y( event.pageY )*1) +'deg) scale(0.8)'
		    		});
		    	});	
	    	}, 3100 );

	    	// console.log(controller);
	    	scope.$watch( function(){ return controller.triggered }, function(newvalue , oldvalue){
	    		if ( newvalue != oldvalue ){
	    			$('body').addClass('finish-intro');
	    		}
	    	} );	    	
	    },
	    controller: function($scope){

	    	// console.log('test');
	    	// console.log($scope);
	    }
	}
});
