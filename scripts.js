document.addEventListener("DOMContentLoaded", function () {
    // Display the game after loading screen
    const gameContainer = document.querySelector(".game-container");
    setTimeout(() => {
        gameContainer.style.display = "block";
    }, 3000); // Adjust according to loading screen duration

    // Wallet Balance Management
    let walletBalance = parseFloat(localStorage.getItem("walletBalance") || 50.00);
    let betAmount = 10.00;
    let roundInProgress = false;
    let multiplier = 1.00;
    let multiplierInterval;

    const walletBalanceDisplay = document.getElementById("wallet-balance");
    const betButton = document.querySelector(".bet-button");
    const collectButton = document.querySelector(".collect-button");
    const multiplierDisplay = document.getElementById("multiplier");
    const multiplierSection = document.getElementById("multiplier-section");
    const waitingMessage = document.getElementById("waiting-message");
    const roundHistory = document.getElementById("round-history");
    const progressBar = document.querySelector(".progress");

    // Withdraw Modal Elements
    const withdrawModal = document.getElementById("withdraw-modal");
    const closeModalBtn = document.querySelector(".close-btn");
    const withdrawForm = document.getElementById("withdraw-form");
    const withdrawMessage = document.getElementById("withdraw-message");

    // Update wallet balance display
    function updateWalletDisplay() {
        walletBalanceDisplay.textContent = `₹${walletBalance.toFixed(2)}`;
        localStorage.setItem("walletBalance", walletBalance);
    }

    // Start the progress bar
    function startProgressBar() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 20; // Increase by 20% each second
            progressBar.style.width = `${progress}%`;
            if (progress >= 100) {
                clearInterval(interval);
                startRound();
            }
        }, 1000);
    }

    // Place a bet
    betButton.addEventListener("click", function () {
        if (!roundInProgress) {
            if (walletBalance >= betAmount) {
                walletBalance -= betAmount;
                updateWalletDisplay();
                startProgressBar();
                betButton.style.display = "none";
                collectButton.style.display = "block";
            } else {
                alert("Insufficient balance.");
            }
        }
    });

    // Start the round
    function startRound() {
        roundInProgress = true;
        waitingMessage.style.display = "none";
        multiplierSection.style.display = "block";

        multiplier = 1.00;
        multiplierInterval = setInterval(() => {
            multiplier += Math.random() * 0.1; // Random increase between 0 and 0.1
            multiplierDisplay.textContent = `${multiplier.toFixed(2)}x`;

            // Check if the multiplier has reached the maximum or "flew away"
            if (multiplier >= 999 || Math.random() < 0.05) { // 5% chance to "fly away"
                clearInterval(multiplierInterval);
                endRound(multiplier, false);
            }
        }, 100);
    }

    // Enable collect button and stop the round
    collectButton.addEventListener("click", function () {
        clearInterval(multiplierInterval);
        walletBalance += betAmount * multiplier;
        updateWalletDisplay();
        endRound(multiplier, true);
    });

    // End the round after a certain time
    function endRound(multiplier, collected) {
        roundInProgress = false;
        betButton.style.display = "block";
        collectButton.style.display = "none";
        waitingMessage.style.display = "block";
        multiplierSection.style.display = "none";

        let roundResult = document.createElement("li");
        if (collected) {
            roundResult.textContent = `You collected at ${multiplier.toFixed(2)}x`;
        } else {
            roundResult.textContent = `Round ended at ${multiplier.toFixed(2)}x`;
        }
        roundHistory.prepend(roundResult);
    }

    // Withdraw Modal functionality
    walletBalanceDisplay.addEventListener("click", function () {
        withdrawModal.style.display = "flex";
    });

    closeModalBtn.addEventListener("click", function () {
        withdrawModal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === withdrawModal) {
            withdrawModal.style.display = "none";
        }
    });

    withdrawForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const withdrawalAmount = parseFloat(document.getElementById("withdraw-amount").value);
        if (withdrawalAmount >= 200 && withdrawalAmount <= walletBalance) {
            walletBalance -= withdrawalAmount;
            updateWalletDisplay();
            withdrawMessage.textContent = "Your withdrawal request has been submitted.";
            setTimeout(() => {
                withdrawModal.style.display = "none";
                withdrawMessage.textContent = "";
            }, 3000);
        } else {
            withdrawMessage.textContent = "Invalid withdrawal amount.";
            setTimeout(() => {
                withdrawMessage.textContent = "";
            }, 3000);
        }
    });

    // Bet options selection
    document.querySelectorAll(".bet-option").forEach(option => {
        option.addEventListener("click", function () {
            betAmount = parseFloat(this.getAttribute("data-bet"));
            betButton.textContent = `BET ₹${betAmount.toFixed(2)}`;
        });
    });

    // Initial update of the wallet display
    updateWalletDisplay();
});
