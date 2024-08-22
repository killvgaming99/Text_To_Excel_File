// Initialize balance from local storage or set to 100
let balance = localStorage.getItem('balance') ? parseFloat(localStorage.getItem('balance')) : 100;
document.getElementById('balance').textContent = balance.toFixed(2);

// Variables for game state
let currentMultiplier = 1;
let betAmount = 0;
let gameInterval;
let gameActive = false;

// Function to start the game
function startGame() {
    currentMultiplier = 1;
    gameActive = true;
    gameInterval = setInterval(() => {
        currentMultiplier += (Math.random() * 0.05);
        drawMultiplier(currentMultiplier.toFixed(2));
    }, 100);
}

// Function to place a bet
document.getElementById('placeBet').addEventListener('click', () => {
    if (gameActive) return alert('Game already in progress!');
    
    betAmount = parseFloat(document.getElementById('betAmount').value);
    if (isNaN(betAmount) || betAmount <= 0) return alert('Please enter a valid bet amount!');
    if (betAmount > balance) return alert('Insufficient balance!');
    
    balance -= betAmount;
    updateBalance();
    startGame();
});

// Function to cash out
document.getElementById('cashOut').addEventListener('click', () => {
    if (!gameActive) return alert('No active game to cash out from!');

    clearInterval(gameInterval);
    gameActive = false;
    
    let winnings = betAmount * currentMultiplier;
    balance += winnings;
    updateBalance();
    
    addHistory(`Cashed out at x${currentMultiplier.toFixed(2)} and won $${winnings.toFixed(2)}`);
});

// Function to draw the multiplier on the canvas
function drawMultiplier(multiplier) {
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    context.fillStyle = '#ffcc00';
    context.font = '30px Arial';
    context.textAlign = 'center';
    context.fillText('x' + multiplier, canvas.width / 2, canvas.height / 2);
}

// Function to update the balance display and save to local storage
function updateBalance() {
    document.getElementById('balance').textContent = balance.toFixed(2);
    localStorage.setItem('balance', balance.toFixed(2));
}

// Function to add to game history
function addHistory(message) {
    const historyList = document.getElementById('historyList');
    const listItem = document.createElement('li');
    listItem.textContent = message;
    historyList.prepend(listItem);
}
