document.addEventListener('DOMContentLoaded', function () {
    const walletAmountEl = document.getElementById('wallet-amount');
    const betAmountEl = document.getElementById('bet-amount');
    const betButton = document.getElementById('bet-button');
    const collectButton = document.getElementById('collect-button');
    const multiplierDisplay = document.getElementById('multiplier-display');
    const multiplierValueEl = document.getElementById('multiplier-value');
    const waitingEl = document.getElementById('waiting');
    const roundHistoryEl = document.getElementById('round-history');
    const withdrawButton = document.getElementById('withdraw-button');
    const withdrawAmountEl = document.getElementById('withdraw-amount');

    let walletAmount = parseInt(localStorage.getItem('walletAmount')) || 500;
    let currentBet = 0;
    let multiplier = 1;
    let roundInProgress = false;

    walletAmountEl.textContent = walletAmount;

    betButton.addEventListener('click', placeBet);
    collectButton.addEventListener('click', collectWinnings);
    withdrawButton.addEventListener('click', withdrawAmount);

    function placeBet() {
        const betAmount = parseInt(betAmountEl.value);

        if (isNaN(betAmount) || betAmount <= 0 || betAmount > walletAmount) {
            alert('Invalid bet amount!');
            return;
        }

        currentBet = betAmount;
        walletAmount -= betAmount;
        updateWallet();

        betButton.classList.add('hidden');
        collectButton.classList.remove('hidden');
        startRound();
    }

    function startRound() {
        roundInProgress = true;
        waitingEl.classList.add('hidden');
        multiplierDisplay.classList.remove('hidden');

        const interval = setInterval(() => {
            multiplier += 0.01;
            multiplierValueEl.textContent = `${multiplier.toFixed(2)}x`;

            if (Math.random() < 0.01) {  // Random chance to stop
                endRound();
                clearInterval(interval);
            }
        }, 50);
    }

    function endRound() {
        roundInProgress = false;
        waitingEl.classList.remove('hidden');
        multiplierDisplay.classList.add('hidden');

        const result = multiplier.toFixed(2);
        const historyItem = document.createElement('div');
        historyItem.textContent = `${result}x - Flew Away`;
        roundHistoryEl.appendChild(historyItem);
        if (!collectButton.classList.contains('hidden')) {
            walletAmount -= currentBet;
            updateWallet();
        }

        betButton.classList.remove('hidden');
        collectButton.classList.add('hidden');
        multiplier = 1;
    }

    function collectWinnings() {
        const winnings = (currentBet * multiplier).toFixed(2);
        walletAmount += parseFloat(winnings);
        updateWallet();

        const historyItem = document.createElement('div');
        historyItem.textContent = `${multiplier.toFixed(2)}x - Collected`;
        roundHistoryEl.appendChild(historyItem);

        betButton.classList.remove('hidden');
        collectButton.classList.add('hidden');
        multiplier = 1;
    }

    function updateWallet() {
        walletAmountEl.textContent = walletAmount;
        localStorage.setItem('walletAmount', walletAmount);
    }

    function withdrawAmount() {
        const withdrawAmount = parseInt(withdrawAmountEl.value);
        if (isNaN(withdrawAmount) || withdrawAmount < 100 || withdrawAmount > walletAmount) {
            alert('Invalid withdraw amount! Minimum is ₹100.');
            return;
        }
        walletAmount -= withdrawAmount;
        updateWallet();
        alert(`₹${withdrawAmount} withdrawn successfully!`);
    }
});
