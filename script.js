// Function to flash the balance when it updates
function flashBalance() {
    const balanceElement = document.getElementById('balance');
    balanceElement.style.color = '#00ff00';
    setTimeout(() => balanceElement.style.color = '', 500);
}

// Update this function to include the flash effect
function updateBalance() {
    document.getElementById('balance').textContent = balance.toFixed(2);
    localStorage.setItem('balance', balance.toFixed(2));
    flashBalance();
}

// Function to draw the multiplier on the canvas
function drawMultiplier(multiplier) {
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#ffcc00';
    context.font = '50px Arial';
    context.textAlign = 'center';
    context.shadowColor = '#ffcc00';
    context.shadowBlur = 20;
    context.fillText('x' + multiplier, canvas.width / 2, canvas.height / 2);
}
