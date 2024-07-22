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

function updateStats(won) {
    let stats = getStats();
    stats.totalScans++;
    if (won) stats.totalWins++;
    localStorage.setItem('totalScans', stats.totalScans.toString());
    localStorage.setItem('totalWins', stats.totalWins.toString());
    return stats;
}

function playLottery() {
    const resultElement = document.getElementById('result');
    const codeElement = document.getElementById('code');
    
    const won = Math.random() < WINNING_PROBABILITY;
    const stats = updateStats(won);
    
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

    // Aggiorna le statistiche nel pannello admin se è visibile
    if (document.getElementById('adminPanel').style.display !== 'none') {
        showStats();
    }

    // Qui dovresti inviare i dati al server
    // sendStatsToServer(stats, won);
}

function showStats() {
    const stats = getStats();
    const statsElement = document.getElementById('stats');
    statsElement.textContent = `Totale scansioni: ${stats.totalScans} | Totale vincite: ${stats.totalWins}`;
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

// Funzione per inviare i dati al server (da implementare)
function sendStatsToServer(stats, won) {
    // Implementa qui la logica per inviare i dati al tuo server
}

// Event listeners
window.onload = function() {
    playLottery();
    document.getElementById('showAdmin').addEventListener('click', function() {
        document.getElementById('adminPanel').style.display = 'block';
    });
    document.getElementById('adminLogin').addEventListener('click', adminLogin);
};