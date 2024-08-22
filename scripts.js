document.addEventListener("DOMContentLoaded", function() {
    const loadingScreen = document.getElementById("loading-screen");
    const gameContainer = document.querySelector(".game-container");

    // Simulate loading time
    setTimeout(() => {
        loadingScreen.style.display = "none";
        gameContainer.style.display = "block";
    }, 3000);

    let walletBalance = 50.00;
    const walletElement = document.getElementById("wallet-balance");
    const betOptions = document.querySelectorAll(".bet-option");
    const betButton = document.querySelector(".bet-button");
    const collectButton = document.querySelector(".collect-button");
    const progressElement = document.querySelector(".progress");
    const multiplierElement = document.getElementById("multiplier");
    const roundHistory = document.getElementById("round-history");
    let currentBet = 10;
    let isBettingOpen = true;
    let currentMultiplier = 1.00;
    let randomMultiplier = Math.random() * 10 + 1;
    let bettingTimeout;
    let progressInterval;

    // Event listeners for bet options
    betOptions.forEach(option => {
        option.addEventListener("click", function() {
            currentBet = parseInt(this.getAttribute("data-bet"));
            betButton.textContent = `BET ₹${currentBet.toFixed(2)}`;
        });
    });

    // Event listener for the bet button
    betButton.addEventListener("click", function() {
        if (walletBalance >= currentBet && isBettingOpen) {
            walletBalance -= currentBet;
            updateWallet();
            startProgressBar();
            isBettingOpen = false;
            switchToCollectButton();
        } else {
            alert("Insufficient balance or betting is closed.");
        }
    });

    // Event listener for the collect button
    collectButton.addEventListener("click", function() {
        clearInterval(progressInterval);
        const winnings = currentBet * currentMultiplier;
        walletBalance += winnings;
        updateWallet();
        updateRoundHistory(currentMultiplier.toFixed(2));
        resetGame();
    });

    function startProgressBar() {
        progressElement.style.width = "0%";
        multiplierElement.textContent = "1.00x";
        currentMultiplier = 1.00;
        randomMultiplier = Math.random() * 10 + 1;

        progressInterval = setInterval(() => {
            currentMultiplier += 0.01;
            multiplierElement.textContent = `${currentMultiplier.toFixed(2)}x`;
            progressElement.style.width = `${(currentMultiplier / randomMultiplier) * 100}%`;

            if (currentMultiplier >= randomMultiplier) {
                clearInterval(progressInterval);
                updateRoundHistory(currentMultiplier.toFixed(2));
                resetGame();
            }
        }, 100);
    }

    function resetGame() {
        progressElement.style.width = "0%";
        switchToBetButton();
        isBettingOpen = true;
    }

    function updateWallet() {
        walletElement.textContent = `₹${walletBalance.toFixed(2)}`;
    }

    function switchToCollectButton() {
        document.getElementById("betting-section").style.display = "none";
        document.getElementById("collect-section").style.display = "block";
    }

    function switchToBetButton() {
        document.getElementById("betting-section").style.display = "block";
        document.getElementById("collect-section").style.display = "none";
    }

    function updateRoundHistory(multiplier) {
        const historyItem = document.createElement("li");
        historyItem.textContent = `x${multiplier}`;
        roundHistory.insertBefore(historyItem, roundHistory.firstChild);

        if (roundHistory.children.length > 10) {
            roundHistory.removeChild(roundHistory.lastChild);
        }
    }

    // Withdraw form functionality
    const withdrawModal = document.getElementById("withdraw-modal");
    const withdrawForm = document.getElementById("withdraw-form");
    const withdrawButton = document.querySelector(".wallet-section h3");
    const closeWithdrawModal = document.querySelector(".close-btn");

    withdrawButton.addEventListener("click", () => {
        withdrawModal.style.display = "flex";
    });

    closeWithdrawModal.addEventListener("click", () => {
        withdrawModal.style.display = "none";
    });

    withdrawForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const formData = new FormData(withdrawForm);
        const amount = parseFloat(formData.get("withdraw-amount"));

        if (walletBalance >= amount) {
            walletBalance -= amount;
            updateWallet();
            withdrawModal.style.display = "none";
            alert("Withdrawal request submitted successfully!");
        } else {
            alert("Insufficient balance for this withdrawal.");
        }
    });
});
