var angular = require('angular');
var $ = require('jquery');
var TweenMax = require('tweenmax');
var d3 = require('d3');
require('angular-waypoints');
var radarChart = require('./radar.js');
// more code here

angular.module('demo', ['zumba.angular-waypoints'])
.run(function($rootScope){
	var checkScreen = function(){
		if ( $(window).width() < 768 ){
			$('body').addClass('mobile');
		}
	}
	checkScreen();
})
.directive('documentParralax', function($timeout){
	return {
		restrict: 'A',
		scope: {},
		link: function(scope, element, attrs){
		},
		controller: function($scope, $element){
			if ($('body').hasClass('mobile')) return;
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
	    	if (!$('body').hasClass('mobile')){
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
	    	}
	    },
	    controller: function($scope){

	    	// console.log('test');
	    	// console.log($scope);
	    }
	}
})
.factory('csData', function(){
	var data = {
		current: 0,
		total: 0
	};

	return{
		getCurrent: function(){
			return data.current;
		},
		setCurrent: function(current){
			data.current = current;
		},
		setTotal: function(total){
			data.total = total;
		},
		getTotal: function(){
			return data.total;
		},
		next: function(){
			data.current++;
			if ( data.current >= data.total )
				data.current = data.total;
		},
		prev: function(){
			data.current--;
			if ( data.current < 0 )
				data.current = 0;
		}
	}
})
.controller('caseStudySlideNav', function($scope, csData){
	var total = csData.getTotal();
	$scope.current = csData.getCurrent();
	$scope.$watch('current', function(newValue, oldValue){
		if (newValue !== oldValue){
			csData.setCurrent(newValue);
		}
		$scope.canPrev = { disabled: $scope.current == 0 };
		$scope.canNext = { disabled: $scope.current >= total - 1 };
	});
	$scope.$watch(function(){ return csData.getTotal; }, function(newValue){
		total = csData.getTotal();
		$scope.canNext = { disabled: $scope.current >= total - 1 };
	});

	$scope.next = function(){
		if ( $scope.current < total - 1 ){
			$scope.current++;
		}
	}
	$scope.prev = function(){
		if ( $scope.current > 0 ){
			$scope.current--;
		}
	}
})
.controller('caseStudySlide', function($scope, csData){
	csData.setTotal(2);
	$scope.current = csData.getCurrent();
	$scope.total = 2;
	$scope.$watch( 'current', function(newValue, oldValue){
		$scope.transform = $scope.current * (100/$scope.total);
		$scope.slideStyle = { 
			"transform": "translateX(-" + $scope.transform + "%)"
		};	
	} );
	$scope.$watch(function(){
		return csData.getCurrent();
	}, function(newValue, oldvalue){
		$scope.current = newValue;
	});
})
.directive('radarChart', function(){
	return {
		restrict: "A",
		scope: false,
		link: function(scope, element, attrs){
			var d = [
				[
					{axis:"LEADER",value:0.8},
					{axis:"SMART",value:0.6},
					{axis:"VISION",value:0.8},
					{axis:"KIND",value:0.3},
					{axis:"FUNNY",value:0.5},
				]
			];
			var w = element.width() - 100;
			var h = element.height() - 100;

			radarChart.draw( '#radar-1', d, { 
				w: w, 
				h: h,
				levels: 2,
				ExtraWidthX: 100,
				ExtraWidthY: 100,
				TranslateX: 50,
				TranslateY: 60,
			});
		}
	}
})
.directive('animatedIcon', function(){
	return {
		restrict: "A",
		scope: false,
		link: function(scope, element, attrs){
			scope.$watch('wp.services.down', function(newValue, oldValue){
				if (newValue !== oldValue && newValue){
					// element.find('svg path').css('stroke-dashoffset', 0);
				}
			});

			// 
			element.find('svg path').each(function(){
				// console.log( this.getTotalLength() );
				var length = this.getTotalLength();
				$(this).css("stroke-dasharray", length + ' ' + length);
				$(this).css("stroke-dashoffset", length);
				$(this).css("transition", "600ms all");
			});
		}
	}
});
