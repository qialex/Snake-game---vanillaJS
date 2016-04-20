/**
 * VanillaJS Snake
 * @author Alexander Ishchenko <http://qialex.me>
 * License: MIT 
 */

/**
 * Main Snake js
 */

"use strict"; 

console.log ( 'snake.model' );

var model = {
	mainArrConstructor: function (FieldSize, arr) {
		//Конструируем виртуальное поле. Если мы хотим захотим узнать что у нас на клетке 5*5 - 
		//не надо будет делать цикл в цикле - все поля проиндексированы заранее
		//центральной клетки нет - кажется справедливо выбирать из квадратика рандомом		
		for (var i=0; i<FieldSize; i++) {
			arr.push([]);
			for (var j=0; j<FieldSize; j++) {
				arr[i].push(null);
			}
		}
	},
	setStartingField: function (FieldSize, mainObj) {
		
		var x = Math.floor(FieldSize/2);
		var y = Math.floor(FieldSize/2);

		//Тут у нас будет капелька рандома если поле с четным количеством клеток например 2*2 - 
		//центральной клетки нет - кажется справедливо выбирать из квадратика рандомом
		if (!(FieldSize%2)) {
			x -= Math.round(Math.random());
			y -= Math.round(Math.random());
		}

		mainObj.queue.push([x,y]);
		mainObj.tail = [x,y]; 
		mainObj.head = [x,y];
		mainObj.arr[x][y] = 'snake';
		
	},
	setNewMeal: function (arr) {
		
		//как это работает? делать рандомный выброс - решение так себе.
		//Почему? Если поле 30*30 а змейка стала занимать 80% поля (720 полей)
		//Предположим 50 раз подряд генератор выдаст поле которое, как потом выяснится занято змейкой
		//720*50 = 36000 прогонов цикла чтобы выбрать случайное незанятое змекой поле? так себе вариант
		//сделанный contoller.mainObj.arr в этом случае будет хранить 900 полей и знать все поля, в которых змейка
		//Мы один раз пробегаем по нему и собираем новый массив в который клаедм и индексируем все незанятые змейкой поля
		//Получается 180 полей (хотя не важно склько их останется - мы теперь их знаем по именам и точно "случайно" попадем в одного из них).
		//Мы кидаем случайное число 1 единственный раз и мы не промахнемся потому что кидем в пустые поля.
		//То есть - вместо 36000 итераций мы делаем всего 900.
		
		var availablePlaces = [];
		for (var i=0; i<arr.length; i++) {
			for (var j=0; j<arr.length; j++) {
				if (arr[i][j] == null) {
					availablePlaces.push([i,j]);
				}
			}
		}
		
		if (availablePlaces.length < 1) {
			// TODO : WE HAVE A WINNER!!!! // хотя проверять это конечно надо там где мы считаем сумму съеденных клеток, но там этого пока нет
		}
		else {
			var rand = Math.round( Math.random() * availablePlaces.length - 0.5 );

			var x = availablePlaces[rand][0];
			var y = availablePlaces[rand][1];
			arr[x][y] = 'meal';
		}
	}
}