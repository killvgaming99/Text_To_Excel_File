let walletBalance = parseFloat(localStorage.getItem('walletBalance')) || 50;
let currentBet = 10;
let currentMultiplier = 1.00;
let isBetPlaced = false;
let gameInProgress = false;

const walletBalanceElem = document.getElementById('wallet-balance');
const multiplierElem = document.getElementById('multiplier');
const betButton = document.querySelector('.bet-button');
const collectButton = document.querySelector('.collect-button');
const roundHistory = document.getElementById('round-history');
const waitingMessage = document.getElementById('waiting-message');
const multiplierSection = document.getElementById('multiplier-section');
const bettingSection = document.getElementById('betting-section');
const collectSection = document.getElementById('collect-section');
const withdrawModal = document.getElementById('withdraw-modal');
const closeModalButton = document.querySelector('.close-btn');
const withdrawForm = document.getElementById('withdraw-form');

// Update wallet balance on screen
function updateWallet() {
    walletBalanceElem.textContent = `₹${walletBalance.toFixed(2)}`;
    localStorage.setItem('walletBalance', walletBalance);
}

// Generate a random multiplier with animation
function startMultiplier() {
    multiplierSection.style.display = 'block';
    waitingMessage.style.display = 'none';

    let roundMultiplier = Math.random() * (5 - 1.5) + 1.5;
    roundMultiplier = roundMultiplier.toFixed(2);
    currentMultiplier = 1.00;

    const interval = setInterval(() => {
        currentMultiplier += 0.01;
        multiplierElem.textContent = `${currentMultiplier.toFixed(2)}x`;

        if (currentMultiplier >= roundMultiplier || !gameInProgress) {
            clearInterval(interval);
            gameInProgress = false;

            // Update history and reset sections
            addRoundToHistory(currentMultiplier.toFixed(2));
            resetGame();
        }
    }, 50);
}

// Add round result to history
function addRoundToHistory(multiplier) {
    const newHistoryItem = document.createElement('li');
    newHistoryItem.textContent = `${multiplier}x`;
    roundHistory.insertBefore(newHistoryItem, roundHistory.firstChild);
}

// Handle bet placement
betButton.addEventListener('click', () => {
    if (!isBetPlaced && walletBalance >= currentBet) {
        isBetPlaced = true;
        gameInProgress = true;
        walletBalance -= currentBet;
        updateWallet();
        bettingSection.style.display = 'none';
        collectSection.style.display = 'block';
        startMultiplier();
    }
});

// Handle collect action
collectButton.addEventListener('click', () => {
    if (isBetPlaced && gameInProgress) {
        let payout = currentBet * currentMultiplier;
        walletBalance += payout;
        updateWallet();
        gameInProgress = false;
        resetGame();
    }
});

// Reset game state
function resetGame() {
    bettingSection.style.display = 'block';
    collectSection.style.display = 'none';
    multiplierSection.style.display = 'none';
    waitingMessage.style.display = 'block';
    isBetPlaced = false;
    currentMultiplier = 1.00;
}

// Update bet amount when user selects a different bet
document.querySelectorAll('.bet-option').forEach(button => {
    button.addEventListener('click', (e) => {
        currentBet = parseFloat(e.target.dataset.bet);
        betButton.textContent = `BET ₹${currentBet}`;
    });
});

// Handle wallet balance click to open withdraw modal
walletBalanceElem.addEventListener('click', () => {
    withdrawModal.style.display = 'flex';
});

// Handle modal close button
closeModalButton.addEventListener('click', () => {
    withdrawModal.style.display = 'none';
});

// Handle withdraw form submission
withdrawForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Handle form data submission logic here

    document.getElementById('withdraw-message').textContent = 'Withdrawal requested!';
    withdrawModal.style.display = 'none';
});

// Update wallet balance on load
updateWallet();
