const WINNING_PROBABILITY = 0.01; // 1% di probabilità di vincita
const ADMIN_PASSWORD = "password123"; // Cambia questa con una password sicura
const SCAN_COOLDOWN = 5 * 60 * 1000; // 5 minuti in millisecondi

function generateUniqueCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function getStats() {
    return {
        totalScans: parseInt(localStorage.getItem('totalScans') || '0'),
        totalWins: parseInt(localStorage.getItem('totalWins') || '0')
    };
}

function getWinningCodes() {
    return JSON.parse(localStorage.getItem('winningCodes') || '[]');
}

function updateStats(won, uniqueCode = null) {
    let stats = getStats();
    stats.totalScans++;
    if (won) {
        stats.totalWins++;
        let winningCodes = getWinningCodes();
        winningCodes.push({code: uniqueCode, date: new Date().toISOString()});
        localStorage.setItem('winningCodes', JSON.stringify(winningCodes));
    }
    localStorage.setItem('totalScans', stats.totalScans.toString());
    localStorage.setItem('totalWins', stats.totalWins.toString());
    return stats;
}

function canScan() {
    const lastScanTime = localStorage.getItem('lastScanTime');
    if (!lastScanTime) return true;
    
    const timeSinceLastScan = Date.now() - parseInt(lastScanTime);
    return timeSinceLastScan > SCAN_COOLDOWN;
}

function playLottery() {
    const resultElement = document.getElementById('result');
    const codeElement = document.getElementById('code');
    
    if (!canScan()) {
        const timeLeft = Math.ceil((SCAN_COOLDOWN - (Date.now() - parseInt(localStorage.getItem('lastScanTime')))) / 1000 / 60);
        resultElement.textContent = `Attendi ${timeLeft} minuti prima di scansionare di nuovo.`;
        resultElement.style.color = "#dc3545";
        codeElement.textContent = "";
        return;
    }
    
    localStorage.setItem('lastScanTime', Date.now().toString());
    
    const won = Math.random() < WINNING_PROBABILITY;
    let uniqueCode = null;
    
    if (won) {
        uniqueCode = generateUniqueCode();
        resultElement.textContent = "Hai vinto!";
        resultElement.style.color = "#28a745";
        codeElement.textContent = `Codice: ${uniqueCode}`;
    } else {
        resultElement.textContent = "Ritenta, sarai più fortunato!";
        resultElement.style.color = "#dc3545";
        codeElement.textContent = "";
    }

    const stats = updateStats(won, uniqueCode);

    if (document.getElementById('adminPanel').style.display !== 'none') {
        showStats();
    }

    // sendStatsToServer(stats, won, uniqueCode);
}

function showStats() {
    const stats = getStats();
    const winningCodes = getWinningCodes();
    const statsElement = document.getElementById('stats');
    statsElement.innerHTML = `
        <p>Totale scansioni: ${stats.totalScans} | Totale vincite: ${stats.totalWins}</p>
        <h3>Codici vincenti:</h3>
        <ul>
            ${winningCodes.map(win => `<li>${win.code} - ${new Date(win.date).toLocaleString()}</li>`).join('')}
        </ul>
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
    if (canScan()) {
        playLottery();
    } else {
        const resultElement = document.getElementById('result');
        const timeLeft = Math.ceil((SCAN_COOLDOWN - (Date.now() - parseInt(localStorage.getItem('lastScanTime')))) / 1000 / 60);
        resultElement.textContent = `Attendi ${timeLeft} minuti prima di scansionare di nuovo.`;
        resultElement.style.color = "#dc3545";
    }
    document.getElementById('showAdmin').addEventListener('click', function() {
        document.getElementById('adminPanel').style.display = 'block';
    });
    document.getElementById('adminLogin').addEventListener('click', adminLogin);
};
