let balance = 100;
let betAmount = 0;
let isBetPlaced = false;
let multiplier = 1;
let interval;
let crashPoint;

document.getElementById('placeBet').addEventListener('click', placeBet);
document.getElementById('cashOut').addEventListener('click', cashOut);
document.getElementById('withdraw').addEventListener('click', withdraw);

function placeBet() {
    const betInput = document.getElementById('betAmount');
    betAmount = parseFloat(betInput.value);
    
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
        alert("Invalid bet amount");
        return;
    }

    balance -= betAmount;
    document.getElementById('balance').innerText = balance;
    isBetPlaced = true;
    startGame();
}

function startGame() {
    document.getElementById('cashOut').disabled = false;
    multiplier = 1;
    crashPoint = Math.random() * (2.5 - 1) + 1; // Random crash point between 1x and 2.5x
    document.getElementById('multiplier').innerText = multiplier + "x";
    const plane = document.getElementById('plane');
    
    interval = setInterval(() => {
        if (multiplier >= crashPoint) {
            clearInterval(interval);
            alert("Crashed! You lost your bet.");
            resetGame();
        } else {
            multiplier += 0.01; // Increase multiplier
            plane.style.transform = `translateX(${multiplier * 20}px)`; // Move plane
            document.getElementById('multiplier').innerText = multiplier.toFixed(2)
