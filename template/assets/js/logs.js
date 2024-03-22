// log.js

// Variable pour stocker le nombre de logs récupérés précédemment
let previousLogCount = 0;

// Fonction pour récupérer les logs depuis le serveur
function fetchLogs() {
    fetch('http://127.0.0.1:6235/logs') // Effectue une requête GET vers le chemin /logs du serveur
    .then(response => response.json()) // Transforme la réponse en JSON
    .then(data => {
        const logsDiv = document.getElementById('logs');
        // Si c'est la première fois que nous récupérons les logs, affiche tous les logs
        if (previousLogCount === 0) {
            data.forEach(log => {
                const logParagraph = document.createElement('p');
                logParagraph.textContent = log;
                logsDiv.appendChild(logParagraph);
            });
        } else {
            // Sinon, récupère uniquement les nouveaux logs depuis la dernière requête
            for (let i = previousLogCount; i < data.length; i++) {
                const logParagraph = document.createElement('p');
                logParagraph.textContent = data[i];
                logsDiv.appendChild(logParagraph);
            }
        }
        // Met à jour le nombre de logs récupérés précédemment
        previousLogCount = data.length;
    })
    .catch(error => console.error('Error fetching logs:', error));
}

// Appel de la fonction fetchLogs() toutes les 5 secondes
window.onload = function() {
    fetchLogs(); // Récupère les logs immédiatement
    setInterval(fetchLogs, 5000); // Puis récupère les logs toutes les 5 secondes
};
