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
    const maxMultiplier = 999;
    let generatedMultiplier = (Math.random() * (maxMultiplier - 1) + 1).toFixed(2);
    multiplierElem.textContent = '1.00x';

    let multiplierInterval = setInterval(() => {
        let displayMultiplier = parseFloat(multiplierElem.textContent);
        displayMultiplier += 0.05;
        multiplierElem.textContent = `${displayMultiplier.toFixed(2)}x`;

        if (displayMultiplier >= generatedMultiplier) {
            clearInterval(multiplierInterval);
            currentMultiplier = displayMultiplier.toFixed(2);
            if (!isBetPlaced) {
                endGame(false);
            }
        }
    }, 50);

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

            endGame(true);
        }, 5000);
    } else {
        setTimeout(() => {
            endGame(false);
        }, 5000);
    }
}

// End game, update wallet if bet placed
function endGame(betPlaced) {
    gameInProgress = false;

    if (betPlaced && !isBetPlaced) {
        const loss = currentBet;
        walletBalance -= loss;
        updateWallet();
        betsList.innerHTML = `<p>You lost ₹${loss.toFixed(2)}.</p>`;
    }

    addRoundToHistory(currentMultiplier);
    resetGame();
}

// Place a bet
betButton.addEventListener('click', function() {
    if (walletBalance >= currentBet) {
        walletBalance -= currentBet;
        updateWallet();
        isBetPlaced = true;
        bettingSection.style.display = 'none';
        collectSection.style.display = 'block';
        multiplierSection.style.display = 'block';

        startGame();
    }
});

// Collect the bet
collectButton.addEventListener('click', function() {
    if (isBetPlaced && gameInProgress) {
        const winnings = currentBet * parseFloat(currentMultiplier);
        walletBalance += winnings;
        updateWallet();
        betsList.innerHTML = `<p>Collected: ₹${winnings.toFixed(2)}</p>`;
        resetGame();
    }
});

// Reset game state
function resetGame() {
    isBetPlaced = false;
    bettingSection.style.display = 'block';
    collectSection.style.display = 'none';
    multiplierSection.style.display = 'none';
    waitingMessage.style.display = 'block';
}

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

// Handle Withdrawals
withdrawButton.addEventListener('click', function() {
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
