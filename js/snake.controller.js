/**
 * VanillaJS Snake
 * @author Alexander Ishchenko <http://qialex.me>
 * License: MIT 
 */

/**
 * Main Snake js
 */

"use strict";
console.log ( 'snake.controller' );

var controller = {
	config: {
		initialSpeed: 800,
		minSpeed: 175,
		levelIncreacingSpeed: 25,
		stepIncreacing: 1,
		FieldSize: 11,
		teleportMoving: true
	},
	mainObj: {
		arr:[],
		head: [],
		tail: [], // задумывался как индекс хвоста змеи, чтобы не использовать операцию shift, но shift всего один на небольшом массиве так что не страшно
		queue: []
	},
	tempData: {
		currentMoveSpeed: 0,
		direction: '',
		timeId: '',
		count: 0
	},
	prepared: false,
	prepare: function () {
		
		//Рисуем большой объект поля с иэгами, стилями и буквами
		this.view.createField(this.config);
		
		var self = this;
		
		//ловим нажатия клавиатуры
		window.addEventListener("keydown", function(e){
			var keyKodes = {
				37: 'left',
				39: 'right',
				38: 'up',
				40: 'down'
			};
			
			if (keyKodes[e.keyCode]) {
				// Защищаемся от прокрутки экрана на больших полях
				event.preventDefault();
				
				//Этот иф сработает только в начале игры
				if (self.tempData.direction == '') {
					self.tempData.direction = keyKodes[e.keyCode];
					self.move();
				}
				else {
					self.tempData.direction = keyKodes[e.keyCode];
				}				
			}
		});
		
		this.prepared = true;
	},
	start: function () {
		
		if (!this.prepared) {
			//console.log ('Prepearing');
			this.prepare();
		}
		
		//Собираем большой объект виртуального поля
		this.model.mainArrConstructor(this.config.FieldSize, this.mainObj.arr);
		
		//Выбираем стартовое поле
		this.model.setStartingField(this.config.FieldSize, this.mainObj);
		
		//Выкидываем еду
		this.model.setNewMeal (this.mainObj.arr);
	
		//Устанавливаем скорость
		this.tempData.currentMoveSpeed = this.config.initialSpeed;
	
		//Рендерим
		this.toRender();
	},
	gameOver: function () {
		
		//Вот тут конечно что-то бы получше. С анимацией и брекджеком
		console.log ('Game over');
		
		//Чистимся, стартуем заново
		clearTimeout(this.timeId);
		this.mainObj = {
			arr:[],
			head: [],
			tail: [],
			queue: []
		}
		this.tempData = {
			currentMoveSpeed: 0,
			direction: '',
			timeId: '', //td.timerId - заготовка для TODO двойное нажатие влево-влево или другое думаю отлавливать малый 
							//временной интервал между нажатиями, отменять таймер и делать быстрый ход без таймаута
			count: 0
		};
		this.toRender();
		this.start();
	},
	toRender: function () {
		this.view.render(this.mainObj, this.tempData, this.config);
	},
	move: function () {
		var td = this.tempData;
		var conf = this.config;
		var mainObj = this.mainObj;
		
		//Определяем следующее поле
		if (td.direction == 'down')
			var targetField = [mainObj.head[0]+1, mainObj.head[1]];
		if (td.direction == 'up')
			var targetField = [mainObj.head[0]-1, mainObj.head[1]];
		if (td.direction == 'left')
			var targetField = [mainObj.head[0], mainObj.head[1]-1];
		if (td.direction == 'right')
			var targetField = [mainObj.head[0], mainObj.head[1]+1];
		
		var targetX = targetField[0];
		var targetY = targetField[1];
		
		//21 строка this.config.teleportMoving: true
		//Teleport // поправка на настройку о телепорте - можем проигрывать когда упираемся в края, можем телепортироваться 
		if (mainObj.arr[targetX] === undefined || mainObj.arr[targetX][targetY] === undefined) {

			if (conf.teleportMoving == true) {

				if (td.direction == 'down')
					targetField = [0, mainObj.head[1]];
				if (td.direction == 'up')
					targetField = [mainObj.arr.length-1, mainObj.head[1]];
				if (td.direction == 'left')
					targetField = [mainObj.head[0], mainObj.arr.length-1];
				if (td.direction == 'right')
					targetField = [mainObj.head[0], 0];
				
				targetX = targetField[0];
				targetY = targetField[1];
			}
			else {
				this.gameOver();
				return false;
			}
		}	

		//если скушали себя проигрываем, но если нажали влево - потом вправо - не проиграем змея себя за шею не кусала (во всяком случае в моем тетрисе)
		if (mainObj.arr[targetX][targetY] == 'snake') {
			
			var prevItem = mainObj.queue[mainObj.queue.length-2];

			if (prevItem[0] == targetX && prevItem[1] == targetY) {
				if (td.direction == 'down')
					td.direction = 'up';
				else if (td.direction == 'up')
					td.direction = 'down';
				else if (td.direction == 'left')
					td.direction = 'right';
				else if (td.direction == 'right')
					td.direction = 'left';

				this.move();
			}
			else {
				this.gameOver();
				return false;
			}
		}
		//если скушали еду
		else if (mainObj.arr[targetX][targetY] == 'meal') {

			mainObj.arr[targetX][targetY] = 'snake'; // еда теперь змея
			mainObj.queue.push([targetX, targetY]); // змея стала длинней
			mainObj.head = [targetX, targetY]; // голова теперь там где была еда
			
			var isWinner = this.model.setNewMeal (this.mainObj.arr); // кидаем новую еду
			if (isWinner) {
				alert ("You win!");
				this.gameOver();
				return false;
			}
			
			td.count++; 
			
			//Вот не место конечно сдесь этому выражеию, но оно нигде больше не используется в модель прям как-то тоже не просится.
			// передать 4 параметра, чтобы тупо их тут же сложить - не модельное это дело, особенно если 1 раз в коде
			if ( !(td.count%conf.stepIncreacing) ) {
				td.currentMoveSpeed = Math.max (conf.minSpeed, conf.initialSpeed - conf.levelIncreacingSpeed*td.count/conf.stepIncreacing);
			}
			
			this.toRender();
			
			//поехали дальше
			self = this;
			td.timerId = setTimeout(function () { 
				self.move();
			}, td.currentMoveSpeed);
		}
		else if (this.mainObj.arr[targetX][targetY] == null) { // simple move
			
			mainObj.arr[targetX][targetY] = 'snake'; // таргет клетка теперь змея
			mainObj.arr[mainObj.queue[0][0]][mainObj.queue[0][1]] = null; // хвост змеи теперь не змея
			mainObj.queue.push([targetX, targetY]); // добавляем в змеиную очередь клетку
			mainObj.queue.shift(); // удаляем ховст вот тут я думал мне пригодятся head и tail, но размеры вычислений не такие, чтобы писать под них очередь
			mainObj.head = [targetX, targetY]; // голова теперь на новой клетке
			mainObj.tail = mainObj.queue[0]; // хвост теперь на новой клетке
			
			this.toRender();
			
			//поехали дальше
			self = this;
			td.timerId = setTimeout(function () {
				self.move();
			}, td.currentMoveSpeed);
		}			

		
	}	
};
