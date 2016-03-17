var angular = require('angular');
var $ = require('jquery');
var TweenMax = require('tweenmax');
var d3 = require('d3');
// more code here

angular.module('demo', [])
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
	    	var x = d3.scale.linear()
	    		.domain([0, $(parent).width()])
	    		.range([1,-1]);
	    	var y = d3.scale.linear()
	    		.domain([0, $(parent).height()])
	    		.range([1,-1]);

	    	// parralax
	    	$(document).on('mousemove', function(event){
	    		// var diff = calcDiff( event.pageX, event.pageY );
	    		// TweenMax.to( child ,0.1, { attr: {
	    		// 		style: "transform: translate(" + x( event.pageX )*speed + "px, " + y( event.pageY )*speed + "px)"
	    		// 	}
	    		// });
	    		TweenMax.to( child, 0.5, {
	    			x: x( event.pageX )*speed,
	    			y: y( event.pageY )*speed,
	    			force3D:false
	    		})
	    	});	

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
