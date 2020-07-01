var opcua = require("node-opcua");

module.exports = {
  Oxigen_datagenerator: function(namespaceIndex, namespace /* addressSpace */, SharedCarProperties, TimingSharedProperties, Engine) {

    var step = 0;

    setInterval(function(){

      if(SharedCarProperties.stopped == true) {
          SharedCarProperties.oxigen = 0;
      } else {
          // The offset simulates a running engine when the car is stopped
          SharedCarProperties.oxigen = SharedCarProperties.speed * 0.5 + SharedCarProperties.oxigenBoost + 5;
      }

      // An overshoot has been required (acceleration triggered)
      if(SharedCarProperties.boost == 1) {
          SharedCarProperties.oxigenBoost = Math.round( (SharedCarProperties.boostDirection * 20 * Math.sin(step)) * 10 ) / 10;

          step += 0.5;

          if(step >= Math.PI) {
            SharedCarProperties.oxigenBoost = 0;
            SharedCarProperties.boost = 0;
            step = 0;
          }
      }

      if(SharedCarProperties.oxigen <= 0){
        SharedCarProperties.oxigen = 0;
      }

    }, TimingSharedProperties.oxigenDeltaTime);

    namespace.addVariable({
      componentOf: Engine,
      nodeId: "ns=" + namespaceIndex + ";s=Oxigen", // some opaque NodeId in namespace 4
      browseName: "Oxigen",
      dataType: "Double",
      value: {
        get: function () {
          return new opcua.Variant({dataType: opcua.DataType.Double, value: SharedCarProperties.oxigen});
        }
      }
    });
  }
}
