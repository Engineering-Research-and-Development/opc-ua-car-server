var opcua = require("node-opcua");
var engine_obj = require("./Engine/Engine");
var speed_obj = require("./Speed/Speed");
var err_obj = require("./Error/Error");
var sensors_obj = require("./Sensors/Sensors");

module.exports ={
  construct_my_address_space: function (server, TimingSharedProperties) {

    var addressSpace = server.engine.addressSpace;
    var unusedNamespace = addressSpace.registerNamespace("unusedNamespace"); // index 2
    var namespace = addressSpace.registerNamespace("Siemens"); // index 3

    // console.log("--- NAMESPACE INFO ---");
    // console.log(namespace);    

    objectsfolder = addressSpace.rootFolder.objects;

	// 2.0 addObject is not a method of addressSpace. You must call it on namespace
	// if you wanted to downgrade, you should change addObject, addVariable and addMethod calls within other files 
    var CarObject = namespace.addObject({
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

    var namespaceIndex = 3;

    err_obj.Error(server, namespaceIndex, namespace /* addressSpace */, CarObject, SharedCarProperties, TimingSharedProperties);
    speed_obj.Speed(server, namespaceIndex, namespace /* addressSpace */, CarObject, SharedCarProperties, TimingSharedProperties);
    engine_obj.Engine(server, namespaceIndex, namespace /* addressSpace */, CarObject, SharedCarProperties, TimingSharedProperties);

    var sensors = {
      "DataBlocksGlobal_3_dbRfidCntr_3_ID1_3_xBusy": {
        "refreshPeriod": 10,
        "logicStatus": "1970-01-01T00:00:00.000Z"
      },
      "DataBlocksGlobal_3_dbRfidCntr_3_ID1_3_xDone": {
        "refreshPeriod": 20,
        "logicStatus": "1970-01-01T00:00:00.000Z"
      },
      "ene2_rfid1": {
        "refreshPeriod": 20,
        "logicStatus": "1970-01-01T00:00:00.000Z"
      },
      "ene2_rfid2": {
        "refreshPeriod": 20,
        "logicStatus": "1970-01-01T00:00:00.000Z"
      }
    }
    
    sensors_obj.Sensors(server, namespaceIndex, namespace /* addressSpace */, CarObject, sensors);
  }
}
