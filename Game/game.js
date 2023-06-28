const context = document.querySelector("canvas").getContext("2d");

context.canvas.height = 400;
context.canvas.width = 1220;

// Отсчет с 1 кадра
let frameCount = 1;
// Количество препятствий в соответствии с текущим уровнем
let obCount = frameCount;

const updateLevelIndicator = () => {
    const levelIndicator = document.getElementById('level-indicator');
    levelIndicator.innerHTML = `Уровень: ${frameCount}`;
}
const obXCoors = [];

const square = {
    height: 32,
    jumping: true,
    width: 32,
    x: 0,
    xVelocity: 0,
    y: 0,
    yVelocity: 0
};

const maxLevel = 6;
const nextFrame = () => {
    frameCount++;
    obCount = frameCount;

    if (frameCount > maxLevel) { // Если достигнут максимальный уровень
        alert('ПОЗДРАВЛЯЮ! Вы прошли игру!');
        frameCount = 1;
        obCount = frameCount;
        obXCoors.length = 0;
    } else {
        obCount = frameCount;
        obXCoors.length = 0;
        const minDistance = 90;
        const minObXCoor = minDistance + 90;

        for (let i = 1; i < obCount; i++) {
            let obXCoor;

            do {
                obXCoor = Math.floor(Math.random() * (1165 - minObXCoor + 1) + minObXCoor);
            } while (obXCoors.some(x => Math.abs(x - obXCoor) < minDistance))

            obXCoors.push(obXCoor);
        }

    }
}

const controller = { // Состояние клавиш
    left: false,
    right: false,
    up: false,
    keyListener: function (event) { // Отслеживание нажатие клавиш на клавиатуре
        const key_state = (event.type == "keydown") ? true : false;
        switch (event.keyCode) {
            case 37:// кнопка влево
                controller.left = key_state;
                break;
            case 38:// кнопка вверх
                controller.up = key_state;
                break;
            case 39:// кнопка вправо
                controller.right = key_state;
                break;
        }
    }
};

const obstacleCollision = () => {
    obXCoors.forEach((obXCoor) => {
        if (square.x + square.width > obXCoor && square.x < obXCoor + 20) {
            const height = 200 * Math.cos(Math.PI / 6);
            const obstacleHeight = 510 - height;
            if (square.y + square.height > obstacleHeight) {

                frameCount = 1;
                obCount = frameCount;
                obXCoors.length = 0;
                square.x = 0;
                square.y = 0;
                square.xVelocity = 0;
                square.yVelocity = 0;

            }
        }
    });
};

const loop = function () {
    // Обновление уровня
    updateLevelIndicator();

    obstacleCollision();
    if (controller.up && square.jumping == false) { // Проверка нажата ли кнопка вверх,если квадрат не находится в состоянии прыжка, то будет сделан прыжок.
        square.yVelocity -= 27; // Высота прыжка квадрата
        square.jumping = true;
    }

    if (controller.left) {
        square.xVelocity -= 0.3; // Скорость квадрата влево
    }

    if (controller.right) {
        square.xVelocity += 0.3; // Скорость квадрата вправо
    }

    square.yVelocity += 0.7;// гравитация
    square.x += square.xVelocity;
    square.y += square.yVelocity;
    square.xVelocity *= 0.9;// сила трения
    square.yVelocity *= 0.9;// сила трения

    // Если квадрат опускается ниже линии пола
    if (square.y > 386 - 16 - 32) {
        square.jumping = false;
        square.y = 386 - 16 - 32;
        square.yVelocity = 0;
    }

    // Если квадрат уходит за пределы левой части экрана
    if (square.x < -20) {
        square.x = 1220;
    } else if (square.x > 1220) {   // если квадрат выходит за правую границу
        square.x = -20;
        nextFrame();
    }
    // Создает фон для каждого кадра
    context.fillStyle = "#000000";
    context.fillRect(0, 0, 1220, 400); // x, y, ширина, высота

    // Создает и заполняет куб для каждого кадра
    context.fillStyle = "#3AD093";
    context.beginPath();
    context.rect(square.x, square.y, square.width, square.height);
    context.fill();

    // Создание препятствия для каждого кадра
    const height = 200 * Math.cos(Math.PI / 6);

    context.fillStyle = "#FBF5F9";
    obXCoors.forEach((obXCoor) => {
        context.beginPath();
        context.moveTo(obXCoor, 385); // Отрисовка треугольника на поле
        context.lineTo(obXCoor + 25, 385);
        context.lineTo(obXCoor + 25, 510 - height);
        context.closePath();
        context.fill();
    })

    // Отрисовка игрового поля
    context.strokeStyle = "#2E2532";
    context.lineWidth = 30;
    context.beginPath();
    context.moveTo(0, 385);
    context.lineTo(1420, 385);
    context.stroke();

    // Вызов, когда браузер будет готов к повторному рисованию
    window.requestAnimationFrame(loop);

};


const levelIndicator = document.createElement('div');
levelIndicator.id = 'level-indicator';
levelIndicator.style.position = 'absolute';
levelIndicator.style.top = '350px';
levelIndicator.style.left = '280px';
levelIndicator.style.color = '#FBF5F9';
document.body.appendChild(levelIndicator);

window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);
