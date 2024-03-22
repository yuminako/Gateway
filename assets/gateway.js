const net = require('net');
const Node = require('./node'); // Importer la classe Node

class Gateway {
    constructor(ip, port) {
        this.ip = ip;
        this.port = port;
        this.server = net.createServer();
        this.nodes = [];
        this.otherGateways = [];
        this.logs = [];
    }

    addNode(node) {
        this.nodes.push(node);
        this.logs.push(`[${this.getCurrentDateTime()}] Node connected: ${node.ip}:${node.port}`);
        this.logAllNodesAndGateways();
    }

    removeNode(node) {
        const index = this.nodes.indexOf(node);
        if (index !== -1) {
            this.nodes.splice(index, 1);
            this.logs.push(`[${this.getCurrentDateTime()}] Node disconnected: ${node.ip}:${node.port}`);
            this.logAllNodesAndGateways();
        }
    }

    sendDataToNodes(data) {
        this.nodes.forEach((node) => {
            node.sendDataToGateway(data); // Utiliser la méthode sendDataToGateway de la classe Node
        });
        this.otherGateways.forEach((gateway) => {
            gateway.sendDataToGateway(data);
        });
        this.logs.push(`[${this.getCurrentDateTime()}] Sent data to nodes and gateways: ${data}`);
    }

    startServer() {
        this.server.listen(this.port, this.ip, () => {
            this.logs.push(`[${this.getCurrentDateTime()}] Gateway server is running on ${this.ip}:${this.port}`);
        });

        this.server.on('connection', (socket) => {
            const newNode = new Node(socket.remoteAddress, socket.remotePort); // Créer une nouvelle instance de Node
            this.addNode(newNode);
            this.logs.push(`[${this.getCurrentDateTime()}] Gateway ${this.ip}:${this.port} connected to node: ${newNode.ip}:${newNode.port}`);
            socket.on('data', (data) => {
                this.logs.push(`[${this.getCurrentDateTime()}] Received data from node: ${newNode.ip}:${newNode.port}: ${data}`);
                this.sendDataToNodes(data);
            });
            socket.on('close', () => {
                this.removeNode(newNode);
                this.logs.push(`[${this.getCurrentDateTime()}] Node disconnected: ${newNode.ip}:${newNode.port}`);
            });
        });
    }

    sendDataToGateway(data) {
        this.nodes.forEach((node) => {
            node.sendDataToGateway(data);
        });
        this.logs.push(`[${this.getCurrentDateTime()}] Sent data to nodes: ${data}`);
    }

    getCurrentDateTime() {
        const now = new Date();
        return now.toISOString();
    }

    logAllNodesAndGateways() {
        const allNodes = this.nodes.map(node => `${node.ip}:${node.port}`).join(', ');
        const allGateways = this.otherGateways.map(gateway => `Gateway: ${gateway}`).join(', ');
        this.logs.push(`[${this.getCurrentDateTime()}] All Nodes: ${allNodes}`);
        this.logs.push(`[${this.getCurrentDateTime()}] All Gateways: ${allGateways}`);
    }

    getLogs() {
        return this.logs;
    }
}

module.exports = Gateway;