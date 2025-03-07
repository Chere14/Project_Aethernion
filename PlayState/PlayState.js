const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d')

canvas.style.background = '#91AC8F';
canvas.style.border = '2px solid white';
canvas.style.borderRadius = '10px';

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.95;
    canvas.height = window.innerHeight * 0.9;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

//Right Click Movement
document.addEventListener("contextmenu", function (event) {
    event.preventDefault(); // Prevent right-click menu

    let hero = document.querySelector(".hero");

    // Get current position
    let currentX = hero.offsetLeft;
    let currentY = hero.offsetTop;

    // Get target position
    let targetX = event.clientX;
    let targetY = event.clientY;

    // Calculate distance
    let distance = Math.hypot(targetX - currentX, targetY - currentY);

    // Set constant speed
    let speed = 0.3; // Pixels per millisecond
    let duration = distance / speed; // Time = Distance / Speed

    // Apply movement with dynamic duration
    hero.style.transitionDuration = `${duration}ms`;
    hero.style.left = `${targetX}px`;
    hero.style.top = `${targetY}px`;
});  