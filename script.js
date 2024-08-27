// Initialize game variables
let balance = 0;
let betAmount = 0;
let multiplier = 1;
let crashPoint = null;

// Initialize game history
let gameHistory = [];

// Initialize plane and crash point
let plane = document.querySelector('.plane');
let crashPointContainer = document.querySelector('.crash-point-container');

// Set up event listeners
document.getElementById('bet-button').addEventListener('click', placeBet);
document.getElementById('withdrawal-button').addEventListener('click', withdraw);

// Function to place a bet
function placeBet() {
    betAmount = parseInt(document.getElementById('bet-amount').value);
    if (isNaN(betAmount) || betAmount <= 0) {
        alert('Invalid bet amount');
        return;
    }
    
    // Calculate new balance
    balance += betAmount * multiplier;

    // Update game history
    gameHistory.push(`Bet ${betAmount} x ${multiplier}`);
    
    // Reset game variables
    multiplier = 1;
    
    // Start the game loop
    startGame();
}

// Function to withdraw winnings
function withdraw() {
    let withdrawalAmount = parseInt(document.getElementById('withdrawal-amount').value);
    
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0 || withdrawalAmount > balance) {
        alert('Invalid withdrawal amount');
        return;
    }
    
    // Update balance
    balance -= withdrawalAmount;

    // Update game history
    gameHistory.push(`Withdrawal ${withdrawalAmount}`);
    
    // Reset game variables
    balance = 0;

    // Display updated balance
    document.getElementById('balance').textContent = `Balance: $${balance}`;
}

// Function to start the game loop
function startGame() {
    // Set up the plane and crash point
    plane.style.top = '0';
    
    // Start the timer
    let timer = setInterval(() => {
        // Calculate new crash point
        crashPoint = Math.floor(Math.random() * (100 - 1)) + 1;

        // Update the plane and crash point
        plane.style.top = `${crashPoint}px`;
        
        // Check if the plane has crashed
        if (crashPoint <= window.innerHeight) {
            // Calculate the new multiplier
            multiplier = Math.floor(Math.random() * (5 - 1)) + 1;

            // Update the game history and balance
            gameHistory.push(`Crash at ${crashPoint}, Multiplier x${multiplier}`);
            balance += betAmount * multiplier;

            // Display updated balance
            document.getElementById('balance').textContent = `Balance: $${balance}`;

            // Reset game variables
            multiplier = 1;

            // Clear the timer
            clearInterval(timer);
        }
        
        // Check if the user has won or lost
        if (balance <= 0) {
            alert(`You have lost all your money!`);
            location.reload();
        }
        
        // Check if the user has reached their goal
        if (balance >= goal) {
            alert(`You have reached your goal!`);
            location.reload();
        }
        
        // Update the game history list
        document.getElementById('history-list').innerHTML = '';
        gameHistory.forEach((item) => {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            document.getElementById('history-list').appendChild(listItem);
        });
        
        // Display the updated balance and history
        document.getElementById('balance').textContent = `Balance: $${balance}`;
        
        // Start the game loop again
        startGame();
        
}, 1000);
