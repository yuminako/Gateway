const express = require('express');
const http = require('http');
const Gateway = require('./gateway');

const PORT = process.env.PORT || 6235;
const app = express();
const server = http.createServer(app);

const gateway = new Gateway('127.0.0.1', 8080);
gateway.startServer();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Route pour récupérer les logs
app.get('/logs', (req, res) => {
    const logs = gateway.getLogs(); // Utilisation de la méthode getLogs de la classe Gateway
    res.json(logs);
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});