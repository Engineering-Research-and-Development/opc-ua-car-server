var temperature = require("./Temperature_datagenerator");
var oxigen = require("./Oxigen_datagenerator");

module.exports = {
  Engine: function(server, namespaceIndex, namespace /* addressSpace */, Car, SharedCarProperties, TimingSharedProperties) {

	var Engine = namespace.addObject({
        componentOf: Car,
        browseName: "Engine"
    });

    temperature.Temperature_datagenerator(namespaceIndex, namespace /* addressSpace */, SharedCarProperties, TimingSharedProperties, Engine);
    oxigen.Oxigen_datagenerator(namespaceIndex, namespace /* addressSpace */, SharedCarProperties, TimingSharedProperties, Engine);
  }
}
