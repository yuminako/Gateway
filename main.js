const Gateway = require('./assets/gateway');
const express = require('express');
const http = require('http');
const path = require('path');

const PORT = process.env.PORT || 6235;
const app = express();
const server = http.createServer(app);

const gateway = new Gateway('127.0.0.1', 6847);
gateway.startServer();

const staticDir = path.join(__dirname, 'template', 'assets');

// Utilisez express.static pour servir les fichiers statiques depuis le répertoire spécifié
app.use('/template/assets', express.static(staticDir));

app.get('/', (req, res) => {
    res.sendFile(__dirname + `/template/index.html`);
});

app.get('/nodes', (req, res) => {
    const numNodes = gateway.getNodes();
    res.send(`${numNodes}`);
});

app.get('/gateways', (req, res) => {
    const numGateways = gateway.getGateways();
    res.send(`${numGateways}`);
});

app.post('/send_message', (req, res) => {
    const data = req.body;
    console.log(data);
});

app.get('/send_message', (req, res) => {
    const logs = gateway.send_message();
    res.json(logs);
});

// Route pour récupérer les logs
app.get('/logs', (req, res) => {
    const logs = gateway.getLogs(); // Utilisation de la méthode getLogs de la classe Gateway
    res.json(logs);
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// Autoriser toutes les origines CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
