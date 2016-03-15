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
				$timeout(function(){
					$this.triggered = true;
				}, 1000);
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

	    	// console.log(controller);
	    	scope.$watch( function(){ return controller.triggered }, function(newvalue , oldvalue){
	    		if ( newvalue != oldvalue ){
	    			$(controller.element).addClass('finish-intro');
	    			$(document).on('mousemove', function(event){
			    		// var diff = calcDiff( event.pageX, event.pageY );
			    		TweenMax.to( child , 1, { 
			    			x: x( event.pageX )*speed , 
			    			y: y( event.pageY )*speed
			    		});
			    	});	
	    		}
	    	} );	    	
	    },
	    controller: function($scope){

	    	// console.log('test');
	    	// console.log($scope);
	    }
	}
});
