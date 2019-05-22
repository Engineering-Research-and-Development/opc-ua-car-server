var opcua = require("node-opcua");
var carAS = require("./Car/Car1/Car_object");

// Let's create an instance of OPCUAServer
var server = new opcua.OPCUAServer({
    port: 5001, // the port of the listening socket of the server
    resourcePath: "UA/CarServer", // this path will be added to the endpoint resource name
     buildInfo : {
        productName: "CarServer",
        buildNumber: "5001",
        buildDate: new Date(2018,05,01)
    }
});

function post_initialize() {
    console.log("initialized");

    // Some shared car properties
    // All the values are in millisec
    // simulation cycle delta times
    var TimingSharedProperties = {
        accelerationDeltaTime: 1000,
        temperatureDeltaTime: 1000,
        oxigenDeltaTime: 1000
    };

    carAS.construct_my_address_space(server, TimingSharedProperties);
    server.start(function() {
        console.log("Server is now listening ... ( press CTRL+C to stop)");
        console.log("port ", server.endpoints[0].port);
        var endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        console.log(" the primary server endpoint url is ", endpointUrl );
    });
}
server.initialize(post_initialize);
