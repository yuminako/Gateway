// Node.js
class Node {
    constructor(ip, port) {
        this.ip = ip;
        this.port = port;
    }

    receiveDataFromGateway(data) {
        console.log(`Received data from gateway: ${data}`);
        // Traiter les données reçues de la gateway
    }
}

module.exports = Node;
