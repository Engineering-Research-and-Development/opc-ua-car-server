var opcua = require("node-opcua");

module.exports = {
    Oxigen_datagenerator: function(addressSpace, SharedCarProperties, TimingSharedProperties, Engine) {
        var step                    = 0;    // Math.sin argument, used to implement overshoots
        var OXIGEN_OFFSET           = 5;    // It corresponds to the oxigen value when the engine is in IDLE mode
        var OXIGEN_FUNCTION_SLOPE   = 0.5;
        var SIN_UPPER_LIMIT         = 20    // sin: [0, 1] -> [0, 20]
        var ANGULAR_STEP            = 0.5;  // Used for over(under)shoots (in RAD)

        setInterval(function() {
            if(SharedCarProperties.stopped == true) {
                SharedCarProperties.oxigen = 0;
            } else {
                // The offset simulates a running engine when the car is stopped
                SharedCarProperties.oxigen = SharedCarProperties.speed * OXIGEN_FUNCTION_SLOPE + SharedCarProperties.oxigenBoost + OXIGEN_OFFSET;
            }

            // An overshoot has been required (acceleration triggered)
            if(SharedCarProperties.boost == 1) {
                SharedCarProperties.oxigenBoost = SharedCarProperties.boostDirection * SIN_UPPER_LIMIT * Math.sin(step);

                step += ANGULAR_STEP;

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

        addressSpace.addVariable({
            componentOf: Engine,
            nodeId: "ns=1;s=Oxigen", // some opaque NodeId in namespace 4
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
