// scripts.js

let walletBalance = 500;
let currentBet = 10;
let currentMultiplier = 1.00;
let isBetPlaced = false;
let gameInProgress = false;
const minWithdrawAmount = 100;

const walletBalanceElem = document.getElementById('wallet-balance');
const multiplierElem = document.getElementById('multiplier');
const betButton = document.querySelector('.bet-button');
const collectButton = document.querySelector('.collect-button');
const betsList = document.querySelector('.bets-list');
const roundHistory = document.getElementById('round-history');
const waitingMessage = document.getElementById('waiting-message');
const multiplierSection = document.getElementById('multiplier-section');
const bettingSection = document.getElementById('betting-section');
const collectSection = document.getElementById('collect-section');
const withdrawButton = document.getElementById('withdraw-button');
const withdrawAmountInput = document.getElementById('withdraw-amount');
const withdrawMessage = document.getElementById('withdraw-message');

// Update wallet balance on screen
function updateWallet() {
    walletBalanceElem.textContent = walletBalance.toFixed(2);
}

// Generate a random multiplier with animation
function generateRandomMultiplier() {
    const maxMultiplier = 10; // Change this to a higher number for more excitement
    const generatedMultiplier = (Math.random() * (maxMultiplier - 1) + 1).toFixed(2);
    let displayMultiplier = 1.00;

    let multiplierInterval = setInterval(() => {
        if (displayMultiplier >= generatedMultiplier) {
            clearInterval(multiplierInterval);
            currentMultiplier = displayMultiplier.toFixed(2);
            if (!isBetPlaced) {
                endGame(false);
            }
            return;
        }
        displayMultiplier += 0.05;
        multiplierElem.textContent = `${displayMultiplier.toFixed(2)}x`;
    }, 100);

    return generatedMultiplier;
}

// Start game after waiting
function startGame() {
    gameInProgress = true;
    waitingMessage.style.display = 'none';
    multiplierSection.style.display = 'block';

    generateRandomMultiplier();

    if (isBetPlaced) {
        setTimeout(() => {
            if (!gameInProgress) return;
            endGame(false); // End the game if not collected
        }, 5000); // Modify this duration based on your preference
    }
}

// End game and reset
function endGame(didCollect) {
    gameInProgress = false;
    waitingMessage.style.display = 'block';
    multiplierSection.style.display = 'none';
    if (didCollect) {
        walletBalance += currentBet * currentMultiplier;
        updateWallet();
        addHistoryEntry(currentMultiplier, true);
    } else {
        walletBalance -= currentBet;
        updateWallet();
        addHistoryEntry(currentMultiplier, false);
    }
    isBetPlaced = false;
    showBetSection();
}

// Add history entry
function addHistoryEntry(multiplier, didCollect) {
    const listItem = document.createElement('li');
    listItem.textContent = `${multiplier}x - ${didCollect ? 'Collected' : 'Flew Away'}`;
    roundHistory.appendChild(listItem);
}

// Place bet
betButton.addEventListener('click', () => {
    isBetPlaced = true;
    hideBetSection();
    setTimeout(startGame, 3000); // Wait for 3 seconds before starting the round
});

// Collect winnings
collectButton.addEventListener('click', () => {
    endGame(true);
});

// Hide bet section and show collect section
function hideBetSection() {
    bettingSection.style.display = 'none';
    collectSection.style.display = 'block';
}

// Show bet section and hide collect section
function showBetSection() {
    bettingSection.style.display = 'block';
    collectSection.style.display = 'none';
}

// Handle withdrawal
withdrawButton.addEventListener('click', () => {
    const withdrawAmount = parseFloat(withdrawAmountInput.value);
    if (isNaN(withdrawAmount) || withdrawAmount < minWithdrawAmount) {
        withdrawMessage.textContent = `Minimum amount for withdrawal is ₹${minWithdrawAmount}.`;
        return;
    }

    if (withdrawAmount > walletBalance) {
        withdrawMessage.textContent = `Insufficient funds.`;
        return;
    }

    walletBalance -= withdrawAmount;
    updateWallet();
    withdrawMessage.textContent = `₹${withdrawAmount.toFixed(2)} withdrawn successfully!`;
});
