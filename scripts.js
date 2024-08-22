let walletBalance = parseFloat(localStorage.getItem('walletBalance')) || 500;
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
    localStorage.setItem('walletBalance', walletBalance);
}

// Generate a random multiplier with animation
function startMultiplier() {
    multiplierSection.style.display = 'block';
    waitingMessage.style.display = 'none';

    let roundMultiplier = Math.random() * (999 - 1.5) + 1.5;
    roundMultiplier = Math.round(roundMultiplier * 100) / 100;

    let interval = setInterval(() => {
        currentMultiplier += 0.01;
        currentMultiplier = Math.round(currentMultiplier * 100) / 100;
        multiplierElem.textContent = `${currentMultiplier.toFixed(2)}x`;

        if (currentMultiplier >= roundMultiplier) {
            clearInterval(interval);
            endRound(roundMultiplier);
        }
    }, 50);

    if (isBetPlaced) {
        collectSection.style.display = 'block';
    }
}

// End the current round
function endRound(roundMultiplier) {
    gameInProgress = false;

    if (isBetPlaced && currentMultiplier >= roundMultiplier) {
        let winAmount = currentBet * currentMultiplier;
        walletBalance += winAmount;
        updateWallet();

        betsList.innerHTML += `<p>Won ₹${winAmount.toFixed(2)} (Multiplier: ${currentMultiplier.toFixed(2)}x)</p>`;
    } else {
        betsList.innerHTML += `<p>Lost ₹${currentBet.toFixed(2)} (Multiplier: ${currentMultiplier.toFixed(2)}x)</p>`;
    }

    roundHistory.innerHTML += `<li>${currentMultiplier.toFixed(2)}x</li>`;
    collectSection.style.display = 'none';
    isBetPlaced = false;
    currentMultiplier = 1.00;
    multiplierSection.style.display = 'none';
    waitingMessage.style.display = 'block';

    setTimeout(() => {
        startMultiplier();
    }, 3000);
}

// Place a bet
betButton.addEventListener('click', () => {
    if (!gameInProgress && walletBalance >= currentBet) {
        walletBalance -= currentBet;
        updateWallet();
        isBetPlaced = true;
        gameInProgress = true;
        startMultiplier();
    }
});

// Collect winnings
collectButton.addEventListener('click', () => {
    if (isBetPlaced && gameInProgress) {
        gameInProgress = false;
        collectSection.style.display = 'none';
        betsList.innerHTML += `<p>Collected at ${currentMultiplier.toFixed(2)}x</p>`;
        let winAmount = currentBet * currentMultiplier;
        walletBalance += winAmount;
        updateWallet();
        isBetPlaced = false;
    }
});

// Withdraw funds
withdrawButton.addEventListener('click', () => {
    const withdrawAmount = parseFloat(withdrawAmountInput.value);

    if (withdrawAmount >= minWithdrawAmount && withdrawAmount <= walletBalance) {
        walletBalance -= withdrawAmount;
        updateWallet();
        withdrawMessage.textContent = `Successfully withdrew ₹${withdrawAmount.toFixed(2)}.`;
        withdrawMessage.style.color = 'green';
    } else if (withdrawAmount < minWithdrawAmount) {
        withdrawMessage.textContent = `Minimum withdraw amount is ₹${minWithdrawAmount}.`;
        withdrawMessage.style.color = 'red';
    } else {
        withdrawMessage.textContent = 'Insufficient funds.';
        withdrawMessage.style.color = 'red';
    }

    withdrawAmountInput.value = '';
});

// Select bet option
document.querySelectorAll('.bet-option').forEach(option => {
    option.addEventListener('click', (e) => {
        currentBet = parseFloat(e.target.getAttribute('data-bet'));
        betButton.textContent = `BET ₹${currentBet.toFixed(2)}`;
    });
});

// Initialize wallet
updateWallet();
