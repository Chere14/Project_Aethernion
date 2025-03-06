const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d')

canvas.width = 2400;
canvas.height = 1200;
canvas.style.background = '#91AC8F';
canvas.style.border = '2px solid white';
canvas.style.borderRadius = '10px';

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

    // Set constant speed (adjust as needed)
    let speed = 0.3; // Pixels per millisecond
    let duration = distance / speed; // Time = Distance / Speed

    // Apply movement with dynamic duration
    hero.style.transitionDuration = `${duration}ms`;
    hero.style.left = `${targetX}px`;
    hero.style.top = `${targetY}px`;
});