let wallet = 500;
let betAmount = 10;

document.getElementById('wallet').innerText = `Wallet: ₹${wallet}`;
document.getElementById('betButton').addEventListener('click', placeBet);
document.getElementById('collectButton').addEventListener('click', collectWinnings);

function placeBet() {
    wallet -= betAmount;
    updateWallet();
    document.getElementById('betButton').style.display = 'none';
    document.getElementById('collectButton').style.display = 'inline-block';
    startMultiplier();
}

function collectWinnings() {
    let multiplier = getMultiplier();
    let winnings = betAmount * multiplier;
    wallet += winnings;
    updateWallet();
    addToHistory(multiplier, 'Collected');
    resetGame();
}

function startMultiplier() {
    let multiplier = getMultiplier();
    document.getElementById('multiplierDisplay').innerText = `${multiplier}x`;
    setTimeout(() => {
        if (Math.random() > 0.5) {
            addToHistory(multiplier, 'Flew Away');
            resetGame();
        }
    }, 3000); // Simulate multiplier animation
}

function getMultiplier() {
    return parseFloat((Math.random() * (999 - 1) + 1).toFixed(2));
}

function addToHistory(multiplier, status) {
    let historyList = document.getElementById('historyList');
    let roundItem = document.createElement('div');
    roundItem.classList.add('round-item');
    roundItem.innerText = `${multiplier}x - ${status}`;
    historyList.prepend(roundItem);
}

function updateWallet() {
    document.getElementById('wallet').innerText = `Wallet: ₹${wallet}`;
    localStorage.setItem('wallet', wallet);
}

function resetGame() {
    document.getElementById('betButton').style.display = 'inline-block';
    document.getElementById('collectButton').style.display = 'none';
    document.getElementById('multiplierDisplay').innerText = 'Waiting for Next Round...';
}

function loadWallet() {
    let storedWallet = localStorage.getItem('wallet');
    if (storedWallet) {
        wallet = parseInt(storedWallet, 10);
        updateWallet();
    }
}

loadWallet();
