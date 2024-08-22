let walletBalance = parseFloat(localStorage.getItem('walletBalance')) || 50;
let currentBet = 10;
let currentMultiplier = 1.00;
let isBetPlaced = false;
let gameInProgress = false;
const minWithdrawAmount = 200;

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
const withdrawButton = document.getElementById('withdraw-button');
const closeModalButton = document.querySelector('.close-btn');
const withdrawForm = document.getElementById('withdraw-form');

// Update wallet balance on screen
function updateWallet() {
    walletBalanceElem.textContent = `Wallet: ₹${walletBalance.toFixed(2)}`;
    localStorage.setItem('walletBalance', walletBalance);
}

// Generate a random multiplier with animation
function startMultiplier() {
    multiplierSection.style.display = 'block';
    waitingMessage.style.display = 'none';

    let roundMultiplier = Math.random() * (5 - 1.5) + 1.5;
    roundMultiplier = Math.round(roundMultiplier * 100) / 100;

    let interval = setInterval(() => {
        currentMultiplier += (currentMultiplier < 5) ? 0.05 : 0.02;
        currentMultiplier = Math.round(currentMultiplier * 100) / 100;
        multiplierElem.textContent = `${currentMultiplier.toFixed(2)}x`;

        if (currentMultiplier >= roundMultiplier) {
            clearInterval(interval);
            endRound(roundMultiplier);
        }
    }, 50);

    if (isBetPlaced) {
        collectSection.style.display = 'block';
        bettingSection.style.display = 'none';
    }
}

// End the current round
function endRound(roundMultiplier) {
    gameInProgress = false;

    if (isBetPlaced && currentMultiplier >= roundMultiplier) {
        let winAmount = currentBet * currentMultiplier;
        walletBalance += winAmount;
        updateWallet();
    }

    collectSection.style.display = 'none';
    bettingSection.style.display = 'block';
    isBetPlaced = false;
    currentMultiplier = 1.00;
    multiplierElem.textContent = '1.00x';
    multiplierSection.style.display = 'none';
    waitingMessage.style.display = 'block';

    addRoundHistory(roundMultiplier);
}

// Add the round result to history
function addRoundHistory(roundMultiplier) {
    const listItem = document.createElement('li');
    listItem.textContent = `Multiplier: ${roundMultiplier.toFixed(2)}x`;
    roundHistory.prepend(listItem);
}

// Handle betting
betButton.addEventListener('click', () => {
    if (!gameInProgress) {
        currentBet = parseFloat(betButton.textContent.split(' ')[1]);
        if (walletBalance >= currentBet) {
            walletBalance -= currentBet;
            updateWallet();
            isBetPlaced = true;
            gameInProgress = true;
            startMultiplier();
        }
    }
});

// Handle collecting
collectButton.addEventListener('click', () => {
    if (gameInProgress && isBetPlaced) {
        walletBalance += currentBet * currentMultiplier;
        updateWallet();
        endRound(currentMultiplier);
    }
});

// Open the withdraw modal
walletBalanceElem.addEventListener('click', () => {
    withdrawModal.style.display = 'flex';
});

// Close the withdraw modal
closeModalButton.addEventListener('click', () => {
    withdrawModal.style.display = 'none';
});

// Handle withdrawal form submission
withdrawForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('recipient-name').value;
    const bankAccount = document.getElementById('bank-account').value;
    const ifsc = document.getElementById('ifsc-code').value;
    const email = document.getElementById('email').value;
    const whatsapp = document.getElementById('whatsapp').value;

    // Store withdrawal info in localStorage
    localStorage.setItem('withdrawInfo', JSON.stringify({ name, bankAccount, ifsc, email, whatsapp }));
    withdrawModal.style.display = 'none';
});

// Initial setup
updateWallet();

// Progress bar animation handling for re-open
let progressBarInterval;

function startProgressBar() {
    let progressBar = document.querySelector('.progress');
    let width = 0;
    progressBarInterval = setInterval(() => {
        if (width >= 100) {
            clearInterval(progressBarInterval);
            startMultiplier();
        } else {
            width++;
            progressBar.style.width = width + '%';
        }
    }, 30);
}

startProgressBar();

// Clear the progress bar interval if the user leaves
window.addEventListener('beforeunload', () => {
    clearInterval(progressBarInterval);
});
