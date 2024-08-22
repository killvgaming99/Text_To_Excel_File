// Initial balance setup
let balance = parseFloat(localStorage.getItem('balance')) || 50;
document.getElementById('balance').textContent = balance.toFixed(2);

// Variables to track game state
let multiplier = 1.00;
let betAmount = 0;
let gameInProgress = false;
let gameInterval;

// Withdraw Modal elements
const withdrawModal = document.getElementById('withdraw-modal');
const withdrawForm = document.getElementById('withdraw-form');
const closeBtn = document.querySelector('.close');

// Function to update the balance display
function updateBalance() {
    document.getElementById('balance').textContent = balance.toFixed(2);
    localStorage.setItem('balance', balance.toFixed(2));
}

// Function to generate a random multiplier between 1x and 999x
function generateRandomMultiplier() {
    return (Math.random() * 998 + 1).toFixed(2);
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
        if (Math.random() < 0.01 || multiplier >= generateRandomMultiplier()) {
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
        document.getElementById('feedback').textContent = `Cashed out at ${multiplier.toFixed(2)}x for ₹${winnings.toFixed(2)}!`;

        // Add to history
        const historyList = document.getElementById('history-list');
        const historyItem = document.createElement('li');
        historyItem.textContent = `Cashed out at ${multiplier.toFixed(2)}x: ₹${winnings.toFixed(2)}`;
        historyList.appendChild(historyItem);
    } else {
        document.getElementById('feedback').textContent = 'Round ended, no cash out!';
    }
}

// Function to open withdraw modal
document.getElementById('balance').addEventListener('click', function() {
    withdrawModal.style.display = 'block';
});

// Function to close withdraw modal
closeBtn.addEventListener('click', function() {
    withdrawModal.style.display = 'none';
});

// Function to handle withdrawal form submission
withdrawForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const withdrawAmount = parseFloat(document.getElementById('withdraw-amount').value);
    if (withdrawAmount >= 200 && withdrawAmount <= balance) {
        balance -= withdrawAmount;
        updateBalance();
        alert('Withdrawal successful!');
        withdrawModal.style.display = 'none';
    } else {
        alert('Invalid withdrawal amount. Minimum ₹200 or insufficient balance.');
    }
});

// Close modal when clicking outside of it
window.onclick = function(event) {
    if (event.target === withdrawModal) {
        withdrawModal.style.display = 'none';
    }
}
