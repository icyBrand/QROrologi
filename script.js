const WINNING_PROBABILITY = 0.01; // 1% di probabilità di vincita
const ADMIN_PASSWORD = "password123"; // Cambia questa con una password sicura

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

function hasScanned(qrId) {
    const scannedCodes = JSON.parse(localStorage.getItem('scannedCodes') || '[]');
    return scannedCodes.includes(qrId);
}

function markAsScanned(qrId) {
    const scannedCodes = JSON.parse(localStorage.getItem('scannedCodes') || '[]');
    scannedCodes.push(qrId);
    localStorage.setItem('scannedCodes', JSON.stringify(scannedCodes));
}

function playLottery(qrId) {
    const resultElement = document.getElementById('result');
    const codeElement = document.getElementById('code');
    
    if (hasScanned(qrId)) {
        resultElement.textContent = "Questo QR code è già stato scansionato.";
        resultElement.style.color = "#dc3545";
        codeElement.textContent = "";
        return;
    }
    
    markAsScanned(qrId);
    
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

    // sendStatsToServer(stats, won, uniqueCode, qrId);
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
    const urlParams = new URLSearchParams(window.location.search);
    const qrId = urlParams.get('id') || 'default';
    
    if (!hasScanned(qrId)) {
        playLottery(qrId);
    } else {
        const resultElement = document.getElementById('result');
        resultElement.textContent = "Questo QR code è già stato scansionato.";
        resultElement.style.color = "#dc3545";
    }
    
    document.getElementById('showAdmin').addEventListener('click', function() {
        document.getElementById('adminPanel').style.display = 'block';
    });
    document.getElementById('adminLogin').addEventListener('click', adminLogin);
};
