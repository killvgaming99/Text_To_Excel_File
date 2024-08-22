document.addEventListener("DOMContentLoaded", function () {
    // Display the game after loading screen
    const gameContainer = document.querySelector(".game-container");
    setTimeout(() => {
        gameContainer.style.display = "block";
    }, 3000); // Adjust according to loading screen duration

    // Wallet Balance Management
    let walletBalance = 50.00;
    let betAmount = 10.00;
    let roundInProgress = false;

    const walletBalanceDisplay = document.getElementById("wallet-balance");
    const betButton = document.querySelector(".bet-button");
    const collectButton = document.querySelector(".collect-button");
    const multiplierDisplay = document.getElementById("multiplier");
    const multiplierSection = document.getElementById("multiplier-section");
    const waitingMessage = document.getElementById("waiting-message");
    const roundHistory = document.getElementById("round-history");

    // Withdraw Modal Elements
    const withdrawModal = document.getElementById("withdraw-modal");
    const closeModalBtn = document.querySelector(".close-btn");
    const withdrawForm = document.getElementById("withdraw-form");
    const withdrawMessage = document.getElementById("withdraw-message");

    // Update wallet balance display
    function updateWalletDisplay() {
        walletBalanceDisplay.textContent = `₹${walletBalance.toFixed(2)}`;
    }

    // Place a bet
    betButton.addEventListener("click", function () {
        if (!roundInProgress) {
            if (walletBalance >= betAmount) {
                walletBalance -= betAmount;
                updateWalletDisplay();
                startRound();
            } else {
                alert("Insufficient balance.");
            }
        }
    });

    // Start the round
    function startRound() {
        roundInProgress = true;
        betButton.disabled = true;
        waitingMessage.style.display = "none";
        multiplierSection.style.display = "block";
        collectButton.style.display = "block";

        let multiplier = 1.00;
        let multiplierInterval = setInterval(function () {
            multiplier += 0.01;
            multiplierDisplay.textContent = `${multiplier.toFixed(2)}x`;

            // Check if the multiplier has reached the maximum
            if (multiplier >= 10.00) {
                clearInterval(multiplierInterval);
                endRound(multiplier, false);
            }
        }, 100);

        // Enable collect button and stop the round
        collectButton.addEventListener("click", function () {
            clearInterval(multiplierInterval);
            walletBalance += betAmount * multiplier;
            updateWalletDisplay();
            endRound(multiplier, true);
        });

        // End the round after a certain time
        setTimeout(function () {
            if (roundInProgress) {
                clearInterval(multiplierInterval);
                endRound(multiplier, false);
            }
        }, 10000); // Round lasts for 10 seconds
    }

    // End the round
    function endRound(multiplier, collected) {
        roundInProgress = false;
        betButton.disabled = false;
        waitingMessage.style.display = "block";
        multiplierSection.style.display = "none";
        collectButton.style.display = "none";

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
        withdrawMessage.textContent = "Your withdrawal request has been submitted.";
        setTimeout(() => {
            withdrawModal.style.display = "none";
            withdrawMessage.textContent = "";
        }, 3000);
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
