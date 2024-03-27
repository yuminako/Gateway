const net = require('net');
const NodeClass = require('./node');

class Node {
    constructor(id, ip, port) {
        this.id = id;
        this.ip = ip;
        this.port = port;
        this.logs = [];
        this.confiance = 33.33;
    }

    log(message) {
        const timestamp = new Date().toISOString();
        this.logs.push(`[${timestamp}] ${message}`);
    }

    modifyConfiance(value, reason, detail) {
        this.confiance = (this.confiance + value) / 2;
        this.log(`Confiance modified by ${value} for [${reason}] : ${detail}`);
    }

    getNodeId() {
        return this.id;
    }

    getNodeIp() {
        return this.ip;
    }

    getNodePort() {
        return this.port;
    }
}

class Gateway {
    constructor(ip, port) {
        this.ip = ip;
        this.port = port;
        this.server = net.createServer();
        this.nodes = [];
        this.gateways = [];
        this.logs = [];
    }

    findNodeById(nodeId) {
        return this.nodes.find(node => node.id === nodeId);
    }

    addNode(node) {
        let nodeitem = {id: node.getNodeId(), ip: node.getNodeIp(), port: node.getNodePort()};
        this.nodes.push(nodeitem);
        this.log(`Node connected: ${node.ip}:${node.port}`);
        this.logAllNodes();
        this.sendNodeListToGateways(); // Send the node list to all other gateways
    }

    removeNode(node) {
        const index = this.nodes.indexOf(node);
        if (index !== -1) {
            this.nodes.splice(index, 1);
            this.log(`Node disconnected: ${node.ip}:${node.port}`);
            this.logAllNodes();
            this.sendNodeListToGateways(); // Send the updated node list to all other gateways
        }
    }

    addGateway(gateway) {
        this.gateways.push(gateway);
        this.log(`Gateway connected: ${gateway.ip}:${gateway.port}`);
        this.sendNodeListToGateway(gateway); // Send the node list to the newly connected gateway
    }

    removeGateway(gateway) {
        const index = this.gateways.findIndex(gw => gw.ip === gateway.ip && gw.port === gateway.port);
        if (index !== -1) {
            this.gateways.splice(index, 1);
            this.log(`Gateway disconnected: ${gateway.ip}:${gateway.port}`);
        }
    }

    sendDataToNode(nodeId, data) {
        const node = this.nodes.find(node => node.id === nodeId);
        if (node) {
            const client = new net.Socket();
            
            if(findNodeById(nodeId)){
                console.log(findNodeById(nodeId));
            }
            client.connect(node.port, node.ip, () => {
                client.write(data);
                client.end();
            });

            client.on('error', (error) => {
                this.log(`Error sending data to node ${nodeId}: ${error.message}`);
                client.destroy();
            });

            this.log(`Sent data from gateway to node ${nodeId}: ${data}`);
        } else {
            this.log(`Node with ID ${nodeId} not found.`);
        }
    }

    sendDataToNodes(data) {
        this.nodes.forEach(node => {
            const destNodeId = JSON.parse(data).destNodeId;
            
            const client = new net.Socket();

            
            client.connect(node.port, node.ip, () => {
                client.write(data);
                client.end();
            });

            client.on('error', (error) => {
                this.log(`Error sending data to node ${node.id}: ${error.message}`);
                client.destroy();
            });
        });
    }

    startServer() {
        this.server.listen(this.port, this.ip, () => {
            this.log(`Gateway server is running on ${this.ip}:${this.port}`);
        });
    
        this.server.on('connection', (socket) => {
            this.log(`New connection with entity (IP : ${socket.remoteAddress}:${socket.remotePort})`);
    
            socket.on('data', (data) => {
                this.log(`Receive Data with entity (IP : ${socket.remoteAddress}:${socket.remotePort}) (Data : ${data})`);
                
                data = JSON.parse(data);
                if (data.action == 'identificate') {
                    const regexIp = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                    if (data.nodeId && regexIp.test(data.ip) && parseInt(socket.remotePort) >= 0 && parseInt(socket.remotePort) <= 65535 && data.ip == socket.remoteAddress) {
                        let newNode = new Node(data.nodeId, socket.remoteAddress, socket.remotePort);
                        this.addNode(newNode);
                        this.log(`Node ${newNode.id} connected from ${newNode.ip}:${newNode.port}`);
                    } else {
                        this.log(`Received 'identificate' action from node ${socket.remoteAddress}, but no nodeId provided.`);
                        console.log(`${data.nodeId} : ${data.ip}:${data.port} [${parseInt(data.port) >= 0} - ${parseInt(data.port) <= 65535} (${socket.remoteAddress}:${socket.remotePort} ${regexIp.test(data.ip)})]`);
                    }
                } else if (data.action == 'message') {
                    this.log(`Message receive on gateway to node ${data.nodeId} : [${data.message}]`);
                    //this.sendDataToNodes(data); // Redistribute data to all connected nodes
                    this.log(`Message redistributed to all nodes by gateway.`);
                } else {
                    console.log(`Action is not defined [${data}]`);
                }
            });
    
            socket.on('close', () => {
                // this.removeNode(nodeid);
                // this.log(`Node ${newNode.id} disconnected`);
                console.log('Node disconnected');
            });
    
            socket.on('error', (error) => {
                // this.log(`Error connecting to node ${newNode.id}: ${error.message}`);
                socket.destroy();
            });
        });
    }
    

    connectToGateway(ip, port) {
        const socket = new net.Socket();
        socket.connect(port, ip, () => {
            this.addGateway({ ip, port }); // Add the new gateway to the connected gateways list
        });

        socket.on('error', (error) => {
            this.log(`Error connecting to gateway ${ip}:${port}: ${error.message}`);
            socket.destroy(); // Destroy the socket in case of an error to prevent further actions on it
        });

        socket.on('close', () => {
            this.removeGateway({ ip, port }); // Remove the gateway from the connected gateways list upon connection close
        });

        socket.on('data', (data) => {
            try {
                const nodeList = JSON.parse(data.toString());
                nodeList.forEach((nodeInfo) => {
                    const { ip, port } = nodeInfo;
                    const node = new NodeClass.Node(ip, port);
                    this.addNode(node);
                });
            } catch (error) {
                this.log(`Error parsing node list data from gateway ${ip}:${port}: ${error.message}`);
            }
        });
    }

    sendNodeListToGateways() {
        const nodeList = this.nodes.map(node => ({ ip: node.ip, port: node.port }));
        const data = JSON.stringify(nodeList);
        this.gateways.forEach((gateway) => {
            const socket = new net.Socket();
            socket.connect(gateway.port, gateway.ip, () => {
                socket.write(data);
                socket.end(); // Close the connection after sending the data
            });

            socket.on('error', (error) => {
                this.log(`Error sending node list to gateway ${gateway.ip}:${gateway.port}: ${error.message}`);
                socket.destroy(); // Destroy the socket in case of an error to prevent further actions on it
            });
        });
    }

    sendNodeListToGateway(gateway) {
        const nodeList = this.nodes.map(node => ({ ip: node.ip, port: node.port }));
        const data = JSON.stringify(nodeList);
        const socket = new net.Socket();
        socket.connect(gateway.port, gateway.ip, () => {
            socket.write(data);
            socket.end(); // Close the connection after sending the data
        });

        socket.on('error', (error) => {
            this.log(`Error sending node list to gateway ${gateway.ip}:${gateway.port}: ${error.message}`);
            socket.destroy(); // Destroy the socket in case of an error to prevent further actions on it
        });
    }

    log(message) {
        const timestamp = new Date().toISOString();
        this.logs.push(`[${timestamp}] ${message}`);
    }

    logAllNodes() {
        const allNodes = this.nodes.map(node => `${node.ip}:${node.port}`).join(', ');
        this.log(`All Nodes: ${allNodes}`);
    }

    getLogs() {
        return this.logs;
    }

    getNodes() {
        return JSON.stringify(this.nodes);
    }

    getGateways() {
        return this.gateways.length;
    }
}

module.exports = Gateway;
