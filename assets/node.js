// Node.js
class Node {
    constructor(ip, port) {
        this.ip = ip;
        this.port = port;
    }

    sendDataToGateway(data) {
        // Logique pour envoyer des données à la passerelle
        console.log(`Sending data to gateway from node ${this.ip}:${this.port}: ${data}`);
    }
}

module.exports = Node;
