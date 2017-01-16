(function() {
  'use strict';
var app = angular.module('customFlip', []);

angular.module('customFlip', [])
	.directive("flip", function(){
  
		  function setDim(element, width, height){
		    // element.style.width = width;
		    element.style.height = height;
		  }
		  
		  var cssString =
		    "<style> \
		    .flip {display: block; overflow: hidden} \
		    .flipBasic { \
		    position: absolute; \
		    left: 17%; \
		    -webkit-backface-visibility: hidden; \
		    backface-visibility: hidden; \
		    -webkit-transition: width 1s, height 1s, background-color 1s, -webkit-transform 1s; \
    		transition: width 1s, height 1s, background-color 1s, transform 1s; \
		    -webkit-transform: perspective( 1600px ) rotateY( 0deg ); \
		    transform: perspective( 1600px ) rotateY( 0deg ); \
		    } \
		    .flipHideBack { \
		    -webkit-transform:  perspective(1600px) rotateY( 180deg ); \
		    transform:  perspective(1600px) rotateY( 180deg ); \
		    } \
		    .flipHideFront { \
		    -webkit-transform:  perspective(1600px) rotateY( -180deg ); \
		    transform:  perspective(1600px) rotateY( -180deg ); \
		    } \
		    </style> \
		    ";
		    
		  document.head.insertAdjacentHTML("beforeend", cssString);
		  
		  
		  return {
		    restrict : "E",
		    controller: function($scope, $element, $attrs){
		      
		      var self = this;
		      self.front = null,
		      self.back = null;
		      
		      
		      function showFront(){
		        self.front.removeClass("flipHideFront");
		        self.back.addClass("flipHideBack");
		      }
		      
		      function showBack(){
		        self.back.removeClass("flipHideBack");
		        self.front.addClass("flipHideFront");

		      }
		      
		      self.init = function(){
		        self.front.addClass("flipBasic");
		        self.back.addClass("flipBasic");
		        
		        showFront();
		        // self.front.on("mouseenter", showBack);
		        // self.back.on("mouseleave", showFront);
		        // self.front.mouseover(showBack);
		        // self.back.mouseout(showFront);
		        self.el.hover(showBack,showFront);
		      }
		    
		    },
		    
		    link : function(scope,element,attrs, ctrl){
		      ctrl.el = element;
		      var width = attrs.flipWidth || "100px",
		        height =  attrs.flipHeight || "100px";
		      
		      element.addClass("flip");
		      
		      if(ctrl.front && ctrl.back){
		        [element, ctrl.front, ctrl.back].forEach(function(el){
		          setDim(el[0], width, height);
		        });
		        ctrl.init();
		      }
		      else {
		        console.error("FLIP: 2 panels required.");
		      }
		      
		    }
		  }
  
})
	.directive("flipPanel", function(){
  return {
    restrict : "E",
    require : "^flip",
    //transclusion : true,
    link: function(scope, element, attrs, flipCtr){
      if(!flipCtr.front) {flipCtr.front = element;}
      else if(!flipCtr.back) {flipCtr.back = element;}
      else {
        console.error("FLIP: Too many panels.");
      }
    }
  }
});

})();
