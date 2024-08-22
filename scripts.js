document.addEventListener("DOMContentLoaded", function () {
    const gameContainer = document.querySelector(".game-container");
    const loadingScreen = document.getElementById("loading-screen");

    // Initial Variables
    let walletBalance = parseFloat(localStorage.getItem("walletBalance")) || 50.00;
    const betButtons = document.querySelectorAll(".bet-option");
    const betButton = document.querySelector(".bet-button");
    const collectButton = document.querySelector(".collect-button");
    const multiplierElement = document.getElementById("multiplier");
    const walletBalanceElement = document.getElementById("wallet-balance");
    const roundHistoryElement = document.getElementById("round-history");
    const bettingSection = document.getElementById("betting-section");
    const collectSection = document.getElementById("collect-section");
    const waitingMessage = document.getElementById("waiting-message");
    const multiplierSection = document.getElementById("multiplier-section");
    const progressBar = document.querySelector(".progress");

    let currentBet = 10;
    let currentMultiplier = 1.00;
    let roundInProgress = false;

    // Update wallet balance display
    function updateWalletBalance() {
        walletBalanceElement.textContent = `₹${walletBalance.toFixed(2)}`;
        localStorage.setItem("walletBalance", walletBalance.toFixed(2));
    }

    // Handle Bet Button Clicks
    betButtons.forEach(button => {
        button.addEventListener("click", () => {
            currentBet = parseFloat(button.dataset.bet);
            betButton.textContent = `BET ₹${currentBet.toFixed(2)}`;
        });
    });

    // Handle BET button click
    betButton.addEventListener("click", () => {
        if (!roundInProgress && walletBalance >= currentBet) {
            walletBalance -= currentBet;
            updateWalletBalance();
            startRound();
        }
    });

    // Handle Collect button click
    collectButton.addEventListener("click", () => {
        if (roundInProgress) {
            walletBalance += currentBet * currentMultiplier;
            updateWalletBalance();
            endRound();
        }
    });

    // Start a new round
    function startRound() {
        roundInProgress = true;
        currentMultiplier = 1.00;
        bettingSection.style.display = "none";
        collectSection.style.display = "block";
        multiplierSection.style.display = "block";
        waitingMessage.style.display = "none";

        const roundInterval = setInterval(() => {
            currentMultiplier += (Math.random() * 0.1).toFixed(2); // Increment multiplier randomly
            multiplierElement.textContent = `${currentMultiplier.toFixed(2)}x`;
        }, 1000);

        setTimeout(() => {
            clearInterval(roundInterval);
            endRound();
        }, Math.floor(Math.random() * 10 + 5) * 1000); // Random duration for each round
    }

    // End the current round
    function endRound() {
        roundInProgress = false;
        bettingSection.style.display = "block";
        collectSection.style.display = "none";
        multiplierSection.style.display = "none";
        waitingMessage.style.display = "block";

        // Add round result to history
        const historyItem = document.createElement("li");
        historyItem.textContent = `Multiplier: ${currentMultiplier.toFixed(2)}x - Bet: ₹${currentBet.toFixed(2)}`;
        roundHistoryElement.prepend(historyItem);

        // Reset progress bar
        progressBar.style.width = "0%";
        setTimeout(() => {
            progressBar.style.width = "100%";
        }, 50);

        // Start next round after delay
        setTimeout(() => {
            startRound();
        }, 5000); // 5 seconds gap between rounds
    }

    // Withdraw Modal Logic
    const withdrawModal = document.getElementById("withdraw-modal");
    const withdrawForm = document.getElementById("withdraw-form");
    const withdrawMessage = document.getElementById("withdraw-message");
    const closeBtn = document.querySelector(".close-btn");

    walletBalanceElement.addEventListener("click", () => {
        withdrawModal.style.display = "flex";
        document.getElementById("withdraw-amount").value = walletBalance.toFixed(2); // Pre-fill with current balance
    });

    closeBtn.addEventListener("click", () => {
        withdrawModal.style.display = "none";
    });

    withdrawForm.addEventListener("submit", (e) => {
        e.preventDefault();
        withdrawMessage.textContent = "Withdrawal Request Sent!";
        withdrawModal.style.display = "none";
    });

    // Load game after loading screen
    setTimeout(() => {
        gameContainer.style.display = "block";
        progressBar.style.width = "100%";
        startRound();
    }, 3000); // 3 seconds loading screen

    // Initial wallet balance update
    updateWalletBalance();
});
