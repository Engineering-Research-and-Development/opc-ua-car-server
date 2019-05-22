var temperature = require("./Temperature_datagenerator");
var oxigen = require("./Oxigen_datagenerator");

module.exports = {
    Engine: function(server, addressSpace, Car, SharedCarProperties, TimingSharedProperties) {
        var Engine = addressSpace.addObject({
            componentOf: Car,
            browseName: "Engine"
        });

        temperature.Temperature_datagenerator(addressSpace, SharedCarProperties, TimingSharedProperties, Engine);
        oxigen.Oxigen_datagenerator(addressSpace, SharedCarProperties, TimingSharedProperties, Engine);
    }
}
