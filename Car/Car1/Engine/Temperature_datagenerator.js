var opcua = require("node-opcua");

module.exports = {
  Temperature_datagenerator: function(addressSpace, SharedCarProperties, TimingSharedProperties, Engine) {

    var TEMPERATURE_STEP    = 2;
    var MIN_TEMPERATURE     = 20;
    var MAX_TEMPERATURE     = 80;

    var Temperature = MIN_TEMPERATURE; // When the engine is not running this is its temperature

    setInterval(function() {
        if(SharedCarProperties.oxigen > 0) {
            Temperature += TEMPERATURE_STEP;        
        } else {
            Temperature -= TEMPERATURE_STEP;
        }
    
        if(Temperature >= MAX_TEMPERATURE){
            Temperature = MAX_TEMPERATURE;
        } else if (Temperature <= MIN_TEMPERATURE) {
            Temperature = MIN_TEMPERATURE;
        }
    }, TimingSharedProperties.temperatureDeltaTime);

    addressSpace.addVariable({
      componentOf: Engine,
      nodeId: "ns=1;s=Temperature", // some opaque NodeId in namespace 4
      browseName: "Temperature",
      dataType: "Double",
      value: {
        get: function () {
          return new opcua.Variant({dataType: opcua.DataType.Double, value: Temperature });
        }
      }
    });
  }
}
