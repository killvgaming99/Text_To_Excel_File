// scripts.js

let walletBalance = 500;
let currentBet = 10;
let currentMultiplier = 1.00;
let isBetPlaced = false;

const walletBalanceElem = document.getElementById('wallet-balance');
const multiplierElem = document.getElementById('multiplier');
const betButton = document.querySelector('.bet-button');
const collectButton = document.querySelector('.collect-button');
const betsList = document.querySelector('.bets-list');
const roundHistory = document.getElementById('round-history');

// Update wallet balance on screen
function updateWallet() {
    walletBalanceElem.textContent = walletBalance.toFixed(2);
}

// Generate a random multiplier between 1x and 999x
function generateRandomMultiplier() {
    return (Math.random() * (999 - 1) + 1).toFixed(2);
}

// Place a bet
betButton.addEventListener('click', function() {
    if (!isBetPlaced && walletBalance >= currentBet) {
        walletBalance -= currentBet;
        updateWallet();
        isBetPlaced = true;
        collectButton.disabled = false;
        betsList.innerHTML = `<p>Bet Placed: ₹${currentBet}</p>`;
        multiplierElem.textContent = '1.00x';

        // Start the multiplier animation
        currentMultiplier = generateRandomMultiplier();
        multiplierElem.textContent = `${currentMultiplier}x`;

        // Add the result to the history
        addRoundToHistory(currentMultiplier);
    }
});

// Collect the bet
collectButton.addEventListener('click', function() {
    if (isBetPlaced) {
        const winnings = currentBet * parseFloat(currentMultiplier);
        walletBalance += winnings;
        updateWallet();
        collectButton.disabled = true;
        isBetPlaced = false;
        betsList.innerHTML = `<p>Collected: ₹${winnings.toFixed(2)}</p>`;
    }
});

// Update the bet amount when an option is selected
document.querySelectorAll('.bet-option').forEach(button => {
    button.addEventListener('click', function() {
        currentBet = parseFloat(this.textContent);
        betButton.textContent = `BET ₹${currentBet.toFixed(2)}`;
    });
});

// Add round to history
function addRoundToHistory(multiplier) {
    const li = document.createElement('li');
    li.textContent = `${multiplier}x`;
    roundHistory.appendChild(li);

    // Limit history to last 10 rounds
    if (roundHistory.children.length > 10) {
        roundHistory.removeChild(roundHistory.children[0]);
    }
}

// Initialize the wallet display
updateWallet();
