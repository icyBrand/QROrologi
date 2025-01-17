const WINNING_PROBABILITY = 0.01; // 1% di probabilità di vincita
const COOLDOWN_HOURS = 24; // Periodo di attesa in ore
const ADMIN_PASSWORD = "password123"; // Cambia questa con una password sicura

function generateUniqueCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function getLastPlayTime() {
    return localStorage.getItem('lastPlayTime');
}

function setLastPlayTime() {
    localStorage.setItem('lastPlayTime', Date.now());
}

function canPlay() {
    const lastPlayTime = getLastPlayTime();
    if (!lastPlayTime) return true;
    
    const timeSinceLastPlay = Date.now() - parseInt(lastPlayTime);
    return timeSinceLastPlay > COOLDOWN_HOURS * 60 * 60 * 1000;
}

function getStats() {
    return {
        totalPlays: parseInt(localStorage.getItem('totalPlays') || '0'),
        totalWins: parseInt(localStorage.getItem('totalWins') || '0')
    };
}

function updateStats(won) {
    let stats = getStats();
    stats.totalPlays++;
    if (won) stats.totalWins++;
    localStorage.setItem('totalPlays', stats.totalPlays.toString());
    localStorage.setItem('totalWins', stats.totalWins.toString());
    return stats;
}

function updateTimer() {
    const lastPlayTime = getLastPlayTime();
    if (!lastPlayTime) return;

    const timeSinceLastPlay = Date.now() - parseInt(lastPlayTime);
    const timeLeft = COOLDOWN_HOURS * 60 * 60 * 1000 - timeSinceLastPlay;

    if (timeLeft > 0) {
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        const timerElement = document.getElementById('timer');
        timerElement.textContent = `Tempo rimanente: ${hours}h ${minutes}m ${seconds}s`;
        setTimeout(updateTimer, 1000);
    } else {
        document.getElementById('timer').textContent = '';
        playLottery();
    }
}

function playLottery() {
    const resultElement = document.getElementById('result');
    const codeElement = document.getElementById('code');
    const timerElement = document.getElementById('timer');
    
    if (!canPlay()) {
        updateTimer();
        resultElement.textContent = "Devi attendere prima di giocare di nuovo.";
        resultElement.style.color = "#dc3545";
        codeElement.textContent = "";
        return;
    }
    
    setLastPlayTime();
    
    const won = Math.random() < WINNING_PROBABILITY;
    
    if (won) {
        const uniqueCode = generateUniqueCode();
        resultElement.textContent = "Hai vinto!";
        resultElement.style.color = "#28a745";
        codeElement.textContent = `Codice: ${uniqueCode}`;
    } else {
        resultElement.textContent = "Ritenta, sarai più fortunato!";
        resultElement.style.color = "#dc3545";
        codeElement.textContent = "";
    }

    updateStats(won);
    timerElement.textContent = "";
    setTimeout(updateTimer, 1000);
    // sendResultToServer(won, uniqueCode);
}

function showStats() {
    const stats = getStats();
    const statsElement = document.getElementById('stats');
    statsElement.innerHTML = `
        <p>Totale giocate: ${stats.totalPlays}</p>
        <p>Totale vincite: ${stats.totalWins}</p>
    `;
}

function adminLogin() {
    const password = document.getElementById('adminPassword').value;
    if (password === ADMIN_PASSWORD) {
        showStats();
        document.getElementById('adminPassword').style.display = 'none';
        document.getElementById('adminLogin').style.display = 'none';
    } else {
        alert('Password errata!');
    }
}

window.onload = function() {
    playLottery();
    document.getElementById('showAdmin').addEventListener('click', function() {
        document.getElementById('adminPanel').style.display = 'block';
    });
    document.getElementById('adminLogin').addEventListener('click', adminLogin);
};
