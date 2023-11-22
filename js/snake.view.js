/**
 * VanillaJS Snake
 * @author Alexander Ishchenko <http://qialex.me>
 * License: MIT 
 */

/**
 * Main Snake js
 */
 
"use strict"; 

console.log ( 'snake.view' );

var view = {
	parentElement: document.getElementById('snake'),
	tempPanel: document.createElement('div'),
	confPanel: document.createElement('div'),
	fieldsArr: [],	
	createField: function (config) {
		
		//Собираем поле - храним поля в массиве таком же, как и mainObj в контроллере.
		//Почему fieldsArr и mainObj - разные? Рендерим мы редко и fieldsArr используется редко - а дата в нем объеммистая,
		//В то в ремя как mainObj - меняем постоянно - чтобы все эти поля не болтались в контроллере и mainObj не жирнел - 
		//Для этого и сделаем fieldsArr индексы у него будут такие же, но в контроллере он мешаться не будет
		var box = document.createElement('div');
		for (var i=0; i<config.FieldSize; i++) {
			
			//Бежим и аппендим клетку за клеткой
			var row = document.createElement('div');
			this.fieldsArr.push([]);
			for (var j=0; j<config.FieldSize; j++) {
				var field = document.createElement('div');
				field.className = 'field';			
				field.innerHTML = '&nbsp;';			
				//field.innerHTML = '';	
				
				row.appendChild(field);
				this.fieldsArr[i].push (field);
			}
			box.appendChild(row);			
		}
		this.parentElement.appendChild(box);	
		
		//Панель состояния
		this.tempPanel.id = 'snakePanelTemp';
		this.parentElement.appendChild(this.tempPanel);
		
		//Панель настроек - сделать возможным изменение настроек (легко)
		this.confPanel.id = 'snakePanelConf';
		
		this.confPanel.innerHTML = 'Поле: ' + config.FieldSize + 'x' + config.FieldSize + ' ' + 
			'Jump to the other side: ' + (config.teleportMoving == true ? 'allowed' : 'not allowed') + '<br /><br />' + 
			'Speed: <ul><li>initial: ' + config.initialSpeed + '</li><li>minimal: ' + config.minSpeed + 
			'</li><li>speed step: ' + config.levelIncreacingSpeed + '</li><li>change frequency: ' + config.stepIncreacing + '</li></ul>' + 
			'To start <b>playing</b> use <b>arrow keys</b> on a keyboard';

		this.parentElement.appendChild(this.confPanel);
	},
	render: function (mainObj, tempData, config) {

		//Бежим по большому объекту и рендерим клетку за клеткой
		for(var i=0; i<mainObj.arr.length; i++) {
			for (var j=0; j<mainObj.arr.length; j++) {
				var elem = this.fieldsArr[i][j];
				
				if (mainObj.arr[i][j] == 'snake') {
					if (mainObj.head[0] == i && mainObj.head[1] == j) {
						elem.className = 'field fieldSnakeHead';
					}
					else {
						elem.className = 'field fieldSnake';
					}
				}
				else if (mainObj.arr[i][j] == 'meal') {
					elem.className = 'field fieldMeal';
				}				
				else {
					elem.className = 'field';
				}
			}
		}
		
		//Строка состояния
		this.tempPanel.innerHTML = 'Score: ' + tempData.count + ', Speed: ' + tempData.currentMoveSpeed + ' ';	
	}
}
