import "./styles.css";

/* --- Переменные --- */

/* Элементы страницы */
//Секундомер
const gameMin = document.querySelector('.game__min');
const gameSec = document.querySelector('.game__sec');
//Количество ходов
const gameStatMoves = document.querySelector('.game__stat-moves');
//Игровое поле
const gameFieldCont = document.querySelector('.game__field');
//Кнопка перемешать
const gameButtonShuffle = document.querySelector('.game__button-shuffle');
//Попап "Вы выиграли"
const popupVictory = document.querySelector('.popup__victory');


//Инициализирующий массив
const arrayOfSquares = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];


/* --- Классы --- */

//Класс секундомера
class StopWatch {
    constructor(minSpan, secSpan) {
        this.minSpan = minSpan;
        this.secSpan = secSpan;
        this.tick = this.tick.bind(this);
        this.stop = this.stop.bind(this);
    }

//Меняет textContent за каждую секунду
    tick() {
        const sec = Number(this.secSpan.textContent);
        (sec < 9) ? (this.secSpan.textContent = '0' + (sec + 1)) : (this.secSpan.textContent = sec + 1);
        if (sec > 58) { //Прибавить минуту
            const min = Number(this.minSpan.textContent);
            this.secSpan.textContent = '00';
            (min < 9) ? (this.minSpan.textContent = '0' + (min + 1)) : (this.minSpan.textContent = min + 1)
        }
    }

//Старт секундомера
    start() {
        this.minSpan.textContent = '00';
        this.secSpan.textContent = '00';
        this.secInterval = setInterval(this.tick, 1000); //Тик каждую секунду
    }

//Стоп секундомера
    stop() {
        clearInterval(this.secInterval);
    }
}

//Класс игрового поля
class GameField {
    constructor({arrayOfSquares, gameFieldCont, gameSquareClass, gameButtonShuffle, popupClass, stopWatchClass, gameMoveClass}) {
        this.gameSquareClass = gameSquareClass;
        this.popupClass = popupClass;
        this.stopWatchClass = stopWatchClass;
        this.gameMoveClass = gameMoveClass;

        this.arrayOfSquares = arrayOfSquares;
        this.gameFieldCont = gameFieldCont;
        this.gameButtonShuffle = gameButtonShuffle;

        this.gameButtonShuffle.addEventListener('click', this.clickButtonHandler.bind(this));
    }

    //Отрисовка пятнашек
    render() {
        this.arrayOfSquares.forEach(item => {
            (item === 15) ? this.gameFieldCont.insertAdjacentHTML('beforeEnd',this.gameSquareClass.createSpace(item)) : this.gameFieldCont.insertAdjacentHTML('beforeEnd',this.gameSquareClass.createSquare(item));
        })
        this.squares = document.querySelectorAll('.game__square');
        this.squareSpace = document.querySelector('.game__square-space');
        this.gameFieldCont.addEventListener('click', this.clickHandler.bind(this));
    }

    //Колбэк при клике на пятнашку
    clickHandler(event) {
        if (event.target.classList.contains('game__square')) {
            if (this.isNearby(event.target, this.squareSpace)) {
                this.gameMoveClass.plusMove();
                this.squareSwap(event.target, this.squareSpace);
                if (this.isVictory()) {
                    this.popupClass.open();
                    this.stopWatchClass.stop();
                }
            }
        }
    }

    clickButtonHandler() {
        this.shuffle();
    }

    //Определяет соседние ли клетки
    isNearby(square, squareSpace) {
        const rowAbs = Math.abs(((squareSpace.style.order) % 4) - ((square.style.order) % 4));
        const colAbs = Math.abs(((squareSpace.style.order) / 4 >>> 0) - ((square.style.order) / 4 >>> 0));
        if (rowAbs === 0 && colAbs === 1 || rowAbs === 1 && colAbs === 0) {
            return true
        }
        return false
    }

    //Проверка на собранные пятнашки, true если свойство style:order каждого элемента соответсвует инициализирующему массиву
    isVictory() {
        return Array.from(this.squares).every((item, idx) => {
            return this.arrayOfSquares[idx] === Number(item.style.order);
        });
    }

    //Поменять местами 2 квадрата пятнашки
    squareSwap(squareFrom, squareTo) {
        [squareFrom.style.order, squareTo.style.order] = [squareTo.style.order, squareFrom.style.order];
    }

    //Перемешать пятнашки
    shuffle() {
        const shuffledArray = Array.from(this.arrayOfSquares).sort(() => Math.random() - 0.5);
        this.squares.forEach((item, idx) => {
            item.style.order = shuffledArray[idx];
        });
        this.gameMoveClass.reset();
        this.stopWatchClass.stop();
        this.stopWatchClass.start();
    }
}

//Класс квадрата пятнашек
class GameSquare {
    constructor() {
    }

    createSquare(num) {
        return `<div class="game__square" style="order: ${num};">${num+1}</div>`
    }

    // Создание пустого квадрата
    createSpace(num) {
        return `<div class="game__square game__square-space" style="order: ${num};"></div>`
    }
}

//Класс попапа
class Popup {
    constructor(popupVictory) {
        this.popupVictory = popupVictory;
    }

    open() {
        this.popupVictory.addEventListener('click', this.close.bind(this), {once: true}); //Слушатель на клик для закрытия попапа
        this.popupVictory.classList.add('popup_is-opened');
    }

    close() {
        this.popupVictory.classList.remove('popup_is-opened');      
    }
}

//Класс количества ходов
class GameMoves {
    constructor(gameStatMoves) {
        this.gameStatMoves = gameStatMoves;
    }

    reset() {
        this.gameStatMoves.textContent = "0";
    }

    plusMove() {
        const move = Number(this.gameStatMoves.textContent);
        this.gameStatMoves.textContent =  move + 1;
    }
}

//Создание экземпляров классов
const popup = new Popup(popupVictory);
const gameMoves = new GameMoves(gameStatMoves);
const stopWatch = new StopWatch(gameMin, gameSec);
const gameSquare = new GameSquare();
const gameField = new GameField({
    arrayOfSquares: arrayOfSquares, 
    gameFieldCont: gameFieldCont, 
    gameSquareClass: gameSquare, 
    gameButtonShuffle: gameButtonShuffle, 
    popupClass: popup, 
    stopWatchClass: stopWatch,
    gameMoveClass: gameMoves
});

//Вызов функций при загрузке страницы
window.onload = () => {
    gameField.render();
    stopWatch.start();
    //Свапнуть квадраты для UX проверки задания :)
    gameField.squareSwap(gameField.squares[14], gameField.squares[15]);
}
