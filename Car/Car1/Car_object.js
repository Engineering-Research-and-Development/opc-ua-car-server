var opcua = require("node-opcua");
var engine_obj = require("./Engine/Engine");
var speed_obj = require("./Speed/Speed");

module.exports = {
    construct_my_address_space: function (server, TimingSharedProperties) {
        var addressSpace = server.engine.addressSpace;
        objectsfolder = addressSpace.rootFolder.objects;

        var CarObject = addressSpace.addObject({
          organizedBy: addressSpace.rootFolder.objects,
          browseName: "Car"
        });

        var SharedCarProperties = {
            "speed": 0,             // Car speed value
            "oxigenBoost": 0,       // variable offset for oxigen function (used to implement overshoot)
            "boost": 0,             // A flag variable used to determine if an over(under)shoot must be triggered
            "boostDirection": 1,    // boostDir = 1 (overshoot), boostDir = -1 (undershoot)
            "stopped": true,        // stopped = 1 (car stopped), stopped = 0 (car started)
            "oxigen": 0,            // the oxigen value
            "MAX_SPEED": 150,
            "acceleration": 0       // Car acceleration value
        };

        speed_obj.Speed(server, addressSpace, CarObject, SharedCarProperties, TimingSharedProperties);
        engine_obj.Engine(server, addressSpace, CarObject, SharedCarProperties, TimingSharedProperties);
    }
}
