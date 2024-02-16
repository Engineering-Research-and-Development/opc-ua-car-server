var opcua = require("node-opcua");

module.exports = {
  Pressures_datagenerator: function(namespaceIndex, namespace /* addressSpace */, SharedCarProperties, TimingSharedProperties, Engine) {

    var PRESSURES_STEP   = 1;
    var MIN_PRESSURE     = 0
    var MAX_PRESSURE     = 100;

    var Pressures = [MIN_PRESSURE, MIN_PRESSURE, MIN_PRESSURE];

    setInterval(function() {
        for(let i=0; i<3; i++) {
            if(SharedCarProperties.oxigen > 0) {
                Pressures[i] += PRESSURES_STEP;
            } else {
                Pressures[i] -= PRESSURES_STEP;
            }
            if(Pressures[i] >= MAX_PRESSURE){
                Pressures[i] = MAX_PRESSURE;
            } else if (Pressures[i] <= MIN_PRESSURE) {
                Pressures[i] = MIN_PRESSURE;
            }
        }
    }, TimingSharedProperties.pressuresDeltaTime);

    namespace.addVariable({
      componentOf: Engine,
      nodeId: "ns=" + namespaceIndex + ";s=Pressures", // some opaque NodeId in namespace 4
      browseName: "Pressures",
      dataType: "String",
      value: {
        get: function () {
          return new opcua.Variant({dataType: opcua.DataType.String, value: JSON.stringify(Pressures) });
        }
      }
    });
  }
}
