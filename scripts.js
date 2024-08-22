let walletBalance = parseFloat(localStorage.getItem('walletBalance')) || 50;
let currentBet = 10;
let currentMultiplier = 1.00;
let isBetPlaced = false;
let gameInProgress = false;
let roundMultiplier;
const minWithdrawAmount = 200;
let progressBarInterval;

const walletBalanceElem = document.getElementById('wallet-balance');
const multiplierElem = document.getElementById('multiplier');
const betButton = document.querySelector('.bet-button');
const collectButton = document.querySelector('.collect-button');
const waitingMessage = document.getElementById('waiting-message');
const multiplierSection = document.getElementById('multiplier-section');
const progressBarFill = document.querySelector('.progress-bar-fill');
const withdrawalForm = document.getElementById('withdrawal-form');
const withdrawMessage = document.getElementById('withdraw-message');

// Update wallet balance on screen
function updateWallet() {
    walletBalanceElem.textContent = `Wallet Balance: ₹${walletBalance.toFixed(2)}`;
    localStorage.setItem('walletBalance', walletBalance);
}

// Generate a random multiplier with animation
function startMultiplier() {
    multiplierSection.style.display = 'block';
    waitingMessage.style.display = 'none';

    roundMultiplier = Math.random() * (50 - 1.5) + 1.5;
    roundMultiplier = Math.round(roundMultiplier * 100) / 100;

    let interval = setInterval(() => {
        currentMultiplier += 0.01;
        currentMultiplier = Math.round(currentMultiplier * 100) / 100;
        multiplierElem.textContent = `${currentMultiplier.toFixed(2)}x`;

        if (currentMultiplier >= roundMultiplier) {
            clearInterval(interval);
            endRound();
        }
    }, 50);

    if (isBetPlaced) {
        collectButton.style.display = 'block';
    }
}

// End the current round
function endRound() {
    gameInProgress = false;
    if (isBetPlaced && currentMultiplier >= roundMultiplier) {
        let winAmount = currentBet * currentMultiplier;
        walletBalance += winAmount;
        updateWallet();
        collectButton.style.display = 'none';
    } else {
        waitingMessage.innerHTML = `Lost ₹${currentBet.toFixed(2)} (Multiplier: ${currentMultiplier.toFixed(2)}x)`;
    }

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
        betButton.style.display = 'none';
        collectButton.style.display = 'block'; // Align the collect button in place of the bet button
        startMultiplier();
    }
});

// Collect winnings
collectButton.addEventListener('click', () => {
    if (isBetPlaced && gameInProgress) {
        collectButton.style.display = 'none';
        betButton.style.display = 'block';
        endRound();
    }
});

// Withdrawal form popup on wallet click
walletBalanceElem.addEventListener('click', () => {
    withdrawalForm.style.display = 'block';
    withdrawalForm.scrollIntoView();
});

// Handle withdrawal form submission
document.getElementById('submit-withdrawal').addEventListener('click', () => {
    let recipientName = document.getElementById('recipient-name').value;
    let accountNumber = document.getElementById('account-number').value;
    let ifscCode = document.getElementById('ifsc-code').value;
    let email = document.getElementById('email').value;
    let whatsapp = document.getElementById('whatsapp').value;

    if (walletBalance >= minWithdrawAmount) {
        // Save data and display success message
        localStorage.setItem('withdrawalInfo', JSON.stringify({
            recipientName,
            accountNumber,
            ifscCode,
            email,
            whatsapp
        }));
        withdrawMessage.innerHTML = 'Withdrawal Successful!';
        walletBalance = 0;
        updateWallet();
    } else {
        withdrawMessage.innerHTML = `Insufficient balance! Minimum withdrawal amount is ₹${minWithdrawAmount}.`;
    }
});

// Update progress bar
function startProgressBar() {
    let progress = 0;
    progressBarInterval = setInterval(() => {
        progress += 1;
        progressBarFill.style.width = `${progress}%`;

        if (progress >= 100) {
            clearInterval(progressBarInterval);
        }
    }, 30);
}

window.onload = function() {
    startProgressBar();
    startMultiplier();
};

updateWallet();
