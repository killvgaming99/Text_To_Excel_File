// Initial balance setup
let balance = parseFloat(localStorage.getItem('balance')) || 100;
document.getElementById('balance').textContent = balance.toFixed(2);

// Variables to track game state
let multiplier = 1.00;
let betAmount = 0;
let gameInProgress = false;
let gameInterval;

// Function to update the balance display
function updateBalance() {
    document.getElementById('balance').textContent = balance.toFixed(2);
    localStorage.setItem('balance', balance.toFixed(2));
}

// Function to generate a random multiplier
function generateRandomMultiplier() {
    return (Math.random() * 99 + 1).toFixed(2);
}

// Function to start the game
function startGame() {
    gameInProgress = true;
    document.getElementById('place-bet').disabled = true;
    document.getElementById('cash-out').disabled = false;
    multiplier = 1.00;

    gameInterval = setInterval(() => {
        multiplier += 0.01;
        document.getElementById('multiplier').textContent = multiplier.toFixed(2) + 'x';

        // Randomly decide if the game should end
        if (Math.random() < 0.01) {
            endGame(false);
        }
    }, 100);
}

// Function to handle placing a bet
document.getElementById('place-bet').addEventListener('click', function() {
    betAmount = parseFloat(document.getElementById('bet-amount').value);
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
        document.getElementById('feedback').textContent = 'Invalid bet amount!';
        return;
    }

    balance -= betAmount;
    updateBalance();
    document.getElementById('feedback').textContent = '';
    startGame();
});

// Function to handle cashing out
document.getElementById('cash-out').addEventListener('click', function() {
    if (gameInProgress) {
        endGame(true);
    }
});

// Function to end the game
function endGame(cashedOut) {
    clearInterval(gameInterval);
    document.getElementById('place-bet').disabled = false;
    document.getElementById('cash-out').disabled = true;
    gameInProgress = false;

    if (cashedOut) {
        const winnings = betAmount * multiplier;
        balance += winnings;
        updateBalance();
        document.getElementById('feedback').textContent = `Cashed out at ${multiplier.toFixed(2)}x for $${winnings.toFixed(2)}!`;

        // Add to history
        const historyList = document.getElementById('history-list');
        const historyItem = document.createElement('li');
        historyItem.textContent = `Cashed out at ${multiplier.toFixed(2)}x: $${winnings.toFixed(2)}`;
        historyList.appendChild(historyItem);
    } else {
        document.getElementById('feedback').textContent = 'Round ended, no cash out!';
    }
}
