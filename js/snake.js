/**
 * VanillaJS Snake
 * @author Alexander Ishchenko <http://qialex.me>
 * License: MIT 
 */

/**
 * Main Snake js
 */
 
"use strict";

console.log ( 'snake' );
/*
function addScript(src){
  var script = document.createElement('script');
  script.src = src;
  document.head.appendChild(script);
}

addScript('js/snake.model.js');
addScript('js/snake.view.js');
addScript('js/snake.controller.js');
*/
window.onload = function() {
	var Snake = controller;
	Snake.model = model;
	Snake.view = view;
	
	//console.log (Snake);
	
	Snake.start();
	
};
