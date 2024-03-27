// log.js

// Variable pour stocker le nombre de logs récupérés précédemment
let previousLogCount = 0;

function updateNodesTable(data) {
    const tbody = document.querySelector("#tbodyNodes");
    tbody.innerHTML = "";
    for (let i = data.length - 1; i >= Math.max(0, data.length - 5); i--) {
      const element = data[i];
      const row = document.createElement("tr");
      const idCell = document.createElement("th");
      idCell.setAttribute("scope", "row");
      idCell.textContent = element.id// element.id.slice(1); // Supprimer le symbole "@" du début
      const ipCell = document.createElement("td");
      ipCell.textContent = element.ip;
      const portCell = document.createElement("td");
      portCell.textContent = element.port;

      const scoreCell = document.createElement("td");
      const score = Math.floor(Math.random() * 101);
      if (score <= 20) {
        color = "bg-gradient-danger";
      }else if (score <= 40) {
        color = "bg-gradient-warning";
        }else if (score <= 60) {
            color = "bg-gradient-success";
        }else if (score <= 80) {
            color = "bg-gradient-info";
        }else if (score <= 100 && score > 80) {
            color = "bg-gradient-primary";
        }


      scoreCell.innerHTML = `
        <div class="d-flex align-items-center">
          <span class="mr-2">${score}%</span>
          <div>
            <div class="progress">
              <div class="progress-bar ${color}" role="progressbar" aria-valuenow="${score}" aria-valuemin="0" aria-valuemax="100" style="width: ${score}%;"></div>
            </div>
          </div>
        </div>`;
  
      // Ajouter les cellules à la ligne
      row.appendChild(idCell);
      row.appendChild(ipCell);
      row.appendChild(portCell);
      row.appendChild(scoreCell);
  
      // Ajouter la ligne au corps du tableau
      tbody.appendChild(row);
    }
  }
  

function fetchNode() {
    fetch('http://127.0.0.1:6235/nodes') // Effectue une requête GET pour récupérer le nombre de nœuds
    .then(response => response.text()) // Transforme la réponse en texte
    .then(data => {
        document.getElementById('nodeNb').textContent = JSON.parse(data).length; // Met à jour le contenu de l'élément HTML avec l'ID 'nodeNb'
        updateNodesTable(JSON.parse(data));
        console.log(data);
    })
    .catch(error => console.error('Error fetching node count:', error));
}

// Fonction pour récupérer le nombre de passerelles depuis le serveur
function fetchGate() {
    fetch('http://127.0.0.1:6235/gateways') // Effectue une requête GET pour récupérer le nombre de passerelles
    .then(response => response.text()) // Transforme la réponse en texte
    .then(data => {
        document.getElementById('gateNb').textContent = data; // Met à jour le contenu de l'élément HTML avec l'ID 'gateNb'
    })
    .catch(error => console.error('Error fetching gateway count:', error));
}

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
                logsDiv.scrollTop = logsDiv.scrollHeight;
            });
        } else {
            // Sinon, récupère uniquement les nouveaux logs depuis la dernière requête
            for (let i = previousLogCount; i < data.length; i++) {
                const logParagraph = document.createElement('p');
                logParagraph.textContent = data[i];
                logsDiv.appendChild(logParagraph);
                logsDiv.scrollTop = logsDiv.scrollHeight;
                
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
    fetchNode(); // Récupère le nombre de nœuds immédiatement
    fetchGate(); // Récupère le nombre de passerelles immédiatement
    setInterval(fetchNode, 1000); // Puis récupère le nombre de nœuds toutes les 5 secondes
    setInterval(fetchGate, 1000);
    setInterval(fetchLogs, 1000); // Puis récupère les logs toutes les 5 secondes
};
