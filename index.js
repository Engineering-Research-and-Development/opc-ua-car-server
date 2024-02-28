var opcua = require("node-opcua");
var carAS = require("./Car/Car1/Car_object");
var os = require("os");
var hostname = os.hostname();

const config = require('./config');

// Let's create an instance of OPCUAServer

// 2.0 resourcePath must start with '/'
var server = new opcua.OPCUAServer({
    port: parseInt(config.port), // the port of the listening socket of the server
    resourcePath: config.resourcePath, // this path will be added to the endpoint resource name
    buildInfo : {
		productName: config.productName,
        buildNumber: "30620",
        buildDate: new Date(2020,06,30)
    },
  	serverCertificateManager: new opcua.OPCUACertificateManager({
  		automaticallyAcceptUnknownCertificate: true,
  		rootFolder: "node_modules/node-opcua-server-discovery/certificates"
  	})
});

function post_initialize() {
    console.log("initialized");

    var TimingSharedProperties = {
        "accelerationDeltaTime": 1000,
        "temperatureDeltaTime": 1000,
        "pressuresDeltaTime": 1000,
        "oxigenDeltaTime": 1000
    }

    carAS.construct_my_address_space(server, TimingSharedProperties);

    server.start(function() {
        console.log("Server is now listening ... (press CTRL+C to stop)");
        const url = "opc.tcp://" + hostname + ":" + server.options.port + server.options.resourcePath;
        console.log("Primary server endpoint URL is ", url)
        console.log("\nServer options:\n", server.options);
    });

}
server.initialize(post_initialize);
