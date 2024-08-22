// scripts.js

document.querySelectorAll('.bet-option').forEach(button => {
    button.addEventListener('click', function() {
        const amount = this.textContent;
        document.querySelector('.bet-button').textContent = `BET ${amount}`;
    });
});
