let canvas, ctx, animationFrameId;
let crashMultiplier = 1.00;
let targetMultiplier = 1.00;
let betAmount = 0;
let cashOutAmount = 0;
let balance = 100;
let hashGenerated = false;

function startGame() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  
  document.getElementById('placeBetButton').addEventListener('click', startNewRound);
  document.getElementById('cashoutButton').addEventListener('click', cashOut);
  
  resetGame();
  animate();
}

function startNewRound() {
  betAmount = parseFloat(document.getElementById('betAmount').value);
  
  if (betAmount > balance) {
    alert('Insufficient balance!');
    return;
  }
  
  balance -= betAmount;
  updateBalance();
  
  resetMultiplier();
  hashGenerated = false;
  
  document.getElementById('cashoutButton').disabled = false;
  
  animate();
}

function cashOut() {
  gameOver();
  
  balance += cashOutAmount;
  updateBalance();
  
  addToHistory(`You cashed out $${cashOutAmount.toFixed(2)}`);
  
  cashOutAmount = 0;
  betAmount = 0;
  targetMultiplier = 1.00;
  hashGenerated = false;
  
  resetMultiplier();
}

function gameOver() {
  cancelAnimationFrame(animationFrameId);
  document.getElementById('cashoutButton').disabled = true;
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGraph();
  
  cashOutAmount = betAmount * crashMultiplier;
  document.getElementById('score').innerText = `Cash Out Amount: $${cashOutAmount.toFixed(2)}`;
  
  if (crashMultiplier >= targetMultiplier && hashGenerated) {
    gameOver();
  } else if (crashMultiplier <= 0) {
    gameOver();
  } else {
    animationFrameId = requestAnimationFrame(animate);
  }
}

function drawGraph() {
  // Draw the graph
}

function resetGame() {
  balance = 100;
  updateBalance();
  
  resetMultiplier();
  hashGenerated = false;
}

function updateBalance() {
  document.getElementById('balance').innerText = `$${balance.toFixed(2)}`;
}

function addToHistory(message) {
  const historyList = document.getElementById('historyList');
  const listItem = document.createElement('li');
  listItem.textContent = message;
  historyList.insertBefore(listItem, historyList.firstChild);
}

startGame();
