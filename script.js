let multiplier = 1;
let isGameRunning = false;
let betAmount = 0;
let gameHistory = [];

const planeContainer = document.querySelector('.plane-container');
const multiplierElement = document.getElementById('multiplier');
const betAmountInput = document.getElementById('bet-amount');
const placeBetButton = document.getElementById('place-bet');
const gameHistoryList = document.getElementById('game-history');
const withdrawalAmountInput = document.getElementById('withdrawal-amount');
const withdrawButton = document.getElementById('withdraw');

function startGame() {
    if (!isGameRunning) {
        betAmount = parseInt(betAmountInput.value);
        if (isNaN(betAmount) || betAmount <= 0) {
            alert('Please enter a valid bet amount.');
            return;
        }

        isGameRunning = true;
        planeContainer.style.bottom = '0';

        let intervalId = setInterval(() => {
            multiplier += 0.1;
            multiplierElement.textContent = `${multiplier.toFixed(2)}x`;

            if (Math.random() < 0.01 * multiplier) {
                clearInterval(intervalId);
                isGameRunning = false;
                gameHistory.push({ bet: betAmount, win: betAmount * multiplier });
                updateGameHistory();
                alert(`Game Over! You won ${betAmount * multiplier}`);
            }
        }, 100);
    }
}

function updateGameHistory() {
    gameHistoryList.innerHTML = '';
    gameHistory.forEach((round) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Bet: ${round.bet}, Win: ${round.win}`;
        gameHistoryList.appendChild(listItem);
    });
}

function withdraw() {
    const withdrawalAmount = parseInt(withdrawalAmountInput.value);
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
        alert('Please enter a valid withdrawal amount.');
        return;
    }

    // Implement withdrawal logic here, e.g., call an API to process the withdrawal
    alert(`Withdrawal of ${withdrawalAmount} is successful.`);
}

placeBetButton.addEventListener('click', startGame);
withdrawButton.addEventListener('click', withdraw);
