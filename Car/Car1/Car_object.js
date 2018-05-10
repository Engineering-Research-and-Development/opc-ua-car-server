var opcua = require("node-opcua");
var engine_obj = require("./Engine/Engine");
var speed_obj = require("./Speed/Speed");

module.exports ={
  construct_my_address_space: function (server) {

    var addressSpace = server.engine.addressSpace;

    objectsfolder = addressSpace.rootFolder.objects;

    var CarObject = addressSpace.addObject({
      organizedBy: addressSpace.rootFolder.objects,
      browseName: "Car"
    });
    speed_obj.Speed(server,addressSpace,CarObject);

    engine_obj.Engine(server,addressSpace,CarObject);
    }
}
